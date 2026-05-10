import { COMPONENT_RULES, IMPLEMENTATION_PATHS, REVIEW_CHECKS, RULESET_VERSION } from '../data/rulebook';
import { signaturesForComponents } from '../data/sourceSignatures';

const STOP_WORDS = new Set(['copy', 'frame', 'group', 'container', 'desktop', 'mobile', 'section', 'component']);

function normalizeTokenText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(desktop|mobile|tablet|web|phone|portrait|landscape|copy|instance|component|frame|group|section|page|screen|prototype|wireframe)\b/g, ' ')
    .replace(/\b(l[0-9]+|v[0-9]+|variant|state|hover|pressed|default)\b/g, ' ')
    .replace(/\d+/g, '#')
    .replace(/[^a-z0-9#]+/g, ' ')
    .trim();
}

function inferDevice(frame) {
  const text = [frame.name, frame.pageName, frame.parentName].join(' ').toLowerCase();
  const width = Number(frame.width || 0);
  if (/\b(mobile|phone|iphone|android)\b/.test(text) || width <= 520) return 'Mobile';
  if (/\b(tablet|ipad)\b/.test(text) || (width > 520 && width <= 1024)) return 'Tablet';
  if (/\b(desktop|web|laptop)\b/.test(text) || width > 1024) return 'Desktop';
  return 'Unknown';
}

function primaryNodeGroup(frame) {
  if (frame.raw?.grouped) return 'Repeated collection';
  if (frame.type === 'INSTANCE') return 'Figma instance';
  if (frame.type === 'COMPONENT' || frame.type === 'COMPONENT_SET') return 'Figma component';
  if (frame.type === 'SECTION') return 'Section';
  return 'Frame/group';
}

function wordsOf(frame) {
  const text = [
    frame.name,
    frame.pageName,
    ...(frame.textSamples || []).map((sample) => sample.text || sample.name),
    ...(frame.childSummary || []).map((item) => item.type || item.name),
  ].join(' ');
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((word) => word && !STOP_WORDS.has(word));
}

function includesPhrase(haystack, phrase) {
  return haystack.includes(phrase.toLowerCase());
}

function pageStats(frames) {
  const byPage = new Map();
  frames.forEach((frame) => {
    const page = frame.pageName || 'Page';
    if (!byPage.has(page)) byPage.set(page, []);
    byPage.get(page).push(frame);
  });
  return Object.fromEntries(
    [...byPage.entries()].map(([page, pageFrames]) => [
      page,
      {
        maxWidth: Math.max(...pageFrames.map((frame) => frame.width || 0), 1),
        maxHeight: Math.max(...pageFrames.map((frame) => frame.height || 0), 1),
      },
    ])
  );
}

function structuralSignals(frame, stats) {
  const page = stats[frame.pageName] || { maxWidth: 1440, maxHeight: 1080 };
  const widthRatio = (frame.width || 0) / page.maxWidth;
  const height = frame.height || 0;
  return {
    fullWidth: widthRatio >= 0.8,
    thinBand: widthRatio >= 0.8 && height <= 180,
    pageLike: widthRatio >= 0.8 && height >= 600,
    compact: widthRatio < 0.45,
    repeatedChildren: (frame.childSummary || []).some((item) => Number(item.count) >= 3),
    hasManyTexts: (frame.textSamples || []).length >= 3,
    hasImageLike: JSON.stringify(frame.raw || {}).toLowerCase().includes('image') || JSON.stringify(frame.childSummary || {}).toLowerCase().includes('image'),
    hasInputs: JSON.stringify(frame.raw || {}).toLowerCase().includes('input') || wordsOf(frame).some((word) => ['input', 'field', 'form'].includes(word)),
  };
}

function scoreRule(frame, rule, stats) {
  const haystack = [
    frame.name,
    frame.pageName,
    ...(frame.textSamples || []).map((sample) => sample.text || ''),
  ].join(' ').toLowerCase();
  const tokens = wordsOf(frame);
  const structural = structuralSignals(frame, stats);
  const evidence = [];
  let score = 0;

  rule.keywords.forEach((keyword) => {
    if (includesPhrase(haystack, keyword)) {
      score += rule.weight;
      evidence.push(`Name/text contains "${keyword}"`);
    }
  });

  rule.figmaSignals.forEach((signal) => {
    if (tokens.includes(signal) || includesPhrase(haystack, signal)) {
      score += Math.round(rule.weight * 0.55);
      evidence.push(`Figma signal: ${signal}`);
    }
  });

  if (rule.id === 'navigation' && structural.thinBand && frame.y <= 260) {
    score += 18;
    evidence.push('Full-width top band');
  }
  if (rule.id === 'footer' && structural.thinBand && frame.y > 500) {
    score += 16;
    evidence.push('Full-width bottom band');
  }
  if (rule.id === 'catalog' && structural.repeatedChildren) {
    score += 16;
    evidence.push('Repeated children compatible with a collection');
  }
  if (rule.id === 'catalog' && frame.raw?.grouped) {
    score += 24;
    evidence.push(`${frame.raw.memberCount || frame.groupMembers?.length || 'Multiple'} similar instances consolidated into one collection candidate`);
  }
  if (rule.id === 'card' && structural.compact && structural.hasImageLike) {
    score += 10;
    evidence.push('Compact block with image-like content');
  }
  if (rule.id === 'form' && structural.hasInputs) {
    score += 18;
    evidence.push('Fields or inputs detected');
  }
  if (rule.id === 'hero-banner' && structural.fullWidth && frame.height >= 280) {
    score += 12;
    evidence.push('Wide block with hero-like height');
  }

  const extensionHits = rule.extensionTriggers.filter((trigger) => includesPhrase(haystack, trigger));
  extensionHits.forEach((trigger) => {
    score += 5;
    evidence.push(`Possible extension: ${trigger}`);
  });

  const rawText = JSON.stringify(frame.raw || {}).toLowerCase();
  const sourceTag = String(frame.raw?.tagName || frame.type || '').toUpperCase();

  if (['HEADER', 'NAV'].includes(sourceTag) && rule.id === 'navigation') {
    score += 55;
    evidence.push(`${sourceTag} semantic web tag`);
  }
  if (sourceTag === 'FOOTER' && rule.id === 'footer') {
    score += 55;
    evidence.push('FOOTER semantic web tag');
  }
  if (['HEADER', 'NAV'].includes(sourceTag) && rule.id !== 'navigation') {
    score = Math.min(score, 35);
  }
  if (sourceTag === 'FOOTER' && rule.id !== 'footer') {
    score = Math.min(score, 35);
  }

  const sourceComponentScores = signaturesForComponents(rule.blueprint)
    .map(([component, signature]) => {
      const cssHits = signature.cssClasses.filter((className) => rawText.includes(className.toLowerCase()) || includesPhrase(haystack, className));
      const propHits = signature.propNames.filter((propName) => rawText.includes(`"${propName.toLowerCase()}"`) || tokens.includes(propName.toLowerCase()) || includesPhrase(haystack, propName));
      const hintHits = signature.renderHints.filter((hint) => hint.toLowerCase().split(/[^a-z0-9]+/).some((word) => word.length > 4 && tokens.includes(word)));
      const sourceScore = Math.min(cssHits.length * 10 + propHits.length * 4 + hintHits.length * 2, 30);
      return {
        component,
        sourceScore,
        cssHits,
        propHits,
      };
    })
    .sort((a, b) => b.sourceScore - a.sourceScore);

  if (sourceComponentScores[0]?.sourceScore > 0) {
    const bestSource = sourceComponentScores[0];
    score += bestSource.sourceScore;
    evidence.push(
      `Source match ${bestSource.component}: ${
        [...bestSource.cssHits.slice(0, 3), ...bestSource.propHits.slice(0, 3)].join(', ') || 'render contract signals'
      }`
    );
  }

  return {
    rule,
    score: Math.min(score, 100),
    evidence,
    extensionHits,
    structural,
    sourceComponentScores,
  };
}

function detectionExplanation(frame, best, stats, source = 'unknown') {
  const structural = best?.structural || structuralSignals(frame, stats);
  const reasons = [];
  const isWeb = source === 'web-page' || frame.raw?.sourceKind === 'web';
  if (frame.raw?.grouped) {
    reasons.push(`${frame.raw.memberCount || frame.groupMembers?.length || 'Multiple'} repeated sibling nodes were consolidated into one collection candidate.`);
  }
  if (isWeb) {
    const tag = String(frame.raw?.tagName || frame.type || 'element').toLowerCase();
    reasons.push(`The ${tag} element was extracted from the page DOM as a semantic/content block.`);
    if (frame.raw?.id) reasons.push(`DOM id "${frame.raw.id}" was preserved as source context.`);
    if (frame.raw?.className) reasons.push(`CSS classes were used as supporting evidence: ${String(frame.raw.className).slice(0, 120)}.`);
    if (frame.parentName) reasons.push(`The element is inside "${frame.parentName}", so DOM parent context is preserved for review.`);
  } else if (frame.parentName) {
    reasons.push(`The node is inside "${frame.parentName}", so parent context is preserved for review.`);
  } else {
    reasons.push('The node is top-level within its Figma page after page/screen frames were removed.');
  }
  if (structural.fullWidth) reasons.push('It spans most of the page width.');
  if (structural.compact) reasons.push('It is compact relative to the page and can behave like a reusable block.');
  if (structural.hasImageLike) reasons.push('Image/media-like content was detected.');
  if (structural.repeatedChildren) reasons.push('Repeated child structure was detected.');
  if (best?.evidence?.length) reasons.push(`Best rule evidence: ${best.evidence.slice(0, 2).join('; ')}.`);

  return {
    role: frame.raw?.grouped ? 'Repeated collection candidate' : 'Component candidate',
    sourceNodeType: isWeb ? frame.raw?.tagName || frame.type : frame.type,
    pageName: frame.pageName,
    parentName: frame.parentName || null,
    childCandidateCount: frame.childCandidateCount || 0,
    structural,
    reasons,
  };
}

function orderedBlueprint(rule, sourceComponentScores) {
  const scores = new Map((sourceComponentScores || []).map((entry) => [entry.component, entry.sourceScore]));
  return [...(rule?.blueprint || [])].sort((a, b) => (scores.get(b) || 0) - (scores.get(a) || 0));
}

function familyKeyFor(item) {
  const primaryBlueprint = item.blueprint?.[0] || 'UNMAPPED';
  const semanticName = normalizeTokenText(item.name || item.decision);
  const parentHint = normalizeTokenText(item.hierarchy?.parentName || '');
  const compactName = semanticName || parentHint || normalizeTokenText(item.decision);
  return [item.decision || 'Unclassified', primaryBlueprint, compactName].join('::');
}

function annotateFamilies(items) {
  const groups = new Map();
  items.forEach((item) => {
    const key = familyKeyFor(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  const families = [...groups.entries()].map(([key, members]) => {
    const representative = [...members].sort((a, b) => b.confidence - a.confidence || (a.bounds?.y || 0) - (b.bounds?.y || 0))[0];
    const pages = [...new Set(members.map((item) => item.pageName || 'Page'))].sort();
    const devices = [...new Set(members.map((item) => item.device || 'Unknown'))].sort();
    const review = members.some((item) => item.review);
    return {
      key,
      name: representative.name,
      decision: representative.decision,
      blueprint: representative.blueprint,
      path: representative.path,
      pathLabel: representative.pathLabel,
      confidence: representative.confidence,
      effort: representative.effort,
      representativeId: representative.id,
      instanceCount: members.length,
      review,
      pages,
      devices,
      sharedAcrossPages: pages.length > 1,
      sharedAcrossDevices: devices.filter((device) => device !== 'Unknown').length > 1,
      nodeGroups: [...new Set(members.map((item) => item.nodeGroup))].sort(),
      memberIds: members.map((item) => item.id),
    };
  });

  const familyByKey = new Map(families.map((family) => [family.key, family]));
  return items.map((item) => {
    const key = familyKeyFor(item);
    const family = familyByKey.get(key);
    return {
      ...item,
      family: {
        key,
        name: family.name,
        representativeId: family.representativeId,
        instanceCount: family.instanceCount,
        pages: family.pages,
        devices: family.devices,
        sharedAcrossPages: family.sharedAcrossPages,
        sharedAcrossDevices: family.sharedAcrossDevices,
        isRepresentative: family.representativeId === item.id,
      },
    };
  });
}

function choosePath(best, frame) {
  const haystack = [frame.name, frame.pageName, JSON.stringify(frame.raw || {})].join(' ').toLowerCase();
  if (!best || best.score < 45) return 'REVIEW';
  if (best.extensionHits.length > 0) return 'BLUEPRINT_EXTENSION';
  if (best.rule.path === 'OOTB_BLUEPRINT') {
    if (/color|radius|rounded|spacing|font|theme|style/.test(haystack) && best.score < 78) return 'CONFIG_STYLE';
    return 'OOTB_BLUEPRINT';
  }
  return best.rule.path;
}

function effortOf(path, score) {
  if (path === 'OOTB_BLUEPRINT' && score >= 80) return 'S';
  if (path === 'CONFIG_STYLE') return 'S-M';
  if (path === 'WCM_CONTENT') return 'M';
  if (path === 'BLUEPRINT_EXTENSION') return 'M-L';
  if (path === 'PORTAL_NATIVE') return 'M';
  if (path === 'SCRIPT_APP') return 'L';
  return 'Review';
}

export function analyzeDesign(normalized, settings = {}) {
  const threshold = Number(settings.confidenceThreshold || 65);
  const stats = pageStats(normalized.frames || []);
  const scoredItems = (normalized.frames || [])
    .map((frame) => {
      const scored = COMPONENT_RULES.map((rule) => scoreRule(frame, rule, stats)).sort((a, b) => b.score - a.score);
      const best = scored[0];
      const path = choosePath(best, frame);
      const confidence = best ? best.score : 0;
      const review = confidence < threshold || path === 'REVIEW';
      const blueprint = orderedBlueprint(best?.rule, best?.sourceComponentScores);
      return {
        id: frame.id,
        name: frame.name,
        pageName: frame.pageName,
        type: frame.type,
        device: inferDevice(frame),
        nodeGroup: primaryNodeGroup(frame),
        hierarchy: {
          parentId: frame.parentId || null,
          parentName: frame.parentName || null,
          depth: frame.depth ?? null,
          childCandidateCount: frame.childCandidateCount || 0,
        },
        collection: frame.raw?.grouped
          ? {
              grouped: true,
              count: frame.raw.memberCount || frame.groupMembers?.length || 0,
              representativeId: frame.raw.representativeId || frame.groupMembers?.[0]?.id || null,
              members: frame.groupMembers || frame.raw.members || [],
            }
          : null,
        detection: detectionExplanation(frame, best, stats, normalized.source),
        bounds: {
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height,
        },
        preview: {
          name: frame.name,
          type: frame.type,
          sourceType: frame.raw?.sourceKind || normalized.source,
          bounds: {
            x: frame.x,
            y: frame.y,
            width: frame.width,
            height: frame.height,
          },
          visual: frame.visual || {},
          textSamples: (frame.textSamples || []).slice(0, 8),
          childSummary: frame.childSummary || [],
        },
        path,
        pathLabel: IMPLEMENTATION_PATHS[path].label,
        confidence,
        effort: effortOf(path, confidence),
        blueprint,
        sourceMatches: best?.sourceComponentScores || [],
        decision: best?.rule.name || 'Unclassified',
        wcm: best?.rule.wcm || 'Pending review',
        evidence: best?.evidence || [],
        alternatives: scored.slice(1, 4).map((entry) => ({
          id: entry.rule.id,
          name: entry.rule.name,
          score: entry.score,
          blueprint: orderedBlueprint(entry.rule, entry.sourceComponentScores),
        })),
        review,
        checks: REVIEW_CHECKS,
      };
    })
    .sort((a, b) => b.confidence - a.confidence);

  const items = annotateFamilies(scoredItems);
  const familiesByKey = new Map();
  items.forEach((item) => {
    if (!familiesByKey.has(item.family.key)) {
      familiesByKey.set(item.family.key, {
        key: item.family.key,
        name: item.family.name,
        representativeId: item.family.representativeId,
        instanceCount: item.family.instanceCount,
        pages: item.family.pages,
        devices: item.family.devices,
        sharedAcrossPages: item.family.sharedAcrossPages,
        sharedAcrossDevices: item.family.sharedAcrossDevices,
        decision: item.decision,
        blueprint: item.blueprint,
        path: item.path,
        pathLabel: item.pathLabel,
        confidence: item.confidence,
        effort: item.effort,
        review: item.family.instanceCount ? items.some((candidate) => candidate.family?.key === item.family.key && candidate.review) : item.review,
        nodeGroups: [...new Set(items.filter((candidate) => candidate.family?.key === item.family.key).map((candidate) => candidate.nodeGroup))],
      });
    }
  });
  const families = [...familiesByKey.values()].sort((a, b) => b.confidence - a.confidence || b.instanceCount - a.instanceCount);

  const summary = items.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.byPath[item.path] = (acc.byPath[item.path] || 0) + 1;
      if (item.review) acc.review += 1;
      return acc;
    },
    { total: 0, review: 0, byPath: {} }
  );
  summary.detectedNodes = items.length;
  summary.uniqueComponents = families.length;
  summary.sharedComponents = families.filter((family) => family.sharedAcrossPages || family.sharedAcrossDevices || family.instanceCount > 1).length;
  summary.byDevice = items.reduce((acc, item) => {
    acc[item.device || 'Unknown'] = (acc[item.device || 'Unknown'] || 0) + 1;
    return acc;
  }, {});
  summary.byNodeGroup = items.reduce((acc, item) => {
    acc[item.nodeGroup || 'Unknown'] = (acc[item.nodeGroup || 'Unknown'] || 0) + 1;
    return acc;
  }, {});
  summary.familyReview = families.filter((family) => family.review).length;

  return {
    id: crypto.randomUUID(),
    name: normalized.name,
    source: normalized.source,
    importedAt: new Date().toISOString(),
    rulesetVersion: RULESET_VERSION,
    meta: normalized.meta,
    summary,
    families,
    items,
  };
}

export function exportAnalysis(analysis) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      phase: 'analysis-classification',
      analysis,
    },
    null,
    2
  );
}
