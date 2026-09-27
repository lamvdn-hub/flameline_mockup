// Still-generation request shapes. Pure: no I/O.
// Schemas confirmed live from https://fal.run/<slug>/openapi.json on 2026-09-27
// (see prompts/models.md). sync_mode returns the image inline as a data URI.
export const STILL_MODELS = {
  draft: { slug: "google/nano-banana-2-lite", body: (prompt) => ({ prompt, aspect_ratio: "16:9", num_images: 1, output_format: "png", sync_mode: true }) },
  final: { slug: "google/nano-banana-pro", body: (prompt) => ({ prompt, aspect_ratio: "16:9", num_images: 1, resolution: "4K", output_format: "png", sync_mode: true }) },
};

/** With a public reference URL the request goes to the model's /edit endpoint and carries image_urls. */
export function stillRequest(tier, prompt, refUrl) {
  const m = STILL_MODELS[tier === "final" ? "final" : "draft"];
  const body = m.body(prompt);
  return refUrl ? { slug: `${m.slug}/edit`, body: { ...body, image_urls: [refUrl] } } : { slug: m.slug, body };
}
