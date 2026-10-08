import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { VehicleSpec, VehicleView, partLabelFor } from './vehicle-diagram.model';

/** Easing for the face coming in — decelerates into place. */
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** Easing for the face leaving — accelerates away. */
const EASE_IN = 'cubic-bezier(0.55, 0, 1, 0.45)';

/** Depth of the perspective camera looking at the turntable. */
const PERSPECTIVE = 1200;

/** Degrees of rotation applied per pixel of pointer travel while dragging. */
const YAW_PER_PX = 0.42;
const PITCH_PER_PX = 0.26;

/** How far the vehicle can be spun by hand before it stops following the cursor. */
const MAX_YAW = 62;
const MAX_PITCH = 34;

/** Drag past this many degrees of yaw and releasing advances to the next view. */
const SWITCH_AT = 30;

/** Pointer travel, in px, before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 4;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Builds the 3D flip between two views: the outgoing face swings away around the
 * Y axis while the incoming face swings in from the opposite side. `dir` is 1 when
 * moving forward through the view list and -1 when moving back.
 */
function flipTransition(dir: 1 | -1) {
  const enterFrom = `perspective(${PERSPECTIVE}px) rotateY(${dir * 72}deg) translateX(${dir * 34}%) scale(0.84)`;
  const leaveTo = `perspective(${PERSPECTIVE}px) rotateY(${dir * -72}deg) translateX(${dir * -34}%) scale(0.84)`;
  const rest = `perspective(${PERSPECTIVE}px) rotateY(0deg) translateX(0) scale(1)`;

  return [
    query('.view-pane:enter', [style({ opacity: 0, transform: enterFrom })], { optional: true }),
    group([
      query(
        '.view-pane:leave',
        [
          style({ opacity: 1, transform: rest }),
          animate(`340ms ${EASE_IN}`, style({ opacity: 0, transform: leaveTo })),
        ],
        { optional: true }
      ),
      query(
        '.view-pane:enter',
        [animate(`520ms 90ms ${EASE_OUT}`, style({ opacity: 1, transform: rest }))],
        { optional: true }
      ),
    ]),
  ];
}

/** What a click on the artwork reports: the part, and the side it was picked from. */
export interface PartToggle {
  partId: string;
  viewId: string;
}

/**
 * Draws one vehicle as a carousel of sides and lets parts be picked off it.
 *
 * It owns nothing about *why* parts are being picked — which parts are marked
 * comes in, each toggle goes out — so the same diagram serves a damage
 * assessment, an inspection checklist, or a read-only summary. Whatever belongs
 * in the panel's top-right corner is projected:
 *
 * ```html
 * <app-vehicle-diagram [vehicle]="vehicle" [marked]="marked" (partToggled)="toggle($event)">
 *   <select diagramAction>…</select>
 * </app-vehicle-diagram>
 * ```
 */
@Component({
  selector: 'app-vehicle-diagram',
  standalone: true,
  template: `
    <div class="relative">
      <!-- Fixed height + overflow-hidden so sides can swing through each other
           without the panel resizing between them. -->
      <div
        #stage
        class="stage relative h-[240px] overflow-hidden rounded-lg bg-gray-100 sm:h-[280px]"
        [class.is-dragging]="dragging"
        [style.perspective.px]="perspective"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event, stage)"
        (pointerup)="onPointerUp($event, stage)"
        (pointercancel)="onPointerUp($event, stage)"
      >
        <!-- Sits over the artwork: which side you are looking at on the left, and
             whatever the host projects on the right. The row itself ignores the
             pointer so it never eats a click meant for the panel underneath. -->
        <div class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3">
          <span class="-mt-[5px] text-3xl font-bold leading-none text-gray-300">{{ view.title }}</span>
          <div class="pointer-events-auto" (pointerdown)="$event.stopPropagation()">
            <ng-content select="[diagramAction]"></ng-content>
          </div>
        </div>

        <div
          class="turntable"
          [class.is-dragging]="dragging"
          [style.transform]="turntableTransform"
          [@viewTransition]="viewIndex"
          [@.disabled]="reduceMotion"
        >
          <!-- Only the active side is in the DOM, so Angular's :enter/:leave queries
               drive the flip when the carousel moves. -->
          @for (v of vehicle.views; track v.id) {
            @if (v.id === view.id) {
              <div class="view-pane">
                <!-- Fills the pane and letterboxes itself, so every side is drawn as
                     large as it will go. Markers live in here too, in the artwork's own
                     units, which is what keeps them pinned to the panel they mark. -->
                <svg
                  class="block h-full w-full select-none"
                  [attr.viewBox]="'0 0 ' + v.w + ' ' + v.h"
                  role="img"
                  [attr.aria-label]="vehicle.name + ', ' + v.label + ' view'"
                >
                  <!-- The artwork, used exactly as authored. Hotspots are traced in
                       this same coordinate space, so the two always align. -->
                  <image
                    class="pointer-events-none"
                    [attr.href]="v.src"
                    x="0"
                    y="0"
                    [attr.width]="v.w"
                    [attr.height]="v.h"
                  />

                  @for (spot of v.hotspots; track spot.id) {
                    <path
                      [class]="partClass(spot.id)"
                      [attr.d]="spot.d"
                      (click)="onPartClick(spot.id)"
                      tabindex="0"
                      role="button"
                      [attr.aria-pressed]="isMarked(spot.id)"
                      (keydown.enter)="togglePart(spot.id)"
                      (keydown.space)="togglePart(spot.id)"
                    >
                      <title>{{ partLabel(spot.id) }}</title>
                    </path>
                  }

                  @for (spot of v.hotspots; track spot.id) {
                    @if (isMarked(spot.id)) {
                      <g class="marker" [attr.transform]="'translate(' + spot.cx + ',' + spot.cy + ')'">
                        <circle r="3.4" />
                        <path d="M-1.3,-1.3 L1.3,1.3 M1.3,-1.3 L-1.3,1.3" />
                      </g>
                    }
                  }
                </svg>
              </div>
            }
          }
        </div>
      </div>

      <button
        type="button"
        class="arrow left-0 -translate-x-1/2"
        [disabled]="!canStepBack"
        (click)="step(-1)"
        aria-label="Previous side"
      >
        &#8249;
      </button>
      <button
        type="button"
        class="arrow right-0 translate-x-1/2"
        [disabled]="!canStepForward"
        (click)="step(1)"
        aria-label="Next side"
      >
        &#8250;
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* perspective is bound in the template so it stays in sync with PERSPECTIVE */
      .stage {
        touch-action: none;
        cursor: grab;
      }
      .stage.is-dragging {
        cursor: grabbing;
      }

      .turntable {
        position: absolute;
        inset: 0;
        transform-style: preserve-3d;
        will-change: transform;
        transition: transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      /* While the pointer is down the vehicle tracks the cursor 1:1 — no easing. */
      .turntable.is-dragging {
        transition: none;
      }

      .view-pane {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem 0.5rem 0.5rem;
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }

      /* --- selectable hotspots, laid over the artwork --- */
      .hotspot {
        cursor: pointer;
        outline: none;
        fill: transparent;
        stroke: transparent;
        stroke-width: 1;
        transition: fill 160ms ease, stroke 160ms ease;
      }
      .hotspot:hover {
        fill: rgba(220, 38, 38, 0.18);
        stroke: #dc2626;
      }
      .hotspot:focus-visible {
        stroke: #dc2626;
        stroke-dasharray: 3 2;
      }

      /* Marked-part badge. Drawn in artwork units: every side is scaled to the same
         pane height and vehicle viewBoxes are all about as tall, so one radius
         renders at near enough the same size on all of them. */
      .marker {
        pointer-events: none;
      }
      .marker circle {
        fill: #dc2626;
        stroke: #fff;
        stroke-width: 0.7;
      }
      .marker path {
        fill: none;
        stroke: #fff;
        stroke-width: 0.7;
        stroke-linecap: round;
      }

      .arrow {
        position: absolute;
        top: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        margin-top: -13px;
        border-radius: 9999px;
        background: #6b1e5f;
        color: #fff;
        font-size: 15px;
        line-height: 1;
        cursor: pointer;
        transition: background 160ms ease;
      }
      .arrow:hover {
        background: #86277a;
      }
      .arrow:focus-visible {
        outline: 2px solid #86277a;
        outline-offset: 2px;
      }
      .arrow:disabled {
        background: #d8d2d6;
        color: #f5f2f4;
        cursor: default;
      }
    `,
  ],
  animations: [
    /**
     * Bound to `viewIndex`, so Angular's :increment / :decrement aliases tell us
     * which way the user moved along the carousel and the vehicle swings in from
     * the matching side.
     */
    trigger('viewTransition', [
      transition(':increment', flipTransition(1)),
      transition(':decrement', flipTransition(-1)),
    ]),
  ],
})
export class VehicleDiagramComponent {
  private currentVehicle!: VehicleSpec;

  /** The vehicle to draw. Switching it returns the carousel to the first side. */
  @Input({ required: true })
  set vehicle(value: VehicleSpec) {
    this.currentVehicle = value;
    this.viewIndex = 0;
  }
  get vehicle(): VehicleSpec {
    return this.currentVehicle;
  }

  /** Part ids currently marked. The diagram only reads this — the host owns it. */
  @Input() marked: readonly string[] = [];

  /** Fires on every pick, with the side it was picked from. */
  @Output() partToggled = new EventEmitter<PartToggle>();

  /** Fires when the carousel moves, for hosts that want to follow along. */
  @Output() viewChange = new EventEmitter<VehicleView>();

  /** Honour the OS "reduce motion" setting by switching the flip animations off. */
  readonly reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- carousel

  /** Position in the view list; the carousel stops at both ends rather than wrapping. */
  viewIndex = 0;

  get view(): VehicleView {
    return this.vehicle.views[this.viewIndex];
  }

  /** False at the first side, which is where the carousel opens. */
  get canStepBack(): boolean {
    return this.viewIndex > 0;
  }

  /** False at the last side. */
  get canStepForward(): boolean {
    return this.viewIndex < this.vehicle.views.length - 1;
  }

  /** Moves `delta` places along the carousel, stopping at either end. */
  step(delta: number): void {
    const next = clamp(this.viewIndex + delta, 0, this.vehicle.views.length - 1);
    if (next === this.viewIndex) {
      return;
    }
    this.viewIndex = next;
    this.viewChange.emit(this.view);
  }

  // ---------------------------------------------------------------- drag state

  /** Camera depth for the 3D stage; bound in the template. */
  readonly perspective = PERSPECTIVE;

  dragging = false;
  /** Live rotation of the turntable, in degrees. */
  dragYaw = 0;
  dragPitch = 0;

  private startX = 0;
  private startY = 0;
  /** True once the pointer travelled far enough to count as a drag rather than a click. */
  private didDrag = false;

  get turntableTransform(): string {
    return `rotateX(${(-this.dragPitch).toFixed(2)}deg) rotateY(${this.dragYaw.toFixed(2)}deg)`;
  }

  onPointerDown(ev: PointerEvent): void {
    if (ev.pointerType === 'mouse' && ev.button !== 0) {
      return;
    }
    this.dragging = true;
    this.didDrag = false;
    this.startX = ev.clientX;
    this.startY = ev.clientY;
  }

  onPointerMove(ev: PointerEvent, stage: HTMLElement): void {
    if (!this.dragging) {
      return;
    }
    // A release that lands outside the window never reaches us, which would leave
    // `dragging` set and have the vehicle follow a button-up cursor from then on.
    // No button still held means the drag is already over.
    if (ev.pointerType === 'mouse' && ev.buttons === 0) {
      this.endDrag(ev, stage);
      return;
    }

    const dx = ev.clientX - this.startX;
    const dy = ev.clientY - this.startY;

    if (!this.didDrag) {
      // Ignore sub-pixel jitter so a plain press still counts as a click.
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) {
        return;
      }
      this.didDrag = true;
      // Capture only once this is unambiguously a drag. Capturing on pointerdown
      // would retarget the following `click` to the stage, and the vehicle panels
      // would never receive it — i.e. nothing would ever be selectable.
      stage.setPointerCapture(ev.pointerId);
    }

    this.dragYaw = clamp(dx * YAW_PER_PX, -MAX_YAW, MAX_YAW);
    this.dragPitch = clamp(dy * PITCH_PER_PX, -MAX_PITCH, MAX_PITCH);
  }

  onPointerUp(ev: PointerEvent, stage: HTMLElement): void {
    if (!this.dragging) {
      return;
    }
    const releasedAt = this.dragYaw;
    this.endDrag(ev, stage);
    // A decisive spin hands over to the next/previous side's flip animation.
    if (releasedAt <= -SWITCH_AT) {
      this.step(1);
    } else if (releasedAt >= SWITCH_AT) {
      this.step(-1);
    }
  }

  /** Drops the turntable back to rest; the eased transition carries it home. */
  private endDrag(ev: PointerEvent, stage: HTMLElement): void {
    this.dragging = false;
    this.dragYaw = 0;
    this.dragPitch = 0;
    if (stage.hasPointerCapture(ev.pointerId)) {
      stage.releasePointerCapture(ev.pointerId);
    }
  }

  // ---------------------------------------------------------------- parts

  /**
   * Click handler for the vehicle hotspots only. The click that fires at the end of
   * a drag must not also toggle whatever happened to be under the cursor; `didDrag`
   * stays set until the next pointerdown on the stage.
   */
  onPartClick(id: string): void {
    if (this.didDrag) {
      return;
    }
    this.togglePart(id);
  }

  togglePart(id: string): void {
    this.partToggled.emit({ partId: id, viewId: this.view.id });
  }

  isMarked(id: string): boolean {
    return this.marked.includes(id);
  }

  partLabel(id: string): string {
    return partLabelFor(this.vehicle, id);
  }

  partClass(id: string): string {
    return this.isMarked(id) ? 'hotspot is-selected' : 'hotspot';
  }
}
