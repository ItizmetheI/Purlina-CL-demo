export default function VignetteOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 25,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 45%, rgba(5,6,10,0.85) 100%)",
      }}
    />
  );
}
