// Shared Motion variants — one small vocabulary reused across the app so
// entrance/hover/tap animations feel consistent instead of each page
// inventing its own timing. Keep new variants here rather than inline in
// components, same reason the color/spacing tokens live in one place.

// A gentle "ease-out-expo"-ish curve — decelerates fast then settles,
// reads as premium/deliberate rather than linear or bouncy.
const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

// Wraps a group of fadeUp (or similar) children so they reveal in sequence
// rather than all at once — pass to a parent's `variants`, children just
// need `variants={fadeUp}` themselves with no individual delay math.
export function staggerContainer(stagger = 0.08, delayChildren = 0) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

// Hover/tap presets for interactive elements (spread as whileHover/whileTap).
export const hoverLift = { y: -4, transition: { duration: 0.18, ease: "easeOut" } };
export const hoverScale = { scale: 1.02, transition: { duration: 0.18, ease: "easeOut" } };
export const tapScale = { scale: 0.97 };

// Viewport config for scroll-triggered reveals — fires once, a little
// before the element is fully in view so it doesn't feel late.
export const revealViewport = { once: true, margin: "-80px" };
