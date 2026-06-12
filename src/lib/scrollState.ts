// Shared mutable scroll state, updated by ScrollManager and read inside
// R3F useFrame loops. Avoids React re-renders on every scroll tick.
export const scrollState = {
  progress: 0, // 0..1 across the entire page
};
