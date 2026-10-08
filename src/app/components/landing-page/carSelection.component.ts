import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { VehicleDiagramComponent, PartToggle } from '../vehicle-diagram/vehicle-diagram.component';
import { VehicleSpec, partLabelFor } from '../vehicle-diagram/vehicle-diagram.model';
import { VEHICLES, vehicleById } from '../vehicle-diagram/vehicles';

/** Easing for the chips easing into the row. */
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Damage assessment screen: pick a body type, walk around the vehicle, mark the
 * damaged parts.
 *
 * The drawing and the picking live in `<app-vehicle-diagram>`; this component is
 * the screen around it — the heading, the body-type picker, and the list of what
 * has been marked. Adding a vehicle is a data change in
 * `vehicle-diagram/vehicles/`, never a change here.
 */
@Component({
  selector: 'app-car-selection',
  standalone: true,
  imports: [VehicleDiagramComponent],
  template: `
  <div class="flex min-h-screen w-full items-center justify-center px-6 py-8">
   <div class="w-full max-w-3xl">
    <h2 class="text-base font-bold text-gray-900">{{ heading }}</h2>
    <p class="mt-1 text-xs text-gray-500">{{ summary }}</p>

    <app-vehicle-diagram
      class="mt-3"
      [vehicle]="vehicle"
      [marked]="markedParts"
      (partToggled)="onPartToggled($event)"
    >
      <select
        diagramAction
        class="body-type"
        aria-label="Vehicle body type"
        [value]="vehicle.id"
        (change)="onVehicleChange($event)"
      >
        @for (option of vehicles; track option.id) {
          <option [value]="option.id">{{ option.name }}</option>
        }
      </select>
    </app-vehicle-diagram>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <span class="text-sm text-gray-700">Marked Parts:</span>

      @for (id of markedParts; track id) {
        <button type="button" class="chip" @chipPop (click)="unmark(id)" [attr.aria-label]="'Unmark ' + partLabel(id)">
          {{ partLabel(id) }}
        </button>
      } @empty {
        <span class="text-sm text-gray-400">none yet &mdash; click a panel to mark it</span>
      }
    </div>
   </div>
  </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .body-type {
        padding: 0.25rem 0.5rem;
        border: 1px solid #d4d4d8;
        border-radius: 0.375rem;
        background: #fff;
        color: #3f3f46;
        font-size: 0.8125rem;
        line-height: 1.25rem;
        cursor: pointer;
      }
      .body-type:focus-visible {
        outline: 2px solid #86277a;
        outline-offset: 1px;
      }

      .chip {
        padding: 0.25rem 0.7rem;
        border-radius: 9999px;
        background: #e8232a;
        color: #fff;
        font-size: 0.8125rem;
        line-height: 1.25rem;
        cursor: pointer;
        transition: background 160ms ease;
      }
      .chip:hover {
        background: #c01c22;
      }
    `,
  ],
  animations: [
    /** Newly marked parts ease into the chip row rather than popping in. */
    trigger('chipPop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.85)' }),
        animate(`200ms ${EASE_OUT}`, style({ opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [animate('140ms ease-in', style({ opacity: 0, transform: 'scale(0.85)' }))]),
    ]),
  ],
})
export class CarSelectionComponent {
  /** Heading and provenance line; supplied by whoever hosts the component. */
  @Input() heading = 'Damage Assessment';
  @Input() markedBy?: string;
  @Input() markedOn?: string;

  /** Every vehicle the picker offers, in registry order. */
  readonly vehicles: VehicleSpec[] = VEHICLES;

  /** The vehicle on screen. Accepts an id so hosts need not import the specs. */
  @Input()
  set vehicleId(id: string) {
    this.vehicle = vehicleById(id);
  }
  vehicle: VehicleSpec = VEHICLES[0];

  /** Canonical ids of every part marked, in the order they were marked. */
  @Input() markedParts: string[] = [];
  @Output() markedPartsChange = new EventEmitter<string[]>();

  /**
   * Which side each part was marked from. Several parts show up on more than one
   * side, so the side it was picked from is the only honest answer to "across how
   * many sides" — counting every side a part is visible on would overstate it.
   */
  private markedFrom = new Map<string, string>();

  /** Provenance line under the heading; the tally is always shown, the rest if supplied. */
  get summary(): string {
    const bits: string[] = [];
    if (this.markedBy) {
      bits.push(`Marked at the Damage & Impact step by ${this.markedBy}`);
    }
    if (this.markedOn) {
      bits.push(this.markedOn);
    }

    const parts = this.markedParts.length;
    const sides = new Set(this.markedFrom.values()).size;
    bits.push(`${parts} part${parts === 1 ? '' : 's'} across ${sides} side${sides === 1 ? '' : 's'}`);
    return bits.join(' · ');
  }

  onVehicleChange(event: Event): void {
    this.vehicle = vehicleById((event.target as HTMLSelectElement).value);
    // Marks are traced against the vehicle they were made on, so they do not
    // survive a switch to a different one.
    this.clearAll();
  }

  onPartToggled({ partId, viewId }: PartToggle): void {
    const index = this.markedParts.indexOf(partId);
    if (index > -1) {
      this.markedParts.splice(index, 1);
      this.markedFrom.delete(partId);
    } else {
      this.markedParts.push(partId);
      this.markedFrom.set(partId, viewId);
    }
    this.markedPartsChange.emit([...this.markedParts]);
  }

  unmark(id: string): void {
    this.onPartToggled({ partId: id, viewId: this.markedFrom.get(id) ?? '' });
  }

  partLabel(id: string): string {
    return partLabelFor(this.vehicle, id);
  }

  clearAll(): void {
    this.markedParts = [];
    this.markedFrom.clear();
    this.markedPartsChange.emit([]);
  }
}
