# Image and video models used by the pipeline

Confirm every slug and schema on the provider's model page before the first paid call, then record the confirmation here.

| Role | Provider | Slug | Request | Price | Confirmed |
|---|---|---|---|---|---|
| Still draft | fal.ai | `google/nano-banana-2-lite` | `POST https://fal.run/google/nano-banana-2-lite` `{ prompt, aspect_ratio: "16:9", num_images: 1 }` | ~$0.04 / image | recipe in the generate skill (2026-08) |
| Still final | fal.ai | `fal-ai/flux-pro/v1.1-ultra` (candidate) | `POST https://fal.run/fal-ai/flux-pro/v1.1-ultra` `{ prompt, aspect_ratio: "16:9", raw: false, safety_tolerance: "2" }` | ~$0.06 / image | NOT YET: open https://fal.ai/models/fal-ai/flux-pro/v1.1-ultra/api and confirm slug, fields and price |
| Legs | Kie AI | `kling-3.0/video` | `POST https://api.kie.ai/api/v1/jobs/createTask` `{ model, input: { prompt, image_urls: [url], duration: "10", aspect_ratio: "16:9", mode: "pro" } }`; poll `GET /api/v1/jobs/recordInfo?taskId=` | ~$0.20–0.35 / s (std); pro higher, confirm | recipe in the generate skill (2026-08); confirm `mode: "pro"` price at https://docs.kie.ai/market/kling/kling-3-0 |
| Frame upload | fal.ai storage | `POST https://rest.alpha.fal.ai/storage/upload/initiate` → `{ upload_url, file_url }`, then `PUT` bytes to `upload_url` | | free | NOT YET: confirm against https://docs.fal.ai/ (client storage) before the first leg |

Auth: fal `Authorization: Key $FAL_KEY`; Kie `Authorization: Bearer $KIE_API_KEY`.
