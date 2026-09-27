// Leg order and file paths for the continuous forward take. Pure: no I/O.
// Leg 0 starts from its scene still; every later leg starts from the
// previous leg's ACTUAL last frame, so every seam is frame-identical.
export function legPlan(sceneIds, { workDir, assetsDir }) {
  return sceneIds.map((id, index) => ({
    index,
    id,
    startImage: index === 0 ? `${workDir}/still_${id}.png` : `${workDir}/last_${sceneIds[index - 1]}.png`,
    prompt: `prompts/leg_${id}.txt`,
    raw: `${workDir}/leg_${id}.mp4`,
    lastFrame: `${workDir}/last_${id}.png`,
    encoded: `${assetsDir}/vid/${id}.mp4`,
  }));
}
