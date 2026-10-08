import { VehicleSpec } from '../vehicle-diagram.model';
import { PICKUP_TRUCK } from './pickup-truck';

/**
 * Every vehicle the diagram can draw. The body-type picker lists these in order,
 * and the first is what a screen starts on.
 *
 * ## Adding a vehicle
 *
 * 1. Put its drawings in `public/car-svg/<vehicle>/` — one per side. They are used
 *    as-is; nothing redraws them.
 * 2. Copy `pickup-truck.ts`, give it a new `id` and `name`, and point each view's
 *    `src` at the new files with that file's own `viewBox` width/height in `w`/`h`.
 * 3. Retrace the hotspots. They are coordinates in each drawing's viewBox, so they
 *    do NOT carry over between vehicles even when the parts are the same — a
 *    sedan's door is not where a pickup's door is. Reuse the part ids though: any
 *    id in `COMMON_PART_LABELS` is already labelled. Put each `cx`/`cy` at the
 *    region's centre, moving it by hand if that lands on a neighbouring part.
 * 4. Add it to the list below.
 *
 * Order each vehicle's `views` as a walk around it (nose, one flank, tail, the
 * other flank). The carousel steps through them in order and stops at both ends,
 * so the order is what the arrows follow.
 */
export const VEHICLES: VehicleSpec[] = [PICKUP_TRUCK];

/** Looks a vehicle up by id, falling back to the first so a bad id never blanks the screen. */
export function vehicleById(id: string | undefined): VehicleSpec {
  return VEHICLES.find((v) => v.id === id) ?? VEHICLES[0];
}

export { PICKUP_TRUCK };
