// Prompt assembly for the asset pipeline. Pure: no I/O.
export const PREAMBLE_PATH = "prompts/preamble.txt";

export const HANDOFF_OPEN =
  "Single continuous cinematic camera move, no cuts. Continue the same slow, steady forward glide.";

export function handoffClose(next) {
  return `In the final second, settle back into a slow, steady forward glide toward ${next}.`;
}

/** Still prompt: the byte-identical preamble, then the scene subject. */
export function buildStillPrompt(preamble, subject) {
  return `${preamble.trim()}\nSubject: ${subject.trim()}`;
}

/** Leg prompt under the motion-handoff contract (scroll-world architecture A). */
export function buildLegPrompt({ move, into, next, styleTail }) {
  return `${HANDOFF_OPEN} ${move} The camera moves into ${into}. ${handoffClose(next)} ${styleTail} Smooth, graceful, slow motion, subtle parallax. No text, no captions.`;
}
