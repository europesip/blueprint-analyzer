const commonMedia = {
  img: { type: 'ImageProps', required: false, description: 'Image URL, alt text, focal point, or WCM image element.' },
  buttons: { type: 'CTA[]', required: false, description: 'One or more links/buttons authored as WCM link elements or mapped actions.' },
};

export const COMPONENT_CONTRACTS = {
  DXHeroBanner: {
    purpose: 'Prominent page entry area with media, headline, body copy, and call to action.',
    props: {
      heading: { type: 'string', required: true, description: 'Main headline or title.' },
      body: { type: 'rich text', required: false, description: 'Supporting editorial copy.' },
      ...commonMedia,
      textPosition: { type: 'enum', required: false, description: 'Text alignment/placement variant.' },
      background: { type: 'ImageProps | VideoProps', required: false, description: 'Hero media rendered behind or beside the copy.' },
    },
    wcm: ['Hero content type', 'Image/video element', 'Headline', 'Body', 'CTA link group', 'Optional style/config fields'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXHeroBanner', 'WCM_Library/Blueprint Extensions hero/banner content contract'],
    usage: `<DXHeroBanner
  heading={content.heading}
  body={content.body}
  background={content.background}
  buttons={content.ctas}
  textPosition={content.variant}
/>`,
  },
  DXHeroBannerCarousel: {
    purpose: 'Carousel of hero banners or promoted slides.',
    props: {
      items: { type: 'HeroBannerProps[]', required: true, description: 'Slides with media, copy, and CTA data.' },
      autoPlay: { type: 'boolean', required: false, description: 'Whether slides rotate automatically.' },
      controls: { type: 'object', required: false, description: 'Dots/arrows configuration.' },
    },
    wcm: ['Collection or menu component', 'Slide content items', 'Ordering', 'Optional carousel behavior config'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXHeroBannerCarousel', 'WCM_Library collection/rendering configuration'],
    usage: `<DXHeroBannerCarousel items={slides} controls={carouselControls} />`,
  },
  DXOnPageBanner: {
    purpose: 'Secondary banner inside a page, often used as a section header or campaign stripe.',
    props: {
      title: { type: 'string', required: true, description: 'Banner title.' },
      body: { type: 'rich text', required: false, description: 'Supporting text.' },
      ...commonMedia,
    },
    wcm: ['Banner content item', 'Title', 'Body', 'Media', 'CTA'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXOnPageBanner'],
    usage: `<DXOnPageBanner title={content.title} body={content.body} buttons={content.ctas} />`,
  },
  DXCard: {
    purpose: 'Reusable teaser card for content, products, services, people, events, image records, or navigation. Contract refined from Storybook plus readable source signatures.',
    props: {
      title: { type: 'object', required: false, description: '{ url: string, label: string } used for linked card heading.' },
      description: { type: 'string | rich text', required: false, description: 'Short teaser copy.' },
      cover: { type: 'ImageProps', required: false, description: '{ url, altText } rendered in the dxCard__cover area.' },
      coverSticker: { type: 'string', required: false, description: 'Sticker/badge shown over the cover.' },
      label: { type: 'string', required: false, description: 'Top or bottom label depending on bottomLabel.' },
      metaLabel: { type: 'string', required: false, description: 'Small metadata label.' },
      bodyMetadata: { type: 'string', required: false, description: 'Metadata rendered inside card body.' },
      event: { type: 'object', required: false, description: '{ date, dateFormat, startTime, endTime } for event-like cards.' },
      iconData: { type: 'object', required: false, description: '{ icon, text } for icon/text cards.' },
      images: { type: 'object', required: false, description: '{ items, moreFn } for image record/more images cards.' },
      options: { type: 'array', required: false, description: 'Array of contextual options.' },
      primaryButton: { type: 'object', required: false, description: 'Primary action button consumed inside the card.' },
      secondaryButton: { type: 'object', required: false, description: 'Secondary action button consumed inside the card.' },
      bottomLabel: { type: 'boolean', required: false, description: 'Moves label to the bottom visual position.' },
    },
    wcm: ['Card/teaser content type', 'title object', 'cover image', 'description', 'metadata fields', 'event/icon/image variants', 'primary/secondary buttons as nested card actions'],
    sourceRefs: ['.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js:58309', '.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/index.d.ts:394', 'dxforge/blueprint-components.json: DXCard props/variants', 'dxforge/scripts/blueprint-html-templates.json: dxCard classes'],
    usage: `<DXCard
  title={{ url: item.url, label: item.title }}
  description={item.summary}
  cover={item.cover}
  label={item.label}
  primaryButton={item.primaryAction}
/>`,
  },
  DXCardButton: {
    purpose: 'Clickable card-button with image, header, optional body and CTA. More specific than a generic button.',
    props: {
      header: { type: 'string', required: true, description: 'Card button title/header.' },
      body: { type: 'string', required: false, description: 'Optional body copy.' },
      img: { type: 'ImageProps', required: true, description: '{ url, altText } rendered in dxCardBtn__img.' },
      link: { type: 'string', required: true, description: 'Navigation target.' },
      direction: { type: 'left | right', required: false, description: 'Controls image/text ordering.' },
      cta: { type: 'object', required: false, description: '{ label, icon?, justify? } optional CTA rendering.' },
    },
    wcm: ['Card button content type', 'Header', 'Body', 'Image', 'Link', 'Optional CTA', 'Direction/config style'],
    sourceRefs: ['.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js:58447', '.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/index.d.ts:429', 'dxforge/blueprint-components.json: DXCardButton', 'dxforge/scripts/blueprint-html-templates.json: dxCardBtn classes'],
    usage: `<DXCardButton
  header={item.header}
  body={item.body}
  img={item.image}
  link={item.url}
  direction={item.direction}
/>`,
  },
  DXCardButtonCatalog: {
    purpose: 'Grid or slider of DXCardButton entries.',
    props: {
      elements: { type: 'CardButtonProps[]', required: true, description: 'Card button entries.' },
      header: { type: 'string', required: false, description: 'Section heading.' },
      variant: { type: 'grid | slider', required: true, description: 'Layout mode.' },
      elementsPerRow: { type: 'number', required: false, description: 'Grid density.' },
      icons: { type: 'SliderIcons', required: false, description: 'Custom slider icons.' },
    },
    wcm: ['Collection of card buttons', 'Header', 'Variant config', 'Elements per row', 'Optional slider icons'],
    sourceRefs: ['.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js:63098', '.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/index.d.ts:446', 'dxforge/blueprint-components.json: DXCardButtonCatalog'],
    usage: `<DXCardButtonCatalog elements={items} header={section.title} variant="grid" />`,
  },
  DXCaseCard: {
    purpose: 'Case/task-like card with title, subtitle, tag label and options menu.',
    props: {
      title: { type: 'string', required: true, description: 'Case title.' },
      subtitle: { type: 'string', required: true, description: 'Secondary text.' },
      label: { type: 'TagProps', required: true, description: '{ label, color? } rendered as case label.' },
      options: { type: 'ButtonProps[]', required: true, description: 'Kebab/options actions.' },
    },
    wcm: ['Case item content type', 'Title', 'Subtitle', 'Tag/label', 'Options/actions'],
    sourceRefs: ['.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js:58406', '.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/index.d.ts:416', 'dxforge/blueprint-components.json: DXCaseCard'],
    usage: `<DXCaseCard title={item.title} subtitle={item.subtitle} label={item.statusLabel} options={item.actions} />`,
  },
  DXCasesCatalog: {
    purpose: 'Catalog/list of DXCaseCard items.',
    props: {
      items: { type: 'CaseCardProps[]', required: true, description: 'Case card entries.' },
    },
    wcm: ['Cases collection', 'Case card entries', 'Optional section/header config'],
    sourceRefs: ['.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js:58423', '.analysis/blueprint-source/node_modules/@blueprint/dx-micro-interaction-components/dist/index.d.ts:424', 'dxforge/blueprint-components.json: DXCasesCatalog'],
    usage: `<DXCasesCatalog items={cases} />`,
  },
  DXCardRounded: {
    purpose: 'Card variant/extension where the difference is mostly visual shape and style.',
    props: {
      title: { type: 'string', required: true, description: 'Card heading.' },
      img: commonMedia.img,
      radius: { type: 'style token', required: false, description: 'Rounded visual treatment.' },
    },
    wcm: ['Same authoring model as card', 'Style/config selector for rounded variant'],
    sourceRefs: ['WCM_Library/Blueprint Extensions/DXCardRounded', 'extended-blueprint-feature-reference-blueprint.zip extension examples'],
    usage: `<DXCardRounded title={item.title} img={item.image} link={item.link} />`,
  },
  DXNewsCard: {
    purpose: 'News/article teaser card with editorial metadata.',
    props: {
      title: { type: 'string', required: true, description: 'Article title.' },
      date: { type: 'date', required: false, description: 'Publication date.' },
      category: { type: 'string', required: false, description: 'Editorial category.' },
      img: commonMedia.img,
      link: { type: 'LinkProps', required: true, description: 'Article detail URL.' },
    },
    wcm: ['News content type', 'Title', 'Date', 'Category/taxonomy', 'Image', 'Detail link'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXNewsCard'],
    usage: `<DXNewsCard title={news.title} date={news.date} category={news.category} link={news.link} />`,
  },
  DXCarousel: {
    purpose: 'Generic carousel container for a collection of renderable items.',
    props: {
      items: { type: 'array', required: true, description: 'Items to render in sequence.' },
      renderItem: { type: 'function/component', required: false, description: 'Renderer for each item.' },
      controls: { type: 'object', required: false, description: 'Navigation and pagination behavior.' },
    },
    wcm: ['Collection', 'Ordering', 'Item renderer selection', 'Optional carousel configuration'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXCarousel'],
    usage: `<DXCarousel items={items} controls={controls} />`,
  },
  DXContentCarousel: {
    purpose: 'Carousel specialized for editorial/content teasers.',
    props: {
      items: { type: 'ContentItem[]', required: true, description: 'Content cards or teaser items.' },
      title: { type: 'string', required: false, description: 'Optional section title.' },
    },
    wcm: ['Content collection', 'Section title', 'Teaser/card mapping'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXContentCarousel'],
    usage: `<DXContentCarousel title={section.title} items={section.items} />`,
  },
  DXGenericCatalog: {
    purpose: 'Grid/list catalog with filters, categories, and pagination.',
    props: {
      items: { type: 'array', required: true, description: 'Catalog entries.' },
      filters: { type: 'FilterConfig[]', required: false, description: 'Taxonomy or facet filters.' },
      paginationProps: { type: 'object', required: false, description: 'Current page, totals, and page size.' },
    },
    wcm: ['Menu component or collection', 'Taxonomy', 'Filter config', 'Pagination config', 'Item renderer'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXGenericCatalog', 'WCM_Library collection/content mappings'],
    usage: `<DXGenericCatalog items={items} filters={filters} paginationProps={pagination} />`,
  },
  DXNewsFeed: {
    purpose: 'Editorial feed for news/articles.',
    props: {
      items: { type: 'NewsItem[]', required: true, description: 'News teaser entries.' },
      filters: { type: 'FilterConfig[]', required: false, description: 'Category/date filters.' },
    },
    wcm: ['News collection', 'Taxonomy/category', 'Publication dates', 'Detail links'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXNewsFeed'],
    usage: `<DXNewsFeed items={newsItems} filters={filters} />`,
  },
  DXAccordion: {
    purpose: 'Expandable row with label/header and body content.',
    props: {
      label: { type: 'string', required: true, description: 'Accordion header text.' },
      body: { type: 'HTML/rich text', required: true, description: 'Expandable body content.' },
      icons: { type: 'object', required: false, description: 'Open/close icon override.' },
      files: { type: 'object', required: false, description: 'Optional downloads section.' },
    },
    wcm: ['FAQ/question item', 'Question/title', 'Answer/body', 'Optional file/download element'],
    sourceRefs: ['dxforge/blueprint-components.json: DXAccordion', 'extended-blueprint-feature-reference-blueprint.zip/components/DXAccordion'],
    usage: `<DXAccordion label={item.question} body={item.answerHtml} files={item.downloads} />`,
  },
  DXAccordionCatalog: {
    purpose: 'Filtered/paginated list of accordion items.',
    props: {
      items: { type: 'array', required: true, description: 'Accordion data entries.' },
      paginationProps: { type: 'object', required: true, description: 'Pagination state.' },
      categories: { type: 'string[]', required: true, description: 'Filter categories.' },
    },
    wcm: ['FAQ collection', 'Taxonomy/categories', 'Pagination', 'Accordion item renderer'],
    sourceRefs: ['dxforge/blueprint-components.json: DXAccordionCatalog'],
    usage: `<DXAccordionCatalog items={items} categories={categories} paginationProps={pagination} />`,
  },
  DXNavigationHeader: {
    purpose: 'Portal/header navigation area, usually native theme rather than page content.',
    props: {
      items: { type: 'NavigationItem[]', required: true, description: 'Navigation tree.' },
      logo: { type: 'ImageProps', required: false, description: 'Brand logo.' },
      utilityLinks: { type: 'LinkProps[]', required: false, description: 'Top/right utility actions.' },
    },
    wcm: ['Portal navigation model', 'Theme module', 'Dynamic Content Spot', 'Optional WCM-managed promo/link areas'],
    sourceRefs: ['Portal theme/navigation', 'WCM_Library Dynamic Content Spot examples'],
    usage: `<DXNavigationHeader items={navigationTree} logo={siteLogo} utilityLinks={utilityLinks} />`,
  },
  DXGlobalFooter: {
    purpose: 'Global footer rendered through Portal/theme or managed footer content.',
    props: {
      groups: { type: 'FooterGroup[]', required: true, description: 'Columns or link groups.' },
      legalLinks: { type: 'LinkProps[]', required: false, description: 'Legal and policy links.' },
    },
    wcm: ['Dynamic Content Spot', 'Footer link groups', 'Legal links', 'Social links'],
    sourceRefs: ['Portal theme/footer', 'WCM_Library footer content examples'],
    usage: `<DXGlobalFooter groups={footerGroups} legalLinks={legalLinks} />`,
  },
  DXSearchInput: {
    purpose: 'Search entry point or search-box UI.',
    props: {
      label: { type: 'string', required: false, description: 'Accessible label.' },
      placeholder: { type: 'string', required: false, description: 'Input placeholder.' },
      actionUrl: { type: 'string', required: true, description: 'Search target URL.' },
    },
    wcm: ['Portal Search Center or search page', 'Input labels', 'Target route/action'],
    sourceRefs: ['Portal Search Center', 'extended-blueprint-feature-reference-blueprint.zip/components/DXSearchInput'],
    usage: `<DXSearchInput placeholder={labels.searchPlaceholder} actionUrl={searchUrl} />`,
  },
  DXRichText: {
    purpose: 'Editorial rich text rendered from WCM body content.',
    props: {
      html: { type: 'HTML/rich text', required: true, description: 'Sanitized body markup.' },
    },
    wcm: ['Rich text element', 'Optional heading', 'Optional CTA/link'],
    sourceRefs: ['WCM rich text renderer', 'extended-blueprint-feature-reference-blueprint.zip/components/DXRichText'],
    usage: `<DXRichText html={content.bodyHtml} />`,
  },
  DXTextBreak: {
    purpose: 'Text-led content break or editorial section.',
    props: {
      title: { type: 'string', required: false, description: 'Section heading.' },
      body: { type: 'rich text', required: true, description: 'Editorial body content.' },
      buttons: commonMedia.buttons,
    },
    wcm: ['Title', 'Rich text body', 'CTA link group', 'Style/config variant'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip/components/DXTextBreak'],
    usage: `<DXTextBreak title={content.title} body={content.body} buttons={content.ctas} />`,
  },
  DXDataTable: {
    purpose: 'Structured tabular data display. Use carefully when data is live or transactional.',
    props: {
      columns: { type: 'ColumnDef[]', required: true, description: 'Column definitions.' },
      rows: { type: 'array', required: true, description: 'Table data.' },
    },
    wcm: ['Static table content only if editorial', 'External datasource if live/transactional'],
    sourceRefs: ['Script App/custom frontend candidate', 'Blueprint visual component reference'],
    usage: `<DXDataTable columns={columns} rows={rows} />`,
  },
  DXChart: {
    purpose: 'Chart visualization. Usually custom/script app if backed by live data.',
    props: {
      data: { type: 'array', required: true, description: 'Chart dataset.' },
      config: { type: 'object', required: true, description: 'Chart type, axes, colors, labels.' },
    },
    wcm: ['Static chart data if editorial', 'External datasource/API if dynamic'],
    sourceRefs: ['Script App/custom frontend candidate', 'Blueprint visual component reference'],
    usage: `<DXChart data={data} config={chartConfig} />`,
  },
};

export function getComponentContract(componentName) {
  return COMPONENT_CONTRACTS[componentName] || {
    purpose: 'No detailed local contract is registered yet for this component.',
    props: {},
    wcm: ['Review the Blueprint ZIP and WCM_Library material before implementation.'],
    sourceRefs: ['extended-blueprint-feature-reference-blueprint.zip', 'WCM_Library'],
    usage: `<${componentName} {...mappedContent} />`,
  };
}
