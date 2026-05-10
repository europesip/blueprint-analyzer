function toneFor(type = '') {
  const upper = String(type).toUpperCase();
  if (upper.includes('TEXT')) return 'bg-slate-300';
  if (upper.includes('IMAGE') || upper.includes('RECTANGLE')) return 'bg-brand/25';
  if (upper.includes('INPUT')) return 'bg-white border border-slate-300';
  if (upper.includes('LINK') || upper.includes('BUTTON')) return 'bg-signal/25';
  return 'bg-slate-200';
}

export function VisualPreview({ preview, variant = 'thumb' }) {
  const width = Number(preview?.bounds?.width || 1440);
  const height = Number(preview?.bounds?.height || 420);
  const ratio = Math.max(1.6, Math.min(3.2, width / Math.max(height, 1)));
  const bg = preview?.visual?.bg || '#f8fafc';
  const childSummary = preview?.childSummary || [];
  const textSamples = (preview?.textSamples || []).filter((sample) => sample.text).slice(0, variant === 'large' ? 5 : 3);
  const childBlocks = childSummary.flatMap((entry) =>
    Array.from({ length: Math.min(Number(entry.count || 0), variant === 'large' ? 8 : 5) }, (_, index) => ({
      type: entry.type,
      key: `${entry.type}-${index}`,
    }))
  );

  return (
    <div className={variant === 'large' ? 'rounded border border-line bg-slate-950 p-3 shadow-panel' : 'w-28 shrink-0 rounded border border-line bg-slate-950 p-1.5'}>
      <div
        className="relative overflow-hidden rounded bg-white"
        style={{
          aspectRatio: ratio,
          background: `linear-gradient(135deg, ${bg}, #ffffff 58%, #eef2f7)`,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:18px_18px]" />
        <div className="absolute inset-x-3 top-3 flex items-center gap-2">
          <div className="h-2 w-14 rounded bg-brand/60" />
          <div className="h-1.5 w-8 rounded bg-slate-300" />
          <div className="h-1.5 w-10 rounded bg-slate-300" />
        </div>
        <div className="absolute left-3 top-9 w-[44%] space-y-1.5">
          {textSamples.length ? (
            textSamples.map((sample, index) => (
              <div key={`${sample.text}-${index}`} className={`rounded ${index === 0 ? 'bg-slate-700' : 'bg-slate-400'}`} style={{ height: index === 0 ? 5 : 3, width: `${Math.max(42, 92 - index * 18)}%` }} />
            ))
          ) : (
            <>
              <div className="h-1.5 w-4/5 rounded bg-slate-700" />
              <div className="h-1 w-3/5 rounded bg-slate-300" />
            </>
          )}
        </div>
        <div className="absolute bottom-3 right-3 grid w-[42%] grid-cols-2 gap-1.5">
          {(childBlocks.length ? childBlocks : [{ type: 'IMAGE', key: 'image' }, { type: 'TEXT', key: 'text' }, { type: 'BUTTON', key: 'button' }]).map((block, index) => (
            <div key={block.key} className={`h-5 rounded ${toneFor(block.type)} ${index % 3 === 0 ? 'col-span-2' : ''}`} />
          ))}
        </div>
        <div className="absolute bottom-2 left-3 rounded bg-slate-950/75 px-1.5 py-0.5 font-mono text-[9px] text-white">
          {Math.round(width)} x {Math.round(height)}
        </div>
        {variant === 'large' && textSamples.length ? (
          <div className="absolute bottom-3 left-28 max-w-[48%] space-y-1 rounded bg-white/90 p-2 shadow-sm">
            {textSamples.slice(0, 3).map((sample, index) => (
              <div key={`${sample.text}-${index}`} className="truncate text-[11px] leading-4 text-slate-700">
                {sample.text}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
