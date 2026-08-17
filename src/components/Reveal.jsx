import { motion, useReducedMotion } from "motion/react";
import { fadeUp, revealViewport, staggerContainer } from "../lib/motion";

// Scroll-triggered entrance for a single element/section. Falls back to a
// plain tag with no animation if the user has prefers-reduced-motion on —
// checked once via the hook rather than relying on the CSS
// transition-duration:0.001ms rule (that neutralizes transitions, but
// Motion drives these via requestAnimationFrame/transform, not CSS
// transitions, so it needs its own check).
//
// whileHover/whileTap/whileFocus/whileDrag are pulled out separately so the
// reduced-motion fallback can drop them (a plain DOM tag would warn about
// unknown attributes) while still forwarding the rest of `rest` — event
// handlers like onDrop, or structural props like htmlFor, must reach the
// plain tag too or functionality silently breaks for reduced-motion users.
export default function Reveal({
  children, as = "div", className, variants = fadeUp, style,
  whileHover, whileTap, whileFocus, whileDrag, ...rest
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className} style={style} {...rest}>{children}</Tag>;
  }
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={variants}
      whileHover={whileHover}
      whileTap={whileTap}
      whileFocus={whileFocus}
      whileDrag={whileDrag}
      {...rest}
    >
      {children}
    </Component>
  );
}

// Wraps several children so they reveal in a staggered sequence instead of
// all at once. Children should be motion.* elements with their own
// `variants` (fadeUp etc.) and no whileInView of their own — they inherit
// the "visible" trigger from this parent.
export function StaggerGroup({
  children, as = "div", className, stagger = 0.08, style,
  whileHover, whileTap, whileFocus, whileDrag, ...rest
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className} style={style} {...rest}>{children}</Tag>;
  }
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={staggerContainer(stagger)}
      whileHover={whileHover}
      whileTap={whileTap}
      whileFocus={whileFocus}
      whileDrag={whileDrag}
      {...rest}
    >
      {children}
    </Component>
  );
}
