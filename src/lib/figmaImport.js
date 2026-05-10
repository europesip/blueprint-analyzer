function toText(value) {
  return String(value || '').trim();
}

function boundsOf(node) {
  const box = node.absoluteBoundingBox || node.absoluteRenderBounds || {};
  return {
    x: Number(box.x ?? node.x ?? 0),
    y: Number(box.y ?? node.y ?? 0),
    width: Number(box.width ?? node.width ?? 0),
    height: Number(box.height ?? node.height ?? 0),
  };
}

function colorToHex(color, opacity = 1) {
  if (!color || typeof color !== 'object') return null;
  const r = Math.round((color.r || 0) * 255).toString(16).padStart(2, '0');
  const g = Math.round((color.g || 0) * 255).toString(16).padStart(2, '0');
  const b = Math.round((color.b || 0) * 255).toString(16).padStart(2, '0');
  if (opacity < 1) return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${opacity.toFixed(2)})`;
  return `#${r}${g}${b}`;
}

function firstSolidFill(node) {
  const fill = (node.fills || []).find((item) => item.type === 'SOLID' && item.visible !== false);
  if (!fill) return null;
  return colorToHex(fill.color, fill.opacity ?? 1);
}

function summarizeChildren(children = []) {
  const counts = children.reduce((acc, child) => {
    const key = child.type || 'UNKNOWN';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([type, count]) => ({ type, count }));
}

function collectTexts(node, limit = 8, acc = []) {
  if (!node || acc.length >= limit) return acc;
  if (node.type === 'TEXT' && node.characters) {
    acc.push({
      id: node.id,
      name: node.name,
      text: node.characters,
      fontSize: node.style?.fontSize,
      fontWeight: node.style?.fontWeight,
    });
  }
  (node.children || []).forEach((child) => collectTexts(child, limit, acc));
  return acc;
}

function isCandidateNode(node) {
  if (!node) return false;
  return ['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'SECTION', 'GROUP'].includes(node.type);
}

function looksAtomic(node) {
  const name = toText(node?.name).toLowerCase();
  return /\b(button|btn|icon|arrow|chevron|label|text|copy|image|img|logo|input|field|divider|line)\b/.test(name);
}

function looksReusableByName(frame) {
  return /\b(card|tile|item|offer|product|vehicle|case|article|news|service|carousel|slide|banner|hero|section|catalog|list|grid|form|footer|header|nav)\b/i.test(
    [frame.name, frame.parentName, frame.pageName].join(' ')
  );
}

function looksLikeScreenFrame(frame) {
  const name = toText(frame.name).toLowerCase();
  const topLevel = !frame.parentId || Number(frame.depth || 0) === 0;
  const width = Number(frame.width || 0);
  const height = Number(frame.height || 0);
  const screenName = /\b(page|screen|desktop|mobile|tablet|prototype|wireframe)\b/.test(name);
  const veryTallArtboard = width >= 900 && height >= 1400;
  const viewportLike = width >= 900 && height >= 700 && height / Math.max(width, 1) >= 0.75;
  const hasComponentChildren = Number(frame.childCandidateCount || 0) > 1;
  return topLevel && (veryTallArtboard || (screenName && viewportLike && (hasComponentChildren || height >= 1000)));
}

function walkFigma(node, pageName, frames = [], parent = null, depth = 0) {
  if (!node) return frames;
  if (isCandidateNode(node)) {
    const bounds = boundsOf(node);
    if (bounds.width > 0 || bounds.height > 0) {
      frames.push({
        id: node.id || crypto.randomUUID(),
        name: toText(node.name) || 'Sin nombre',
        pageName,
        type: node.type,
        parentId: parent?.id || null,
        parentName: parent?.name || null,
        depth,
        ...bounds,
        textSamples: collectTexts(node),
        childSummary: summarizeChildren(node.children || []),
        visual: {
          bg: firstSolidFill(node),
          radius: node.cornerRadius ?? null,
          layoutMode: node.layoutMode || null,
          opacity: node.opacity ?? 1,
        },
        raw: node,
      });
    }
  }
  const currentParent = isCandidateNode(node) ? { id: node.id, name: toText(node.name), bounds: boundsOf(node), depth } : parent;
  (node.children || []).forEach((child) => walkFigma(child, pageName, frames, currentParent, depth + 1));
  return frames;
}

function filterNestedComponents(frames) {
  const byId = new Map(frames.map((frame) => [frame.id, frame]));
  const annotated = frames
    .map((frame) => ({
      ...frame,
      childCandidateCount: frames.filter((candidate) => candidate.parentId === frame.id).length,
    }));
  const pageFrames = annotated.filter(looksLikeScreenFrame).map((frame) => ({
    id: frame.id,
    name: frame.name,
    pageName: frame.pageName,
    width: frame.width,
    height: frame.height,
    childCandidateCount: frame.childCandidateCount,
    reason: 'Top-level Figma screen/artboard used as page context, not as a Blueprint component candidate.',
  }));
  const candidates = annotated.filter((frame) => {
      const area = Number(frame.width || 0) * Number(frame.height || 0);
      if (area < 1200 || looksAtomic(frame)) return false;
      if (looksLikeScreenFrame(frame)) return false;

      const parent = byId.get(frame.parentId);
      const parentArea = parent ? Number(parent.width || 0) * Number(parent.height || 0) : 0;
      const parentLooksLikePage = parent && parent.width >= 900 && parent.height >= 700;
      const nestedInsideComponent = parent && !parentLooksLikePage && parentArea > 0 && area / parentArea < 0.65;
      const similarSiblingCount = frames.filter((candidate) => candidate.parentId === frame.parentId && signatureOf(candidate) === signatureOf(frame)).length;
      if (nestedInsideComponent && similarSiblingCount < 3) return false;
      if (Number(frame.depth || 0) > 2 && similarSiblingCount < 3 && !looksReusableByName(frame)) return false;

      const looksLikeScreenContainer = /\b(page|screen|desktop|mobile|tablet|frame|home)\b/i.test(frame.name) && frame.childCandidateCount > 1 && frame.width >= 900 && frame.height >= 700;
      if (looksLikeScreenContainer) return false;

      return true;
    });
  return { candidates, pageFrames };
}

function normalizeRepeatedName(name) {
  return toText(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(copy|instance|component|item|card|tile|row|col|column)\b/g, '')
    .replace(/\d+/g, '#')
    .replace(/[^a-z0-9#]+/g, ' ')
    .trim();
}

function bucket(value, size = 32) {
  return Math.max(size, Math.round(Number(value || 0) / size) * size);
}

function signatureOf(frame) {
  const children = (frame.childSummary || [])
    .map((child) => `${child.type}:${Math.min(Number(child.count || 0), 5)}`)
    .sort()
    .join('|');
  const texts = (frame.textSamples || [])
    .map((sample) => normalizeRepeatedName(sample.text || sample.name))
    .filter(Boolean)
    .slice(0, 2)
    .join('|');
  return `${normalizeRepeatedName(frame.name)}|${bucket(frame.width)}x${bucket(frame.height)}|${children}|${texts}`;
}

function looseSignatureOf(frame) {
  const children = (frame.childSummary || [])
    .map((child) => child.type || 'UNKNOWN')
    .sort()
    .join('|');
  return [
    frame.pageName || 'Page',
    frame.parentId || 'root',
    frame.type || 'FRAME',
    `${bucket(frame.width, 64)}x${bucket(frame.height, 64)}`,
    children,
  ].join('::');
}

function shouldConsolidate(group) {
  if (group.length < 3) return false;
  const [first] = group;
  const compact = Number(first.width || 0) <= 720 || Number(first.height || 0) <= 520;
  const collectionName = /\b(card|tile|item|offer|product|vehicle|case|article|news|service|carousel|slide)\b/i.test(
    [first.name, first.parentName, first.pageName].join(' ')
  );
  return compact || collectionName;
}

function shouldConsolidateLoose(group) {
  if (group.length < 3) return false;
  const [first] = group;
  const compact = Number(first.width || 0) <= 900 || Number(first.height || 0) <= 700;
  const sameParent = group.every((frame) => frame.parentId === first.parentId);
  return sameParent && compact;
}

function boundsAround(frames) {
  const minX = Math.min(...frames.map((frame) => Number(frame.x || 0)));
  const minY = Math.min(...frames.map((frame) => Number(frame.y || 0)));
  const maxX = Math.max(...frames.map((frame) => Number(frame.x || 0) + Number(frame.width || 0)));
  const maxY = Math.max(...frames.map((frame) => Number(frame.y || 0) + Number(frame.height || 0)));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function aggregateRepeatedComponents(frames) {
  function collectGroups(sourceFrames, keyOf, predicate) {
    const groups = new Map();
    sourceFrames.forEach((frame) => {
      const key = keyOf(frame);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(frame);
    });
    return [...groups.entries()].filter(([, group]) => predicate(group));
  }

  const strictGroups = collectGroups(
    frames,
    (frame) => [frame.pageName || 'Page', frame.parentId || 'root', signatureOf(frame)].join('::'),
    shouldConsolidate
  );
  const groupedIds = new Set();
  const consolidated = [];

  function addGroup(group, key, mode = 'strict') {
    if (group.some((frame) => groupedIds.has(frame.id))) return;
    group.forEach((frame) => groupedIds.add(frame.id));
    const representative = group[0];
    const bounds = boundsAround(group);
    const baseName = normalizeRepeatedName(representative.name) || representative.name || 'Repeated component';
    consolidated.push({
      ...representative,
      id: `group:${key}`,
      name: `${baseName.replace(/#/g, '').trim() || representative.name} (${group.length} instances)`,
      type: 'REPEATED_COMPONENT_GROUP',
      ...bounds,
      textSamples: group.flatMap((frame) => frame.textSamples || []).slice(0, 12),
      childSummary: [
        { type: 'REPEATED_INSTANCE', count: group.length },
        ...(representative.childSummary || []),
      ],
      visual: representative.visual,
      raw: {
        ...representative.raw,
        grouped: true,
        sourceType: mode === 'loose' ? 'similar-repeated-components' : 'repeated-components',
        representativeId: representative.id,
        memberCount: group.length,
        members: group.map((frame) => ({
          id: frame.id,
          name: frame.name,
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height,
        })),
      },
      groupMembers: group.map((frame) => ({
        id: frame.id,
        name: frame.name,
        pageName: frame.pageName,
        x: frame.x,
        y: frame.y,
        width: frame.width,
        height: frame.height,
      })),
    });
  }

  strictGroups.forEach(([key, group]) => addGroup(group, key, 'strict'));
  collectGroups(
    frames.filter((frame) => !groupedIds.has(frame.id)),
    looseSignatureOf,
    shouldConsolidateLoose
  ).forEach(([key, group]) => addGroup(group, key, 'loose'));

  return [...frames.filter((frame) => !groupedIds.has(frame.id)), ...consolidated];
}

function fromFigmaDocument(json) {
  const pages = json.document?.children || [];
  const frames = [];
  pages.forEach((page) => {
    (page.children || []).forEach((node) => walkFigma(node, page.name || 'Page', frames));
  });
  const { candidates, pageFrames } = filterNestedComponents(frames);
  const filteredFrames = aggregateRepeatedComponents(candidates);
  return {
    source: 'figma-rest',
    name: json.name || json.fileName || 'Figma import',
    frames: filteredFrames,
    meta: {
      pageCount: pages.length,
      sourceCandidateNodeCount: frames.length,
      candidateNodeCount: candidates.length,
      componentCandidateCount: filteredFrames.length,
      pageFrames,
      excludedPageFrameCount: pageFrames.length,
      importGuidance:
        pageFrames.length && filteredFrames.length === 0
          ? 'Only full Figma screen frames were available. Increase Figma depth to 4 and refresh to analyze internal sections/components.'
          : null,
      lastModified: json.lastModified || json.last_modified || null,
    },
  };
}

function fromDxForge(json) {
  const components = Array.isArray(json.components) ? json.components : [];
  const frames = components.map((item) => ({
    id: item.id || item.frameId || item.node_id || crypto.randomUUID(),
    name: item.name || item.element || 'Sin nombre',
    pageName: item.pageName || item.page || 'Page',
    type: item.type || 'FRAME',
    x: Number(item.x || 0),
    y: Number(item.y || 0),
    width: Number(item.width || item.w || 0),
    height: Number(item.height || item.h || 0),
    textSamples: item.textSamples || [],
    childSummary: item.children_summary || item.childSummary || [],
    visual: item.visual || {
      bg: item.bgHex || item.bg_hex || null,
      radius: item.borderRadius || item.border_radius || null,
      layoutMode: item.layoutMode || item.layout_mode || null,
      opacity: item.opacity ?? 1,
    },
    raw: item,
  }));
  return {
    source: 'dxforge-json',
    name: json.fileName || json.name || 'DXForge import',
    frames,
    meta: {
      pageCount: new Set(frames.map((frame) => frame.pageName)).size,
      lastModified: json.lastModified || null,
    },
  };
}

function fromArray(json) {
  const frames = json.map((item) => ({
    id: item.id || item.name || crypto.randomUUID(),
    name: item.name || item.element || 'Sin nombre',
    pageName: item.pageName || item.page || 'Page',
    type: item.type || 'FRAME',
    x: Number(item.x || 0),
    y: Number(item.y || 0),
    width: Number(item.width || item.w || 0),
    height: Number(item.height || item.h || 0),
    textSamples: item.textSamples || [],
    childSummary: item.childSummary || item.children_summary || [],
    visual: item.visual || {},
    raw: item,
  }));
  return {
    source: 'normalized-array',
    name: 'JSON import',
    frames,
    meta: { pageCount: new Set(frames.map((frame) => frame.pageName)).size },
  };
}

export function normalizeDesignJson(json) {
  if (!json) throw new Error('JSON vacio');
  if (json.document?.children) return fromFigmaDocument(json);
  if (Array.isArray(json.components)) return fromDxForge(json);
  if (Array.isArray(json.frames)) return fromArray(json.frames);
  if (Array.isArray(json)) return fromArray(json);
  throw new Error('Formato no reconocido: usa JSON Figma REST, DXForge o array de frames');
}
