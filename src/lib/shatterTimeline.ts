import type { ShatterEnvelope } from "@/components/ShatterField";

// Sector showcase: the form shatters mid-spiral, reforms into a lipstick,
// then shatters again and reforms back into the ribbon.
export const LIPSTICK_ENVELOPE: ShatterEnvelope = { shatterStart: 0.56, reformed: 0.65, holdEnd: 0.74, shatterEnd: 0.83 };

// CTA: the form shatters once more into a final product reveal and holds.
export const SPRAY_ENVELOPE: ShatterEnvelope = { shatterStart: 0.86, reformed: 0.95, holdEnd: 1.01, shatterEnd: 1.02 };

// Magnetic-scroll rest points. Every value here is a moment where the form
// is either fully intact (ribbon) or fully reformed (product) — never
// mid-shatter, so the scroll never settles on a "broken pieces" frame.
export const SHATTER_SNAP_POINTS = [
  LIPSTICK_ENVELOPE.shatterStart,
  LIPSTICK_ENVELOPE.reformed,
  LIPSTICK_ENVELOPE.holdEnd,
  LIPSTICK_ENVELOPE.shatterEnd,
  SPRAY_ENVELOPE.shatterStart,
  SPRAY_ENVELOPE.reformed,
];
