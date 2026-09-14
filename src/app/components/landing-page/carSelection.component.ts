import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';

type ViewId = 'left' | 'front' | 'right' | 'back';

/** A clickable region laid over the artwork; `d` is in the source SVG's own coordinate space. */
interface Hotspot {
  id: string;
  d: string;
}

/**
 * One side of the vehicle. `src` points at the artwork in `public/car-svg/`; `w`/`h`
 * mirror that file's own viewBox so the hotspots below line up with it exactly.
 */
interface ViewSpec {
  id: ViewId;
  label: string;
  src: string;
  w: number;
  h: number;
  hotspots: Hotspot[];
}

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
 * The four views, ordered as a walk around the vehicle: left flank, nose, right
 * flank, tail. Each one draws the matching file from `public/car-svg/` as-is and
 * overlays transparent hotspots on top of it — the artwork is never redrawn, it
 * only provides what the hotspots are traced against.
 *
 * Hotspot ids are shared across views (a `front-bumper` picked from the side is the
 * same part as one picked head-on), so a selection made in one view stays lit in
 * the others. Within a view the list is painted in order, so small parts that sit
 * on top of a larger panel — lamps, mirrors, wheels — come last and win the click.
 */
const VIEWS: ViewSpec[] = [
  {
    id: 'left',
    label: 'left',
    src: 'car-svg/left.svg',
    w: 241,
    h: 88,
    hotspots: [
      { id: 'roof', d: 'M66,6 L78,1.5 L140,1 L161,3.5 L161,8 L139,5.5 L80,6.5 Z' },
      { id: 'windshield', d: 'M62.5,23.5 L66.5,12 L76,7 L83.5,8 L84,23.5 Z' },
      { id: 'hood', d: 'M6,32 L20,25.5 L44,22.5 L62,23.5 L63,30.5 L40,31.5 L14,36 L7,36.5 Z' },
      { id: 'left-front-fender', d: 'M7,37 L18,34.5 L42,31.5 L63,31 L64,44 L62,62 L22,63 L14,50 Z' },
      { id: 'left-cargo-bed', d: 'M162,22 H240 V60 H210.6 A19.2,19.2 0 0 0 172.2,60 H162 Z' },
      { id: 'left-front-door', d: 'M65,25.5 H119 V64 H66 Z M80.5,5 H118 V25.5 H80.5 Z' },
      { id: 'left-rear-door', d: 'M119.5,25.5 H161 V64 H119.5 Z M120,5 H153.5 V25.5 H120 Z' },
      { id: 'front-bumper', d: 'M0,39 L17,37 L21,55 L20,73 L7,75 L0,66 Z' },
      { id: 'rear-bumper', d: 'M225,60 H241 V78 H226 Z' },
      { id: 'left-headlight', d: 'M3,30.5 L21,29 L22.5,40.5 L4,42 Z' },
      { id: 'left-taillight', d: 'M229.5,28 H240.5 V49.5 H230 Z' },
      { id: 'left-mirror', d: 'M70.5,16.5 L83.5,16 L84.5,22.5 L72,24 Z' },
      { id: 'left-tire-front', d: 'M18.8,70 A18.8,18.8 0 1 1 56.4,70 A18.8,18.8 0 1 1 18.8,70 Z' },
      { id: 'left-tire-rear', d: 'M172.6,70 A18.8,18.8 0 1 1 210.2,70 A18.8,18.8 0 1 1 172.6,70 Z' },
    ],
  },
  {
    id: 'front',
    label: 'front',
    src: 'car-svg/front.svg',
    w: 105,
    h: 86,
    hotspots: [
      { id: 'roof', d: 'M20,0 H84 V4.2 H20 Z' },
      { id: 'windshield', d: 'M19,3.2 H85 L88,19 H16 Z' },
      { id: 'hood', d: 'M14,19 L91,19 L92,27 L13,27 Z' },
      { id: 'grille', d: 'M18,27 H87 V45.5 H18 Z' },
      { id: 'front-bumper', d: 'M6,45.5 H99 V76 H6 Z' },
      { id: 'right-headlight', d: 'M4,28 L21,27.5 L22,41 L5,42 Z' },
      { id: 'left-headlight', d: 'M101,28 L84,27.5 L83,41 L100,42 Z' },
      { id: 'right-mirror', d: 'M1,13 L13,12.8 L14.5,18 L13.5,23.5 L2,23 Z' },
      { id: 'left-mirror', d: 'M104,13 L92,12.8 L90.5,18 L91.5,23.5 L103,23 Z' },
      { id: 'right-tire-front', d: 'M0,54 H16 V86 H0 Z' },
      { id: 'left-tire-front', d: 'M89,54 H105 V86 H89 Z' },
    ],
  },
  {
    id: 'right',
    label: 'right',
    src: 'car-svg/right.svg',
    w: 204,
    h: 87,
    hotspots: [
      { id: 'roof', d: 'M69,6 L82,1.5 L131,1 L147,3.5 L147,8 L129,5.5 L83,6.5 Z' },
      { id: 'windshield', d: 'M133,26.5 L135,11 L143,7 L148,8.5 L149,26.5 Z' },
      { id: 'hood', d: 'M152,25.5 L175,24.5 L196,27 L200,33 L176,34.5 L152,34 Z' },
      { id: 'right-front-fender', d: 'M148,31 L172,29 L192,31 L193,44 L190,61 L152,61 L147,45 Z' },
      { id: 'right-cargo-bed', d: 'M1,24 H67 V62 H63 A19.1,19.1 0 0 0 24.8,62 H1 Z' },
      { id: 'right-front-door', d: 'M103,27 H147.5 V62 H104 Z M104,8 H134 V27.5 H104 Z' },
      { id: 'right-rear-door', d: 'M68.5,27 H102.5 V62 H69 Z M75,8.5 H102.5 V27.5 H75 Z' },
      { id: 'front-bumper', d: 'M190,50 L204,48 L204,70 L196,78 L188,74 Z' },
      { id: 'rear-bumper', d: 'M0,59 H17 V72 H0 Z' },
      { id: 'right-headlight', d: 'M183,33 L200,31.5 L201,42 L185,43.5 Z' },
      { id: 'right-taillight', d: 'M0,29 H9 V50 H0 Z' },
      { id: 'right-mirror', d: 'M128,19 L141,18.5 L142,26 L129.5,27 Z' },
      { id: 'right-tire-front', d: 'M151.9,70.3 A18.6,18.6 0 1 1 189.1,70.3 A18.6,18.6 0 1 1 151.9,70.3 Z' },
      { id: 'right-tire-rear', d: 'M25.9,70.3 A18.4,18.4 0 1 1 62.7,70.3 A18.4,18.4 0 1 1 25.9,70.3 Z' },
    ],
  },
  {
    id: 'back',
    label: 'back',
    src: 'car-svg/back.svg',
    w: 100,
    h: 89,
    hotspots: [
      { id: 'roof', d: 'M19,1 H81 V8.5 H19 Z' },
      { id: 'rear-windshield', d: 'M17,8.5 H82.5 V22.5 H17 Z' },
      { id: 'tailgate', d: 'M11,22.5 H88.5 V54 H11 Z' },
      { id: 'rear-bumper', d: 'M5,54 H95 V69 H5 Z' },
      { id: 'left-taillight', d: 'M3.5,28 H12 V50 H3.5 Z' },
      { id: 'right-taillight', d: 'M87.5,28 H96 V50 H87.5 Z' },
      { id: 'left-tire-rear', d: 'M0,61 H15 V89 H0 Z' },
      { id: 'right-tire-rear', d: 'M85,61 H99.5 V89 H85 Z' },
    ],
  },];

const PART_LABELS: Record<string, string> = {
  roof: 'Roof',
  windshield: 'Windshield',
  'rear-windshield': 'Rear Window',
  hood: 'Hood',
  grille: 'Grille',
  tailgate: 'Tailgate',
  'left-cargo-bed': 'Left Cargo Bed',
  'right-cargo-bed': 'Right Cargo Bed',
  'front-bumper': 'Front Bumper',
  'rear-bumper': 'Rear Bumper',
  'left-front-fender': 'Left Front Fender',
  'right-front-fender': 'Right Front Fender',
  'left-front-door': 'Left Front Door',
  'left-rear-door': 'Left Rear Door',
  'right-front-door': 'Right Front Door',
  'right-rear-door': 'Right Rear Door',
  'left-mirror': 'Left Mirror',
  'right-mirror': 'Right Mirror',
  'left-headlight': 'Left Headlight',
  'right-headlight': 'Right Headlight',
  'left-taillight': 'Left Taillight',
  'right-taillight': 'Right Taillight',
  'left-tire-front': 'Left Front Tire',
  'left-tire-rear': 'Left Rear Tire',
  'right-tire-front': 'Right Front Tire',
  'right-tire-rear': 'Right Rear Tire',
};

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

@Component({
  selector: 'app-car-selection',
  standalone: true,
  imports: [NzCardModule, NzTagModule],
  template: `
  <div class="mx-auto w-full max-w-5xl p-4">
    <nz-card nzTitle="Select Vehicle Parts" [nzExtra]="selectedCountTemplate">
      <ng-template #selectedCountTemplate>
        @if (selectedParts.length) {
          <nz-tag nzColor="blue">
            {{ selectedParts.length }} part{{ selectedParts.length > 1 ? 's' : '' }} selected
          </nz-tag>
        }
      </ng-template>

      <div class="grid grid-cols-1 overflow-hidden rounded-xl border border-gray-200 md:grid-cols-[1.3fr_1fr]">

        <!-- LEFT: view switcher + interactive vehicle diagram -->
        <div class="p-5">
          <div
            class="flex w-fit cursor-pointer select-none items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500"
            (click)="viewsExpanded = !viewsExpanded"
          >
            Views
            <span
              class="inline-block text-[10px] transition-transform duration-300"
              [class.rotate-90]="viewsExpanded"
            >&#9656;</span>
          </div>

          @if (viewsExpanded) {
            <div class="mt-3 flex flex-wrap items-center gap-5 text-sm text-gray-700">
              @for (view of views; track view.id) {
                <button
                  type="button"
                  class="flex items-center gap-2 focus:outline-none"
                  (click)="setView(view.id)"
                  [attr.aria-pressed]="currentView === view.id"
                >
                  <span
                    class="inline-block h-4 w-4 rounded-full border-2 transition-all duration-300 ease-out"
                    [class.border-green-500]="currentView === view.id"
                    [class.bg-green-500]="currentView === view.id"
                    [class.scale-110]="currentView === view.id"
                    [class.border-gray-300]="currentView !== view.id"
                  ></span>
                  {{ view.label }}
                </button>
              }
            </div>
          }

          <!-- 3D stage. Fixed height + overflow-hidden so faces can swing through
               each other without the card resizing between views. -->
          <div
            #stage
            class="stage relative mx-auto mt-6 h-[240px] w-full overflow-hidden rounded-lg bg-white sm:h-[280px] md:h-[300px]"
            [class.is-dragging]="dragging"
            [style.perspective.px]="perspective"
            (pointerdown)="onPointerDown($event)"
            (pointermove)="onPointerMove($event, stage)"
            (pointerup)="onPointerUp($event, stage)"
            (pointercancel)="onPointerUp($event, stage)"
          >
            <div
              class="turntable"
              [class.is-dragging]="dragging"
              [style.transform]="turntableTransform"
              [@viewTransition]="viewIndex"
              [@.disabled]="reduceMotion"
            >
              <!-- Only the active view is in the DOM, so Angular's :enter/:leave
                   queries drive the flip when it changes. -->
              @for (view of views; track view.id) {
                @if (view.id === currentView) {
                  <div class="view-pane">
                    <svg
                      class="block h-full w-full select-none"
                      [attr.viewBox]="'0 0 ' + view.w + ' ' + view.h"
                      role="img"
                      [attr.aria-label]="'Vehicle ' + view.label + ' view'"
                    >
                      <!-- The artwork, used exactly as authored. Hotspots are traced
                           in this same coordinate space, so the two always align. -->
                      <image
                        class="pointer-events-none"
                        [attr.href]="view.src"
                        x="0"
                        y="0"
                        [attr.width]="view.w"
                        [attr.height]="view.h"
                      />

                      @for (spot of view.hotspots; track spot.id) {
                        <path
                          [class]="partClass(spot.id)"
                          [attr.d]="spot.d"
                          (click)="onPartClick(spot.id)"
                          tabindex="0"
                          role="button"
                          [attr.aria-pressed]="isSelected(spot.id)"
                          (keydown.enter)="togglePart(spot.id)"
                          (keydown.space)="togglePart(spot.id)"
                        >
                          <title>{{ partLabel(spot.id) }}</title>
                        </path>
                      }
                    </svg>
                  </div>
                }
              }
            </div>
          </div>

          <p class="mt-3 text-center text-xs text-gray-400">
            Drag to spin the vehicle &middot; click a panel to select it
          </p>
        </div>

        <!-- RIGHT: selected parts checklist -->
        <div class="border-t border-gray-200 bg-gray-50/60 p-5 md:border-l md:border-t-0">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Selected Parts</h3>

            @if (selectedParts.length) {
              <button
                type="button"
                class="text-xs font-medium text-blue-600 hover:underline"
                (click)="clearAll()"
              >
                Clear all
              </button>
            }
          </div>

          <div class="divide-y divide-gray-100">
            @for (id of selectedParts; track id) {
              <label class="flex cursor-pointer items-center gap-3 py-2.5" @rowSlide>
                <input
                  type="checkbox"
                  checked
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  (change)="togglePart(id)"
                />
                <span class="text-gray-800">{{ partLabel(id) }}</span>
              </label>
            }
          </div>
        </div>
      </div>
    </nz-card>
  </div>
  `,
  styles: [
    `
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
        padding: 0.5rem;
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
        fill: rgba(59, 130, 246, 0.22);
        stroke: #3b82f6;
      }
      .hotspot:focus-visible {
        stroke: #3b82f6;
        stroke-dasharray: 3 2;
      }
      /* Kept translucent so the panel underneath still reads through the tint. */
      .hotspot.is-selected {
        fill: rgba(59, 130, 246, 0.3);
        stroke: #2563eb;
        stroke-width: 1.4;
      }
    `,
  ],
  animations: [
    /**
     * Bound to `viewIndex` (a number), so Angular's :increment / :decrement
     * aliases tell us which way the user moved through the view list and the
     * vehicle swings in from the matching side.
     */
    trigger('viewTransition', [
      transition(':increment', flipTransition(1)),
      transition(':decrement', flipTransition(-1)),
    ]),

    /** Newly checked parts ease into the list rather than popping in. */
    trigger('rowSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-12px)' }),
        animate(`260ms ${EASE_OUT}`, style({ opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'translateX(12px)' })),
      ]),
    ]),
  ],
})
export class CarSelectionComponent {
  readonly views = VIEWS;

  currentView: ViewId = 'left';
  viewsExpanded = true;

  /** Honour the OS "reduce motion" setting by switching the flip animations off. */
  readonly reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    this.dragging = false;
    if (stage.hasPointerCapture(ev.pointerId)) {
      stage.releasePointerCapture(ev.pointerId);
    }

    const releasedAt = this.dragYaw;
    // Let the eased transition carry the turntable back to rest.
    this.dragYaw = 0;
    this.dragPitch = 0;

    // A decisive spin hands over to the next/previous view's flip animation.
    if (releasedAt <= -SWITCH_AT) {
      this.step(1);
    } else if (releasedAt >= SWITCH_AT) {
      this.step(-1);
    }
  }

  /** Moves `delta` places through the view list, clamped at both ends. */
  private step(delta: number): void {
    const next = this.viewIndex + delta;
    if (next < 0 || next >= this.views.length) {
      return;
    }
    this.currentView = this.views[next].id;
  }

  // ---------------------------------------------------------------- parts

  /** Canonical ids of every part the user has selected, in selection order. */
  selectedParts: string[] = [];

  /** Numeric position of the active view — drives the directional flip. */
  get viewIndex(): number {
    return this.views.findIndex((v) => v.id === this.currentView);
  }

  setView(view: ViewId): void {
    this.currentView = view;
  }

  /**
   * Click handler for the vehicle hotspots only. The click that fires at the end of
   * a drag must not also toggle whatever happened to be under the cursor; `didDrag`
   * stays set until the next pointerdown on the stage, which is why the checklist
   * checkboxes call `togglePart` directly instead of going through here.
   */
  onPartClick(id: string): void {
    if (this.didDrag) {
      return;
    }
    this.togglePart(id);
  }

  togglePart(id: string): void {
    const index = this.selectedParts.indexOf(id);
    if (index > -1) {
      this.selectedParts.splice(index, 1);
    } else {
      this.selectedParts.push(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedParts.includes(id);
  }

  partLabel(id: string): string {
    return PART_LABELS[id] ?? id;
  }

  partClass(id: string): string {
    return this.isSelected(id) ? 'hotspot is-selected' : 'hotspot';
  }

  clearAll(): void {
    this.selectedParts = [];
  }
}
