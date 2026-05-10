export function compactNormalized(normalized) {
  return {
    source: normalized.source,
    name: normalized.name,
    meta: normalized.meta || {},
    frames: (normalized.frames || []).map((frame) => ({
      id: frame.id,
      name: frame.name,
      pageName: frame.pageName,
      type: frame.type,
      parentId: frame.parentId,
      parentName: frame.parentName,
      depth: frame.depth,
      childCandidateCount: frame.childCandidateCount,
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: frame.height,
      textSamples: (frame.textSamples || []).slice(0, 4).map((sample) => ({
        id: sample.id,
        name: sample.name,
        text: sample.text,
        fontSize: sample.fontSize,
        fontWeight: sample.fontWeight,
      })),
      childSummary: (frame.childSummary || []).slice(0, 8),
      groupMembers: (frame.groupMembers || []).slice(0, 20),
      visual: frame.visual || {},
      raw: {
        name: frame.raw?.name,
        type: frame.raw?.type,
        className: frame.raw?.className,
        id: frame.raw?.id,
        text: frame.raw?.text,
        grouped: frame.raw?.grouped,
        representativeId: frame.raw?.representativeId,
        memberCount: frame.raw?.memberCount,
      },
    })),
  };
}

export function buildSourceContext({ type, input = '', cache = null, normalized, meta = {} }) {
  return {
    type,
    input,
    ...meta,
    cacheKey: cache?.key || null,
    cacheUpdatedAt: cache?.updatedAt || null,
    normalized: compactNormalized(normalized),
  };
}
