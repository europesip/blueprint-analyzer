export const SOURCE_SIGNATURES = {
  DXCard: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxCard', 'dxCard__cover', 'dxCard__coverImage', 'dxCard__coverSticker', 'dxCard__top', 'dxCard__topLabel', 'dxCard__topMetadata', 'dxCard__container', 'dxCard__content', 'dxCard__body', 'dxCard__body__header--overflow', 'dxCard__description', 'dxCard__bodyMetadata', 'dxCard__event', 'dxCard__iconData', 'dxCard__images', 'dxCard__image', 'dxCard__buttons', 'dxCard__primaryButton', 'dxCard__secondaryButton', 'dxCard__kebab'],
    propNames: ['title', 'cover', 'checkbox', 'coverSticker', 'label', 'metaLabel', 'options', 'description', 'bodyMetadata', 'event', 'iconData', 'images', 'primaryButton', 'secondaryButton', 'bottomLabel'],
    renderHints: [
      'Card renders a cover/media area through dxCard__cover when image data is present.',
      'Main content is wrapped by dxCard__container/content/body and usually exposes a linked title plus optional description.',
      'Buttons are part of the card contract through primaryButton/secondaryButton; they should not become independent analyzed components.',
      'Metadata, event date/time, labels and icon data are native card props, not custom requirements.',
    ],
    sourceExcerpt: `function DXCard({ title, cover, description, bodyMetadata, primaryButton, secondaryButton }) {
  return (
    <div className="dxCard">
      {cover && <div className="dxCard__cover"><img className="dxCard__coverImage" /></div>}
      <div className="dxCard__container">
        <div className="dxCard__content">
          <div className="dxCard__body">title / description / metadata</div>
          <div className="dxCard__buttons">primaryButton / secondaryButton</div>
        </div>
      </div>
    </div>
  );
}`,
  },

  DXCardButton: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxCardBtn', 'dxCardBtn__container', 'dxCardBtn__container--reversed', 'dxCardBtn__text', 'dxCardBtn__text--fill', 'dxCardBtn__text--cta', 'dxCardBtn__imgContainer', 'dxCardBtn__img'],
    propNames: ['header', 'body', 'img', 'link', 'direction', 'cta', '_edit', '_search', 'index'],
    renderHints: [
      'This is a full clickable card/button pattern, not a small CTA button.',
      'It expects image, header, link and optional body/CTA data.',
      'Direction prop controls image/text ordering (left/right layouts without custom code).',
    ],
    sourceExcerpt: `function DXCardButton({ header, body, img, link, direction, cta }) {
  return (
    <a className="dxCardBtn" href={link?.url}>
      <div className={direction === 'reversed' ? 'dxCardBtn__container--reversed' : 'dxCardBtn__container'}>
        <div className="dxCardBtn__text">header / body / cta</div>
        <div className="dxCardBtn__imgContainer">image</div>
      </div>
    </a>
  );
}`,
  },

  DXCardButtonCatalog: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxCBCatalog', 'dxCBCatalog__header', 'dxCBCatalog__grid', 'dxCBCatalog__row', 'dxCBCatalog__rowItem', 'dxCBCatalog__slider', 'dxCBCatalog__sliderMain'],
    propNames: ['elements', 'header', 'variant', 'elementsPerRow', 'icons', '_edit'],
    renderHints: [
      'Use when repeated card-buttons appear as a grid or slider.',
      'Variant controls grid/slider behavior; repeated child cards are collection items.',
    ],
    sourceExcerpt: `function DXCardButtonCatalog({ elements, header, variant, elementsPerRow }) {
  return (
    <section className="dxCBCatalog">
      {header && <header className="dxCBCatalog__header">...</header>}
      <div className={variant === 'slider' ? 'dxCBCatalog__slider' : 'dxCBCatalog__grid'}>
        {elements.map((item) => <DXCardButton {...item} />)}
      </div>
    </section>
  );
}`,
  },

  DXCaseCard: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxCaseCard', 'dxCaseCard__title', 'dxCaseCard__label', 'dxCaseCard__kebab'],
    propNames: ['title', 'subtitle', 'label', 'options'],
    renderHints: [
      'Designed for case/task/list item cards with title, subtitle, tag label and options menu.',
      'If Figma shows a title/subtitle/tag/kebab pattern, prefer DXCaseCard over generic DXCard.',
    ],
    sourceExcerpt: `function DXCaseCard({ title, subtitle, label, options }) {
  return (
    <article className="dxCaseCard">
      <h3 className="dxCaseCard__title">{title}</h3>
      <p>{subtitle}</p>
      {label && <span className="dxCaseCard__label">{label}</span>}
    </article>
  );
}`,
  },

  DXCasesCatalog: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxCasesCatalog', 'dxCasesCatalog__header'],
    propNames: ['items'],
    renderHints: [
      'Use for repeated case cards; individual DXCaseCard items are collection entries.',
      'Repeated case/task cards should map to this catalog before considering a custom list.',
    ],
    sourceExcerpt: `function DXCasesCatalog({ items }) {
  return (
    <section className="dxCasesCatalog">
      {items.map((item) => <DXCaseCard {...item} />)}
    </section>
  );
}`,
  },

  DXCardRounded: {
    source: 'WCM_Library Blueprint Extensions / my-components.iife.js',
    confidence: 'source-derived',
    cssClasses: ['card', 'shadow-lg', 'rounded-top', 'card-body', 'card-title', 'card-text'],
    propNames: ['label', 'bottomLabel', 'borderRadius', 'title', 'description', 'cover', 'primaryButton', 'secondaryButton'],
    renderHints: [
      'NOT an OOTB Portal component — registered as BluePrint.DXCardRounded via WCM_Library.',
      'Bootstrap card structure with borderRadius and hover effects from the extension ZIP.',
      'A rounded visual card should be a BLUEPRINT_EXTENSION if WCM_Library is in scope.',
    ],
    sourceExcerpt: `function DXCardRounded({ title, description, cover, borderRadius, primaryButton, secondaryButton }) {
  return (
    <div className="card shadow-lg" style={{ borderRadius }}>
      {cover && <img className="rounded-top" src={cover.src} />}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
}`,
  },

  DXHeroBanner: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxHeroBanner', 'dxHeroBanner__background', 'dxHeroBanner__content', 'dxHeroBanner__title', 'dxHeroBanner__subtitle', 'dxHeroBanner__body', 'dxHeroBanner__buttons', 'dxHeroBanner__foreground'],
    propNames: ['index', 'header', 'subheader', 'body', 'textAlign', 'textColor', 'background', 'foreground', 'primaryButton', 'secondaryButton', 'link', 'searchSuggestion', 'animatedText'],
    renderHints: [
      'The hero entry point: background (image/video/opacity), headline, body, and CTA buttons.',
      'animatedText prop handles typewriter-effect headlines without custom code.',
      'Background has isVideo, url, opacity, heightDesktop, heightMobile — no image extension needed for video heroes.',
    ],
    sourceExcerpt: `function DXHeroBanner({ header, subheader, body, background, primaryButton, secondaryButton }) {
  return (
    <section className="dxHeroBanner">
      <div className="dxHeroBanner__background" style={{ backgroundImage: background?.url }} />
      <div className="dxHeroBanner__content">
        <h1 className="dxHeroBanner__title">{header}</h1>
        <p className="dxHeroBanner__subtitle">{subheader}</p>
        <p className="dxHeroBanner__body">{body}</p>
        <div className="dxHeroBanner__buttons">...</div>
      </div>
    </section>
  );
}`,
  },

  DXHeroBannerOverlay: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxHeroBannerOverlay', 'dxHeroBannerOverlay__background', 'dxHeroBannerOverlay__media', 'dxHeroBannerOverlay__content', 'dxHeroBannerOverlay__title'],
    propNames: ['index', 'header', 'subheader', 'body', 'background', 'media', 'overlayImage', 'foreground', 'buttons', 'link'],
    renderHints: [
      'Splits layout: left content area + right media (image/video). Not a full-bleed hero.',
      'background.color can be "primary" or "secondary" (theme tokens, no hex needed).',
      'media prop is separate from background: one side is the image, the other is the editorial copy.',
    ],
    sourceExcerpt: `function DXHeroBannerOverlay({ header, background, media, buttons }) {
  return (
    <section className="dxHeroBannerOverlay">
      <div className="dxHeroBannerOverlay__background" data-color={background?.color} />
      <div className="dxHeroBannerOverlay__content">{header}</div>
      <div className="dxHeroBannerOverlay__media"><img src={media?.url} /></div>
    </section>
  );
}`,
  },

  DXNewsCard: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxNewsCard', 'dxNewsCard__image', 'dxNewsCard__content', 'dxNewsCard__date', 'dxNewsCard__type', 'dxNewsCard__title'],
    propNames: ['link', 'date', 'image', 'dateFormat', 'contentType', 'contentPosition', 'layout'],
    renderHints: [
      'Designed for article/news teasers with date, image, contentType badge, and linked title.',
      'layout prop controls "top" (image above) or "left" (image beside) orientation.',
      'contentPosition can be "connected" or "split" — use before proposing a custom news card layout.',
    ],
    sourceExcerpt: `function DXNewsCard({ link, date, image, contentType, layout }) {
  return (
    <article className="dxNewsCard">
      {image && <div className="dxNewsCard__image"><img src={image.url} /></div>}
      <div className="dxNewsCard__content">
        <time className="dxNewsCard__date">{date}</time>
        <span className="dxNewsCard__type">{contentType}</span>
        <a className="dxNewsCard__title" href={link.url}>{link.label}</a>
      </div>
    </article>
  );
}`,
  },

  DXGallery: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxGallery', 'dxGallery__main', 'dxGallery__thumbs', 'dxGallery__thumb', 'dxGallery__info', 'dxGallery__title'],
    propNames: ['images', 'title', 'date', 'innerInfo', 'hideInfo', 'icons'],
    renderHints: [
      'Lightbox-style gallery: main image + thumbnail strip.',
      'images array contains { url, description } objects — no custom gallery component needed for standard photo sets.',
      'innerInfo and hideInfo control caption overlay behavior.',
    ],
    sourceExcerpt: `function DXGallery({ images, title, date }) {
  return (
    <div className="dxGallery">
      <div className="dxGallery__main"><img src={images[0]?.url} /></div>
      <div className="dxGallery__thumbs">
        {images.map(img => <div className="dxGallery__thumb"><img src={img.url} /></div>)}
      </div>
      <div className="dxGallery__info"><h2>{title}</h2></div>
    </div>
  );
}`,
  },

  DXVideo: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxVideo', 'dxVideo__player', 'dxVideo__playlist', 'dxVideo__item'],
    propNames: ['playlist', 'apiKey', 'service', 'layout', 'link'],
    renderHints: [
      'Supports vimeo and youtube services — no custom player needed for standard video embeds.',
      'layout can be "vertical" or "horizontal".',
      'playlist is the YouTube playlist ID or Vimeo album ID.',
    ],
    sourceExcerpt: `function DXVideo({ playlist, apiKey, service, layout, link }) {
  return (
    <div className="dxVideo">
      <div className="dxVideo__player" data-service={service} data-playlist={playlist} />
    </div>
  );
}`,
  },

  DXEvent: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxEvent', 'dxEvent__date', 'dxEvent__title', 'dxEvent__location', 'dxEvent__type', 'dxEvent--featured', 'dxEvent--river'],
    propNames: ['variant', 'eventFrom', 'eventTo', 'eventType', 'eventName', 'eventLocation', 'eventButton', 'eventTime24hrFormat'],
    renderHints: [
      'variant can be "featured", "river", or "featured-compact" — different layouts without extensions.',
      'eventFrom/eventTo are date strings; eventTime24hrFormat controls time format.',
      'eventName is a LinksProps object (url + label), not just a string.',
    ],
    sourceExcerpt: `function DXEvent({ variant, eventFrom, eventTo, eventName, eventLocation }) {
  return (
    <article className={\`dxEvent dxEvent--\${variant}\`}>
      <time className="dxEvent__date">{eventFrom}</time>
      <a className="dxEvent__title" href={eventName.url}>{eventName.label}</a>
      <span className="dxEvent__location">{eventLocation}</span>
    </article>
  );
}`,
  },

  DXDirectory: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxDirectory', 'dxDirectory__filters', 'dxDirectory__grid', 'dxDirectory__card'],
    propNames: ['items', 'paginationProps', 'totalItems', 'filterType', 'categories', 'hideFilters', 'searchLabel'],
    renderHints: [
      'People/employee directory with search, category filters, and pagination.',
      'items contain data + card objects; card is a DXDirectoryCard.',
      'Requires a WCM People content type collection as the data source.',
    ],
    sourceExcerpt: `function DXDirectory({ items, totalItems, filterType, categories }) {
  return (
    <section className="dxDirectory">
      <div className="dxDirectory__filters">search + categories</div>
      <div className="dxDirectory__grid">
        {items.map(item => <DXDirectoryCard {...item.card} />)}
      </div>
    </section>
  );
}`,
  },

  DXGenericCatalog: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxGenericCatalog', 'dxGenericCatalog__filter', 'dxGenericCatalog__body', 'dxGenericCatalog__pagination'],
    propNames: ['filter', 'body', 'pagination'],
    renderHints: [
      'Most flexible catalog: filter (search + filter array), body (items + componentType + elementsPerRow), pagination.',
      'componentType in body determines which card component renders each item.',
      'Use this as the default catalog when no more specific variant fits.',
    ],
    sourceExcerpt: `function DXGenericCatalog({ filter, body, pagination }) {
  return (
    <div className="dxGenericCatalog">
      {filter && <CatalogFilter {...filter} />}
      <div className="dxGenericCatalog__body">
        {body.items.map(item => <DynamicComponent type={body.componentType} {...item} />)}
      </div>
      <DXPagination {...pagination} />
    </div>
  );
}`,
  },

  DXNavigationHeader: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxNavigationHeader', 'dxNavigationHeader__logo', 'dxNavigationHeader__nav', 'dxNavigationHeader__search', 'dxNavigationHeader__level1', 'dxNavigationHeader__level2'],
    propNames: ['navigationImage', 'searchSubmit', 'navigationItems', 'active', 'icons'],
    renderHints: [
      'Standard portal header with logo, nav items (multi-level), and search.',
      'navigationItems supports children for dropdown menus and quickLinks for mega-menu panels.',
      'PORTAL_NATIVE — the header itself comes from the theme/Dynamic Content Spot.',
    ],
    sourceExcerpt: `function DXNavigationHeader({ navigationImage, searchSubmit, navigationItems, active }) {
  return (
    <header className="dxNavigationHeader">
      <img className="dxNavigationHeader__logo" src={navigationImage} />
      <nav className="dxNavigationHeader__nav">
        {navigationItems.map(item => <NavItem {...item} />)}
      </nav>
      <SearchBar onSubmit={searchSubmit} />
    </header>
  );
}`,
  },

  DXGlobalFooter: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxGlobalFooter', 'dxGlobalFooter__logo', 'dxGlobalFooter__primaryLinks', 'dxGlobalFooter__secondaryLinks', 'dxGlobalFooter__copyright'],
    propNames: ['logo', 'altLogo', 'logoMobile', 'copyright', 'primaryLinks', 'secondaryLinks'],
    renderHints: [
      'Standard portal footer with logo, two link groups (primary navigation, legal), and copyright.',
      'primaryLinks and secondaryLinks are LinksProps arrays — map to WCM link elements.',
      'PORTAL_NATIVE — managed through theme and Dynamic Content Spot.',
    ],
    sourceExcerpt: `function DXGlobalFooter({ logo, copyright, primaryLinks, secondaryLinks }) {
  return (
    <footer className="dxGlobalFooter">
      <img className="dxGlobalFooter__logo" src={logo} />
      <nav className="dxGlobalFooter__primaryLinks">...</nav>
      <nav className="dxGlobalFooter__secondaryLinks">...</nav>
      <p className="dxGlobalFooter__copyright">{copyright}</p>
    </footer>
  );
}`,
  },

  DXAccordion: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxAccordion', 'dxAccordion__label', 'dxAccordion__body', 'dxAccordion__icon', 'dxAccordion--active'],
    propNames: ['label', 'body', 'files', 'active', 'icons'],
    renderHints: [
      'Single expandable item: label (trigger) + body (rich text) + optional file download group.',
      'For FAQ sections, use DXAccordionCatalog which wraps multiple DXAccordion items with filters.',
      'active prop controls initial open state.',
    ],
    sourceExcerpt: `function DXAccordion({ label, body, active, icons }) {
  return (
    <div className={\`dxAccordion \${active ? 'dxAccordion--active' : ''}\`}>
      <button className="dxAccordion__label">{label}<span className="dxAccordion__icon" /></button>
      <div className="dxAccordion__body">{body}</div>
    </div>
  );
}`,
  },

  DXSearchInput: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxSearchInput', 'dxSearchInput__input', 'dxSearchInput__button', 'dxSearchInput__overlay', 'dxSearchInput__suggestions'],
    propNames: ['searchOptions', 'searchCards', 'searchFn', 'buttonLabel', 'placeholder', 'collapsed', 'suggestedInfo', 'showOverlay'],
    renderHints: [
      'Portal search entry: input + button + overlay with search suggestions and result cards.',
      'collapsed prop gives an icon-only mode that expands on click.',
      'searchCards and suggestedInfo show pre-search content — no custom typeahead needed.',
    ],
    sourceExcerpt: `function DXSearchInput({ searchOptions, searchCards, placeholder, collapsed }) {
  return (
    <div className="dxSearchInput">
      <input className="dxSearchInput__input" placeholder={placeholder} />
      <button className="dxSearchInput__button" />
      {showOverlay && <div className="dxSearchInput__overlay">suggestions + cards</div>}
    </div>
  );
}`,
  },

  DXDownloadCard: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxDownloadCard', 'dxDownloadCard__icon', 'dxDownloadCard__fileName', 'dxDownloadCard__size', 'dxDownloadCard__button'],
    propNames: ['url', 'fileName', 'size', '_downloadFn', 'icons'],
    renderHints: [
      'Renders a file download item with auto-detected file type icon (PDF, ZIP, DOC, XLS, etc.).',
      'DXDownloadGroup wraps multiple DXDownloadCard items with an optional section title.',
      'No custom download component needed for standard file types.',
    ],
    sourceExcerpt: `function DXDownloadCard({ url, fileName, size }) {
  return (
    <div className="dxDownloadCard">
      <span className="dxDownloadCard__icon">{getFileIcon(url)}</span>
      <span className="dxDownloadCard__fileName">{fileName}</span>
      <span className="dxDownloadCard__size">{size}</span>
      <a href={url} download className="dxDownloadCard__button">Download</a>
    </div>
  );
}`,
  },

  DXDataTable: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxDataTable', 'dxDataTable__header', 'dxDataTable__row', 'dxDataTable__cell', 'dxDataTable__pagination'],
    propNames: ['columns', 'data', 'responsive', 'striped', 'noTableHead', 'pagination', 'paginationPerPage', 'expandableRows'],
    renderHints: [
      'Sortable, paginated, expandable data table backed by live or WCM data.',
      'columns define id, name, dataProp, sortable, and optional labelElement for color-coded cells.',
      'expandableRows shows content in a collapsible sub-row from the expandableContent data field.',
    ],
    sourceExcerpt: `function DXDataTable({ columns, data, pagination, striped, expandableRows }) {
  return (
    <div className="dxDataTable">
      <table>
        <thead>{columns.map(col => <th>{col.name}</th>)}</thead>
        <tbody>{data.map(row => <tr>{columns.map(col => <td>{row[col.dataProp]}</td>)}</tr>)}</tbody>
      </table>
      {pagination && <DXPagination />}
    </div>
  );
}`,
  },

  DXTextBreak: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxTextBreak', 'dxTextBreak__title', 'dxTextBreak__subtitle', 'dxTextBreak__button', 'dxTextBreak--colored'],
    propNames: ['title', 'subtitle', 'button', 'align', 'background', 'textColor'],
    renderHints: [
      'Section divider / CTA strip: title, optional subtitle, optional button, background color/image.',
      'align controls text alignment: left/center/right.',
      'Use before proposing a custom section divider — this covers most visual stripe patterns.',
    ],
    sourceExcerpt: `function DXTextBreak({ title, subtitle, button, align, background, textColor }) {
  return (
    <section className="dxTextBreak" style={{ background: background.color, color: textColor }}>
      <h2 className="dxTextBreak__title" style={{ textAlign: align }}>{title}</h2>
      {subtitle && <p className="dxTextBreak__subtitle">{subtitle}</p>}
      {button && <DXButton {...button} />}
    </section>
  );
}`,
  },

  DXMegaMenu: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxMegaMenu', 'dxMegaMenu__level1', 'dxMegaMenu__level2', 'dxMegaMenu__panel', 'dxMegaMenu__banner', 'dxMegaMenu__globalLinks'],
    propNames: ['navigationItems', 'active', 'menuImage', 'globalLinks', 'secondaryLevelContainerId', 'showOverlay'],
    renderHints: [
      'Full mega-menu pattern with multi-level nav, optional panel banners, and global utility links.',
      'Banner props per NavigationItem allow image/text panels in dropdown columns.',
      'PORTAL_NATIVE — use within theme header Dynamic Content Spot.',
    ],
    sourceExcerpt: `function DXMegaMenu({ navigationItems, globalLinks, menuImage }) {
  return (
    <nav className="dxMegaMenu">
      <ul className="dxMegaMenu__level1">
        {navigationItems.map(item => (
          <li><a>{item.title}</a>
            {item.children && <div className="dxMegaMenu__panel">...</div>}
          </li>
        ))}
      </ul>
    </nav>
  );
}`,
  },

  DXQuickLinks: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxQuickLinks', 'dxQuickLinks__title', 'dxQuickLinks__list', 'dxQuickLinks__item', 'dxQuickLinks__header', 'dxQuickLinks__icon'],
    propNames: ['index', 'title', 'hideTitle', 'quickLinksCollection'],
    renderHints: [
      'Quick access link panel: title + list of links each with firstHeader, secondHeader, superHeader, iconClass, and url.',
      'quickLinksCollection items support a two-line label (header + sub-header) for rich link presentation.',
      'Use before any custom shortcut widget or icon-link grid.',
    ],
    sourceExcerpt: `function DXQuickLinks({ title, quickLinksCollection, hideTitle }) {
  return (
    <div className="dxQuickLinks">
      {!hideTitle && <h3 className="dxQuickLinks__title">{title}</h3>}
      <ul className="dxQuickLinks__list">
        {quickLinksCollection.map(link => (
          <li className="dxQuickLinks__item">
            {link.iconClass && <i className={link.iconClass} />}
            <a href={link.url}>{link.firstHeader}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
  },

  DXCarousel: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxCarousel', 'dxCarousel__item', 'dxCarousel__image', 'dxCarousel__title', 'dxCarousel__subtitle', 'dxCarousel__body', 'dxCarousel__nav'],
    propNames: ['items', 'size'],
    renderHints: [
      'Carousel of image+title+subtitle+body+button slides. size: "small" | "medium" | "big".',
      'Each item maps to a carousel slide with image, text, and optional button.',
      'Use before proposing a custom slideshow — this covers standard carousel patterns.',
    ],
    sourceExcerpt: `function DXCarousel({ items, size }) {
  return (
    <div className={\`dxCarousel dxCarousel--\${size}\`}>
      {items.map(item => (
        <div className="dxCarousel__item">
          <img className="dxCarousel__image" src={item.image.url} />
          <h3 className="dxCarousel__title">{item.title}</h3>
          <p className="dxCarousel__subtitle">{item.subtitle}</p>
        </div>
      ))}
      <nav className="dxCarousel__nav">prev / next</nav>
    </div>
  );
}`,
  },

  DXNewsFeed: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxNewsFeed', 'dxNewsFeed__title', 'dxNewsFeed__filters', 'dxNewsFeed__grid', 'dxNewsFeed__all'],
    propNames: ['title', 'filterCategories', 'items', 'allButtonText'],
    renderHints: [
      'Masonry/grid news feed with category filter tabs and "view all" button.',
      'items can be NFSocialCardProps or NFFullImageCard — mix social and editorial cards.',
      'categories filter prop controls which tab labels appear; no custom filter needed.',
    ],
    sourceExcerpt: `function DXNewsFeed({ title, filterCategories, items, allButtonText }) {
  return (
    <section className="dxNewsFeed">
      <h2 className="dxNewsFeed__title">{title}</h2>
      <div className="dxNewsFeed__filters">{filterCategories.map(cat => <button>{cat}</button>)}</div>
      <div className="dxNewsFeed__grid">{items.map(item => <FeedCard {...item} />)}</div>
    </section>
  );
}`,
  },

  DXProfileInfo: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxProfileInfo', 'dxProfileInfo__image', 'dxProfileInfo__name', 'dxProfileInfo__title', 'dxProfileInfo__contact', 'dxProfileInfo__social'],
    propNames: ['image', 'fullName', 'jobTitle', 'department', 'location', 'office', 'email', 'phone', 'primaryButton', 'secondaryButton', 'socialPresence', 'editAction', 'enableCollapsed'],
    renderHints: [
      'Full user profile card: photo, name, job title, department, contact info, and social links.',
      'enableCollapsed allows the card to start collapsed.',
      'editAction and optionalButtons support My Profile page edit flows without custom code.',
    ],
    sourceExcerpt: `function DXProfileInfo({ image, fullName, jobTitle, department, email, phone }) {
  return (
    <div className="dxProfileInfo">
      <img className="dxProfileInfo__image" src={image?.url} />
      <h2 className="dxProfileInfo__name">{fullName}</h2>
      <p className="dxProfileInfo__title">{jobTitle}</p>
      <p>{department}</p>
      <a href={\`mailto:\${email?.url}\`}>{email?.label}</a>
    </div>
  );
}`,
  },

  DXMap: {
    source: 'node_modules/@blueprint/dx-micro-interaction-components/dist/esm/index.js',
    confidence: 'source-derived',
    cssClasses: ['dxMap', 'dxMap__iframe'],
    propNames: ['iframeUrl'],
    renderHints: [
      'Simple map embed: wraps an iframe from any map provider (Google Maps, etc.).',
      'iframeUrl is the embed URL with API key, center, zoom, and markers already encoded.',
      'SCRIPT_APP because the map API key and configuration live outside editorial WCM.',
    ],
    sourceExcerpt: `function DXMap({ iframeUrl }) {
  return (
    <div className="dxMap">
      <iframe className="dxMap__iframe" src={iframeUrl} />
    </div>
  );
}`,
  },
};

export function getSourceSignature(componentName) {
  return SOURCE_SIGNATURES[componentName] || null;
}

export function signaturesForComponents(components = []) {
  return components.map((component) => [component, getSourceSignature(component)]).filter(([, signature]) => signature);
}
