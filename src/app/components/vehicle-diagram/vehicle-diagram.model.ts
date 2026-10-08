/**
 * Data model for the vehicle damage diagram.
 *
 * A vehicle is pure data: a few drawings, and a traced clickable region per part.
 * Nothing here knows about Angular, so adding a vehicle never means touching a
 * component — see `vehicles/index.ts` for the steps.
 */

/** A clickable region laid over one drawing. */
export interface Hotspot {
  /**
   * Canonical part id, shared across every view and every vehicle that has the
   * part (a `front-bumper` picked from the side is the same part as one picked
   * head-on). Ids drive the labels in `COMMON_PART_LABELS`.
   */
  id: string;
  /** SVG path, in the drawing's own viewBox units. */
  d: string;
  /**
   * Where this part's marker sits once picked — normally the region's
   * bounding-box centre, moved by hand where that reads badly (a part that wraps
   * a wheel arch, say, whose centre lands on the tyre).
   */
  cx: number;
  cy: number;
}

/** One drawing of the vehicle, with everything selectable on it. */
export interface VehicleView {
  /** Unique within the vehicle, e.g. `front`, `left`. */
  id: string;
  /** Shown as the label over the drawing, e.g. "Left Side". */
  title: string;
  /** Used for the accessible name, e.g. "left". */
  label: string;
  /** Path to the artwork, relative to the app root, e.g. `car-svg/pickup/left.svg`. */
  src: string;
  /** The artwork's own viewBox width and height — hotspots are traced in these units. */
  w: number;
  h: number;
  /**
   * Painted in order, so parts that sit on top of a larger panel — lamps,
   * mirrors, wheels — belong last, where they win the click.
   */
  hotspots: Hotspot[];
}

/** A vehicle the diagram can draw. */
export interface VehicleSpec {
  /** Stable key, e.g. `pickup-truck`. */
  id: string;
  /** Shown to the user, e.g. "Pickup Truck". */
  name: string;
  /**
   * Ordered as a walk around the vehicle, since the carousel steps through them
   * in order and stops at both ends.
   */
  views: VehicleView[];
  /** Labels for parts this vehicle has that `COMMON_PART_LABELS` does not cover. */
  partLabels?: Record<string, string>;
}

/**
 * Labels every vehicle can draw on. A new vehicle that reuses these ids gets its
 * labels for free; anything unusual goes in that vehicle's own `partLabels`.
 */
export const COMMON_PART_LABELS: Record<string, string> = {
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
  'left-front-window': 'Left Front Window',
  'left-rear-window': 'Left Rear Window',
  'right-front-window': 'Right Front Window',
  'right-rear-window': 'Right Rear Window',
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

/** Display name for a part, preferring the vehicle's own labels. */
export function partLabelFor(vehicle: VehicleSpec, partId: string): string {
  return vehicle.partLabels?.[partId] ?? COMMON_PART_LABELS[partId] ?? partId;
}
