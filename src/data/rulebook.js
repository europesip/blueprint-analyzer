export const RULESET_VERSION = import.meta.env.VITE_RULESET_VERSION || 'guide-v7';

export const IMPLEMENTATION_PATHS = {
  OOTB_BLUEPRINT: {
    label: 'OOTB Blueprint',
    color: 'brand',
    summary: 'The block fits an existing Blueprint component and its WCM contract.',
    next: 'Validate props, required WCM content, and visual adjustment through Config Styles.',
  },
  CONFIG_STYLE: {
    label: 'Config Styles',
    color: 'signal',
    summary: 'The component exists and the main difference is visual.',
    next: 'Use tokens, CSS, classes, or style configuration before creating an extension.',
  },
  BLUEPRINT_EXTENSION: {
    label: 'Blueprint Extension',
    color: 'warn',
    summary: 'The idea fits Blueprint but requires a registered Blueprint Extension.',
    next: 'Use the ZIP as the local development reference and WCM_Library as the Portal contract.',
  },
  WCM_CONTENT: {
    label: 'WCM Content',
    color: 'brand',
    summary: 'The block is mainly editorial content, a collection, or WCM configuration.',
    next: 'Model authoring/form config, content, collections, and Ring API rendering.',
  },
  PORTAL_NATIVE: {
    label: 'Portal Native',
    color: 'signal',
    summary: 'This should be solved with native Portal capabilities.',
    next: 'Validate the page, navigation, search, theme, or related Dynamic Content Spot.',
  },
  SCRIPT_APP: {
    label: 'Script App',
    color: 'risk',
    summary: 'It should not be forced into Blueprint when it has business logic or strong integrations.',
    next: 'Plan a Script Application, portlet, or custom frontend in a later phase.',
  },
  REVIEW: {
    label: 'Review',
    color: 'warn',
    summary: 'There is not enough evidence to decide.',
    next: 'Review the Figma structure, layer names, content, and Portal criteria.',
  },
};

export const COMPONENT_RULES = [
  // ─────────────────────────────────────────────────────────────
  // HEROES & BANNERS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'hero-banner',
    name: 'Hero / Banner',
    description: 'Large visual entry block with headline, supporting copy, media background, and one or more CTAs.',
    blueprint: ['DXHeroBanner', 'DXHeroBannerCarousel', 'DXOnPageBanner', 'DXBannerStripe'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Content item with image/video, headline, body, CTA, and visual configuration.',
    figmaSignals: ['hero', 'banner', 'splash', 'portada', 'headline', 'cta', 'masthead', 'jumbotron'],
    keywords: ['hero', 'banner', 'splash', 'portada', 'headline', 'masthead', 'jumbotron', 'page header', 'hero section'],
    extensionTriggers: ['rounded', 'custom carousel', 'complex overlay', 'animation'],
    weight: 28,
  },
  {
    id: 'hero-overlay',
    name: 'Hero Overlay / Person / Stacking',
    description: 'Full-bleed overlay hero (DXHeroBannerOverlay), person-featured hero (DXHeroBannerPerson), or stacked hero (DXHeroBannerStacking).',
    blueprint: ['DXHeroBannerOverlay', 'DXHeroBannerPerson', 'DXHeroBannerStacking'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Content item with background color/image, overlay media, optional person data with image, and CTA buttons.',
    figmaSignals: ['overlay', 'hero person', 'feature person', 'hero stacking', 'split hero', 'media hero'],
    keywords: ['hero overlay', 'overlay hero', 'person hero', 'featured person', 'stacking hero', 'media hero', 'split screen hero'],
    extensionTriggers: ['complex animation', 'video autoplay overlay', 'multi-layer parallax'],
    weight: 26,
  },
  {
    id: 'banner-promo',
    name: 'Promo / Newsletter Banner',
    description: 'Secondary promotional banners such as newsletter subscribe strips, countdown floaters, mosaic banners, and portal alert bars.',
    blueprint: ['DXNewsletterBanner', 'DXMosaicBanner', 'DXMosaicButton', 'DXCountdownFloater', 'DXPortalAlerts'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Content item with heading, optional email input, background, CTA link, and alert type configuration.',
    figmaSignals: ['newsletter', 'promo banner', 'subscribe', 'countdown', 'mosaic', 'alert bar', 'notification bar'],
    keywords: ['newsletter', 'subscribe', 'subscription', 'promo', 'promotion', 'countdown', 'mosaic', 'alert banner', 'notification strip', 'offer banner'],
    extensionTriggers: ['form backend', 'complex countdown logic', 'personalised alerts'],
    weight: 20,
  },

  // ─────────────────────────────────────────────────────────────
  // CARDS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'card',
    name: 'Card / Teaser',
    description: 'Reusable teaser block for content, products, people, news, navigation shortcuts, or cases.',
    blueprint: ['DXCard', 'DXCardRounded', 'DXNewsCard', 'DXCardButton', 'DXCaseCard', 'DXAppCard'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Content item or collection with title, image, description, metadata, and links.',
    figmaSignals: ['card', 'tile', 'teaser', 'news card', 'product card', 'app card'],
    keywords: ['card', 'tile', 'teaser', 'tarjeta', 'product', 'news card', 'profile card', 'case card', 'card button', 'app card'],
    extensionTriggers: ['rounded', 'special metadata', 'new visual variant', 'custom hover effect'],
    weight: 24,
  },
  {
    id: 'card-editorial',
    name: 'Full-Image / Straight / Quote Card',
    description: 'Editorial card variants: full-bleed image card (DXFullImageCard), straight horizontal card (DXStraightCard), scrollable card (DXScrollableCard), social card (DXSocialCard), and quote/testimonial card (DXQuote).',
    blueprint: ['DXFullImageCard', 'DXStraightCard', 'DXScrollableCard', 'DXSocialCard', 'DXQuote'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Content item with image, title, optional body, date, and breadcrumb. Quote content type with body and author.',
    figmaSignals: ['full image', 'panoramic', 'straight card', 'quote', 'testimonial', 'social card'],
    keywords: ['full image card', 'straight card', 'quote', 'testimonial', 'review', 'opinion', 'social card', 'full bleed card', 'panoramic card'],
    extensionTriggers: ['complex interactive card', 'custom image treatment', 'animated quote'],
    weight: 21,
  },

  // ─────────────────────────────────────────────────────────────
  // CAROUSELS & SLIDERS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'carousel',
    name: 'Carousel / Slider',
    description: 'Rotating or horizontally browsed collection of slides, cards, banners, or products.',
    blueprint: ['DXCarousel', 'DXHeroBannerCarousel', 'DXProductSlider'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'WCM collection or content selector with multiple items.',
    figmaSignals: ['carousel', 'slider', 'slides', 'dots', 'arrows', 'producto slider'],
    keywords: ['carousel', 'slider', 'carrusel', 'slide', 'product slider', 'image slider'],
    extensionTriggers: ['custom transition', 'nested carousel', 'non-standard controls', 'video carousel'],
    weight: 26,
  },

  // ─────────────────────────────────────────────────────────────
  // CATALOGS & FEEDS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'catalog',
    name: 'Catalog / Feed',
    description: 'List or grid driven by a collection, taxonomy, filters, and pagination. Covers all major DX catalog containers.',
    blueprint: ['DXGenericCatalog', 'DXCatalog', 'DXNewsFeed', 'DXMiniCatalog', 'DXGenericMiniCatalog', 'DXSearchResultsCatalog', 'DXCasesCatalog', 'DXCardButtonCatalog'],
    path: 'WCM_CONTENT',
    wcm: 'Menu component, taxonomy, filters, pagination, and collections.',
    figmaSignals: ['feed', 'catalog', 'listing', 'grid', 'filter', 'pagination', 'results'],
    keywords: ['catalog', 'feed', 'listing', 'grid', 'newsroom', 'noticias', 'filter', 'filtro', 'cases catalog', 'mini catalog', 'content list'],
    extensionTriggers: ['custom datasource', 'complex filters', 'non WCM backend', 'real-time data'],
    weight: 23,
  },
  {
    id: 'card-news-catalog',
    name: 'News / Image Catalog',
    description: 'Specialized catalogs for news cards (DXNewsCardCatalog), full-image cards (DXFullImageCatalog, DXFullImageMiniCatalog), and river-style news lists.',
    blueprint: ['DXNewsCardCatalog', 'DXFullImageCatalog', 'DXFullImageMiniCatalog'],
    path: 'WCM_CONTENT',
    wcm: 'WCM news/article content type, collection with date, category, layout, and pagination.',
    figmaSignals: ['news catalog', 'articles grid', 'press', 'image catalog', 'editorial grid'],
    keywords: ['news catalog', 'articles', 'press', 'newsroom', 'editorial grid', 'image catalog', 'full image catalog', 'media gallery catalog'],
    extensionTriggers: ['external news API', 'custom content type', 'AI-curated feed'],
    weight: 21,
  },

  // ─────────────────────────────────────────────────────────────
  // ACCORDION & INTERACTIVE PANELS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'accordion',
    name: 'Accordion / FAQ',
    description: 'Expandable list of questions, answers, or grouped content sections.',
    blueprint: ['DXAccordion', 'DXAccordionCatalog'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'FAQ content or question list with title and body.',
    figmaSignals: ['accordion', 'faq', 'expandable', 'question', 'collapse'],
    keywords: ['accordion', 'faq', 'pregunta', 'acordeon', 'expandable', 'collapse', 'faqs'],
    extensionTriggers: ['nested interactions', 'custom animation', 'video inside accordion'],
    weight: 21,
  },
  {
    id: 'interactive-tabs',
    name: 'Interactive Tabs / Toggle',
    description: 'Tab-based content switching (DXInteractiveTabs), toggle menus (DXToggleMenu), questions tabs (DXQuestionsTabs), and menu organisers.',
    blueprint: ['DXInteractiveTabs', 'DXToggleMenu', 'DXQuestionsTabs', 'DXMenuOrganizer'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Tab collection with labelled content items, each containing image, text, accordion, or catalog.',
    figmaSignals: ['tabs', 'toggle', 'tabbed', 'interactive section', 'tab panel'],
    keywords: ['tabs', 'toggle', 'tabbed', 'interactive tabs', 'tab panel', 'toggle menu', 'questions tabs', 'multi-section'],
    extensionTriggers: ['deep link to tab', 'animation between tabs', 'tab with live data'],
    weight: 20,
  },

  // ─────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────
  {
    id: 'navigation',
    name: 'Header / Navigation',
    description: 'Global or local navigation, mega-menu, mobile nav, utility zone, or portal header area.',
    blueprint: ['DXNavigationHeader', 'DXNavigationHeader2', 'DXNavigationHeaderMobile', 'DXNavigationHeaderWithUtilities', 'DXMegaMenu', 'DXMicrositeNavigation'],
    path: 'PORTAL_NATIVE',
    wcm: 'Dynamic Content Spot, theme, and Portal navigation.',
    figmaSignals: ['header', 'nav', 'menu', 'top bar', 'masthead', 'mega menu', 'utility zone'],
    keywords: ['header', 'nav', 'navbar', 'menu', 'topbar', 'masthead', 'mega menu', 'navigation bar', 'site header'],
    extensionTriggers: ['personalised navigation', 'utility zone extension', 'custom mega menu panel'],
    weight: 22,
  },
  {
    id: 'sidebar-nav',
    name: 'Sidebar / Vertical Navigation',
    description: 'Vertical or side navigation (DXVerticalNavigation), sidebar menu (DXSidebarMenu), or mobile tab menu (DXMobileTabMenuNavigation).',
    blueprint: ['DXVerticalNavigation', 'DXSidebarMenu', 'DXMobileTabMenuNavigation'],
    path: 'PORTAL_NATIVE',
    wcm: 'Navigation links, sidebar menu component, dynamic content spot.',
    figmaSignals: ['sidebar', 'vertical nav', 'side menu', 'lateral', 'mobile tabs'],
    keywords: ['sidebar', 'side menu', 'lateral menu', 'vertical nav', 'left nav', 'mobile tab', 'bottom nav'],
    extensionTriggers: ['personalised sidebar', 'role-based nav', 'complex mobile nav'],
    weight: 20,
  },

  // ─────────────────────────────────────────────────────────────
  // FOOTER
  // ─────────────────────────────────────────────────────────────
  {
    id: 'footer',
    name: 'Footer',
    description: 'Global or local footer with legal links, navigation groups, and managed footer content.',
    blueprint: ['DXGlobalFooter', 'DXLocalFooter'],
    path: 'PORTAL_NATIVE',
    wcm: 'Dynamic Content Spot, theme, and managed links.',
    figmaSignals: ['footer', 'legal', 'copyright', 'pie de página'],
    keywords: ['footer', 'legal', 'copyright', 'pie', 'bottom links', 'global footer', 'site footer'],
    extensionTriggers: ['complex footer applications', 'footer with live data'],
    weight: 22,
  },

  // ─────────────────────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────────────────────
  {
    id: 'search',
    name: 'Search',
    description: 'Search input, finder block, search suggestions, search+Q&A, or results presentation.',
    blueprint: ['DXSearchInput', 'DXSearchSuggestions', 'DXSearchAndQuestions', 'DXSearchResultsCatalog'],
    path: 'PORTAL_NATIVE',
    wcm: 'Portal Search Center, search input, suggestions, or results catalog.',
    figmaSignals: ['search', 'finder', 'query', 'result', 'autocomplete', 'suggest'],
    keywords: ['search', 'buscar', 'buscador', 'finder', 'resultados', 'search box', 'search bar', 'search input'],
    extensionTriggers: ['external search', 'custom ranking', 'federated sources', 'AI search'],
    weight: 20,
  },

  // ─────────────────────────────────────────────────────────────
  // TEXT & EDITORIAL CONTENT
  // ─────────────────────────────────────────────────────────────
  {
    id: 'text-content',
    name: 'Text / Content Break',
    description: 'Editorial section with title, rich text, CTA, stripe, or simple content emphasis.',
    blueprint: ['DXTextBreak', 'DXBannerStripe'],
    path: 'WCM_CONTENT',
    wcm: 'Simple content item with title, body, CTA, and visual variants.',
    figmaSignals: ['content', 'text', 'section', 'cta', 'paragraph', 'banner stripe', 'text break'],
    keywords: ['text', 'content', 'section', 'cta', 'destacado', 'copy', 'rich text', 'editorial', 'text break', 'banner stripe'],
    extensionTriggers: ['layout irregular', 'custom rich media', 'animated text'],
    weight: 14,
  },
  {
    id: 'table-taxonomy',
    name: 'Table of Contents / Taxonomy Filter',
    description: 'Document table of contents (DXTableOfContents), taxonomy/category filter panel (DXTaxonomyFilter).',
    blueprint: ['DXTableOfContents', 'DXTaxonomyFilter'],
    path: 'WCM_CONTENT',
    wcm: 'Content index, taxonomy nodes, filter categories, and search integration.',
    figmaSignals: ['table of contents', 'index', 'toc', 'taxonomy', 'filter panel', 'category'],
    keywords: ['table of contents', 'indice', 'toc', 'taxonomy', 'taxonomy filter', 'category filter', 'filter panel', 'tag filter'],
    extensionTriggers: ['deep taxonomy custom logic', 'external taxonomy API'],
    weight: 18,
  },

  // ─────────────────────────────────────────────────────────────
  // QUICK LINKS & UTILITY NAVIGATION
  // ─────────────────────────────────────────────────────────────
  {
    id: 'quick-links',
    name: 'Quick Links / Fast Access',
    description: 'Quick link panels (DXQuickLinks), fast access menus (DXFastAccessMenu), saved links (DXMySavedLinks, DXMyLinksCard), and link lists (DXLinkList).',
    blueprint: ['DXQuickLinks', 'DXFastAccessMenu', 'DXLinkList', 'DXMySavedLinks', 'DXMyLinksCard'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Link list content type with headers, icons, and URL groups.',
    figmaSignals: ['quick links', 'fast access', 'shortcuts', 'link panel', 'saved links', 'my links'],
    keywords: ['quick links', 'fast access', 'shortcuts', 'link list', 'saved links', 'my links', 'access links', 'icon links'],
    extensionTriggers: ['personalised links', 'role-based shortcuts', 'live link status'],
    weight: 19,
  },
  {
    id: 'river-content',
    name: 'River of Content / News Roll',
    description: 'Chronological news/content river (DXRiverOfContent, DXRiverOfNewsClassic) and compact news roll (DXNewsRoll).',
    blueprint: ['DXRiverOfContent', 'DXRiverOfNewsClassic', 'DXNewsRoll'],
    path: 'WCM_CONTENT',
    wcm: 'News article collection with date, title, link, and optional image. Paginated or scrollable.',
    figmaSignals: ['river', 'news list', 'article list', 'news roll', 'latest news', 'recent articles'],
    keywords: ['river', 'news river', 'article list', 'news list', 'news roll', 'latest news', 'noticias recientes', 'recent articles'],
    extensionTriggers: ['real-time feed', 'external news API', 'AI curation'],
    weight: 20,
  },

  // ─────────────────────────────────────────────────────────────
  // GALLERY & MEDIA
  // ─────────────────────────────────────────────────────────────
  {
    id: 'gallery-media',
    name: 'Gallery / Media',
    description: 'Image gallery lightbox (DXGallery), product slider (DXProductSlider), and parallax content blocks (DXParallaxContentBlock).',
    blueprint: ['DXGallery', 'DXProductSlider', 'DXParallaxContentBlock'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Gallery content type with image collection, captions, and optional filter/navigation.',
    figmaSignals: ['gallery', 'lightbox', 'image grid', 'photo gallery', 'media gallery', 'product gallery'],
    keywords: ['gallery', 'galeria', 'lightbox', 'image grid', 'photo gallery', 'media gallery', 'product gallery', 'image collection'],
    extensionTriggers: ['video gallery', 'custom zoom', 'AR product view', 'user-uploaded media'],
    weight: 22,
  },
  {
    id: 'video-social',
    name: 'Video / Social Embed',
    description: 'Embedded video player (DXVideo), social media feed/card (DXTwitterFeed), social sharing (DXSocialShare), and social presence (DXSocialPresence).',
    blueprint: ['DXVideo', 'DXTwitterFeed', 'DXSocialShare', 'DXSocialPresence'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Video content item (playlist, service: youtube/vimeo), social embed config.',
    figmaSignals: ['video', 'youtube', 'vimeo', 'twitter', 'social', 'social feed', 'social share', 'embed'],
    keywords: ['video', 'youtube', 'vimeo', 'twitter feed', 'social feed', 'social share', 'rrss', 'embed video', 'social media'],
    extensionTriggers: ['custom video player', 'live stream', 'social wall'],
    weight: 21,
  },

  // ─────────────────────────────────────────────────────────────
  // PARALLAX
  // ─────────────────────────────────────────────────────────────
  {
    id: 'parallax',
    name: 'Parallax',
    description: 'Half-parallax sliding sections (DXHalfParallax), parallax navigation (DXParallaxNavigation) — visual scroll effects using built-in DX components.',
    blueprint: ['DXHalfParallax', 'DXParallaxNavigation'],
    path: 'CONFIG_STYLE',
    wcm: 'Slide collection with title, rich text, background images, and keypad/CTA groups.',
    figmaSignals: ['parallax', 'scroll effect', 'scroll section', 'scroll reveal'],
    keywords: ['parallax', 'scroll effect', 'section scroll', 'scroll reveal', 'depth scroll', 'parallax section'],
    extensionTriggers: ['advanced parallax speed', 'custom GSAP animation', 'video parallax'],
    weight: 18,
  },

  // ─────────────────────────────────────────────────────────────
  // EVENTS & CALENDAR
  // ─────────────────────────────────────────────────────────────
  {
    id: 'event-catalog',
    name: 'Event Catalog / Event Card',
    description: 'Event listings (DXEventCatalog, DXEventTabs), individual event cards (DXEvent, DXEventItem), and full event detail views (DXEventDetails).',
    blueprint: ['DXEvent', 'DXEventCatalog', 'DXEventDetails', 'DXEventItem', 'DXEventTabs'],
    path: 'WCM_CONTENT',
    wcm: 'Event content type with date, time, location, category, registration link, and collection.',
    figmaSignals: ['event', 'agenda', 'session', 'schedule', 'conference', 'event card', 'event detail'],
    keywords: ['event', 'evento', 'agenda', 'session', 'conference', 'schedule', 'event listing', 'event detail', 'event card'],
    extensionTriggers: ['external event API', 'registration system', 'real-time availability'],
    weight: 23,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Monthly calendar (DXCalendar), full calendar view (DXFullCalendar), weekly calendar (DXWeeklyCalendar), and next meeting widget (DXMyNextMeeting).',
    blueprint: ['DXCalendar', 'DXFullCalendar', 'DXWeeklyCalendar', 'DXMyNextMeeting'],
    path: 'SCRIPT_APP',
    wcm: 'Calendar events from WCM or external calendar API. Typically requires live data.',
    figmaSignals: ['calendar', 'month view', 'week view', 'day view', 'booking', 'appointment'],
    keywords: ['calendar', 'month', 'week', 'schedule', 'appointment', 'booking', 'next meeting', 'full calendar'],
    extensionTriggers: ['external calendar integration', 'booking system', 'live availability'],
    weight: 23,
  },

  // ─────────────────────────────────────────────────────────────
  // PEOPLE & DIRECTORY
  // ─────────────────────────────────────────────────────────────
  {
    id: 'directory-people',
    name: 'Directory / Profile',
    description: 'Employee directory (DXDirectory, DXDirectoryCard), user profile cards (DXProfileCard, DXProfileInfo), and user dashboard (DXUserDashboard).',
    blueprint: ['DXDirectory', 'DXDirectoryCard', 'DXProfileCard', 'DXProfileInfo', 'DXUserDashboard'],
    path: 'WCM_CONTENT',
    wcm: 'People content type with name, photo, role, department, contact, and social links.',
    figmaSignals: ['directory', 'team', 'people', 'member', 'employee', 'profile', 'staff', 'user card'],
    keywords: ['directory', 'team', 'people', 'member', 'employee', 'profile', 'staff', 'person card', 'user profile', 'about team'],
    extensionTriggers: ['LDAP/AD integration', 'live profile data', 'org-specific fields'],
    weight: 22,
  },
  {
    id: 'org-chart',
    name: 'Org Chart / Project Card',
    description: 'Organizational hierarchy visualizations (DXOrgChart, DXOrgChartBottomUp), chart card (DXChartCard), and project cards (DXProjectCard).',
    blueprint: ['DXOrgChart', 'DXOrgChartBottomUp', 'DXChartCard', 'DXProjectCard'],
    path: 'SCRIPT_APP',
    wcm: 'Requires live user/org data from LDAP, HR system, or project management API.',
    figmaSignals: ['org chart', 'organization', 'hierarchy', 'reporting', 'team structure', 'project card'],
    keywords: ['org chart', 'organigrama', 'organization chart', 'hierarchy', 'reporting lines', 'team structure', 'project card'],
    extensionTriggers: ['LDAP hierarchy', 'HR system API', 'real-time reporting'],
    weight: 22,
  },

  // ─────────────────────────────────────────────────────────────
  // DASHBOARDS & WIDGETS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'dashboard-widget',
    name: 'Dashboard Widget / KPI Card',
    description: 'Dashboard KPI cards (DXDashboardCard, DXDashboardContainer), JIRA-style task cards (DXJiraTaskCard), and expense cards (DXExpensesCard).',
    blueprint: ['DXDashboardCard', 'DXDashboardContainer', 'DXJiraTaskCard', 'DXExpensesCard'],
    path: 'SCRIPT_APP',
    wcm: 'Live data required. Use Script Application; Blueprint components used only as visual shell.',
    figmaSignals: ['dashboard', 'widget', 'kpi', 'metric', 'stat card', 'task card', 'expense'],
    keywords: ['dashboard', 'widget', 'kpi', 'metric', 'stat', 'task card', 'expense card', 'summary card', 'analytics widget'],
    extensionTriggers: ['live API', 'real-time data', 'personalised metrics'],
    weight: 24,
  },

  // ─────────────────────────────────────────────────────────────
  // DOWNLOADS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'download',
    name: 'Download / Resource',
    description: 'File download cards (DXDownloadCard) and grouped download sections (DXDownloadGroup).',
    blueprint: ['DXDownloadCard', 'DXDownloadGroup'],
    path: 'WCM_CONTENT',
    wcm: 'Download content type with file URL, name, size, and file type. WCM manages the asset library.',
    figmaSignals: ['download', 'resource', 'document', 'pdf', 'attachment', 'file'],
    keywords: ['download', 'descarga', 'resource', 'document', 'pdf', 'attachment', 'file download', 'brochure', 'whitepaper'],
    extensionTriggers: ['gated download', 'access control', 'license agreement'],
    weight: 20,
  },

  // ─────────────────────────────────────────────────────────────
  // FINANCIAL / TICKER
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ticker-financial',
    name: 'Ticker / Financial Data',
    description: 'Stock ticker (DXTicker, DXTickerMenu) for live market data display. Requires external financial data integration.',
    blueprint: ['DXTicker', 'DXTickerMenu'],
    path: 'SCRIPT_APP',
    wcm: 'External financial API. Cannot be served from WCM editorial content.',
    figmaSignals: ['ticker', 'stock', 'financial', 'price', 'market', 'cotizacion'],
    keywords: ['ticker', 'financial', 'stock', 'price', 'market data', 'cotizacion', 'bolsa', 'trading'],
    extensionTriggers: ['financial API', 'real-time prices', 'trading integration'],
    weight: 24,
  },

  // ─────────────────────────────────────────────────────────────
  // MODALS & OVERLAYS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'modal-drawer',
    name: 'Modal / Drawer',
    description: 'Modal dialog windows (DXModalWindows) and side drawer menus (DXDrawerMenu).',
    blueprint: ['DXModalWindows', 'DXDrawerMenu'],
    path: 'OOTB_BLUEPRINT',
    wcm: 'Modal content item with title, text, image, and primary/secondary button actions.',
    figmaSignals: ['modal', 'drawer', 'overlay', 'popup', 'dialog', 'flyout'],
    keywords: ['modal', 'drawer', 'overlay', 'popup', 'dialog', 'flyout', 'panel', 'side panel'],
    extensionTriggers: ['complex modal logic', 'authentication modal', 'multi-step modal workflow'],
    weight: 20,
  },

  // ─────────────────────────────────────────────────────────────
  // MAP
  // ─────────────────────────────────────────────────────────────
  {
    id: 'map',
    name: 'Map / Location',
    description: 'Embedded map iframe (DXMap) for location display. Wraps a map provider iframe URL.',
    blueprint: ['DXMap'],
    path: 'SCRIPT_APP',
    wcm: 'Map content item with iframe URL. Map provider API key managed outside WCM.',
    figmaSignals: ['map', 'location', 'mapa', 'geolocalizacion', 'store locator'],
    keywords: ['map', 'mapa', 'location', 'geolocalizacion', 'store locator', 'google maps', 'embedded map', 'directions'],
    extensionTriggers: ['store locator', 'custom markers', 'real-time location'],
    weight: 25,
  },

  // ─────────────────────────────────────────────────────────────
  // ONBOARDING
  // ─────────────────────────────────────────────────────────────
  {
    id: 'onboarding',
    name: 'Onboarding / Guided Tour',
    description: 'Step-by-step guided onboarding tour (DXOnboarding) using intro.js-based steps.',
    blueprint: ['DXOnboarding'],
    path: 'SCRIPT_APP',
    wcm: 'Onboarding step definitions authored in WCM or embedded as static config. Requires JS interaction.',
    figmaSignals: ['onboarding', 'tour', 'walkthrough', 'intro', 'guide', 'step'],
    keywords: ['onboarding', 'tour', 'walkthrough', 'intro', 'guide', 'tutorial', 'step by step', 'welcome flow'],
    extensionTriggers: ['personalised tour', 'role-based onboarding', 'conditional steps'],
    weight: 22,
  },

  // ─────────────────────────────────────────────────────────────
  // FORMS & TRANSACTIONS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'form',
    name: 'Form / Transaction',
    description: 'Interactive data capture or transactional flow with fields, validation, or submission.',
    blueprint: ['DXButton', 'DXSearchInput'],
    path: 'SCRIPT_APP',
    wcm: 'Do not solve as editorial WCM when validation, persistence, or integration is required.',
    figmaSignals: ['form', 'field', 'input', 'submit', 'login', 'register'],
    keywords: ['form', 'input', 'field', 'login', 'registro', 'contact', 'subscribe', 'sign up', 'checkout'],
    extensionTriggers: ['validation', 'backend', 'workflow', 'authentication', 'payment'],
    weight: 25,
  },

  // ─────────────────────────────────────────────────────────────
  // DATA / CHARTS / DASHBOARDS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'data-app',
    name: 'Data / Chart / Analytics',
    description: 'Data-heavy visualizations: data tables (DXDataTable), pie/donut charts (DXPieChart), tree maps (DXTreeMap), and analytics dashboards.',
    blueprint: ['DXDataTable', 'DXPieChart', 'DXTreeMap'],
    path: 'SCRIPT_APP',
    wcm: 'It can use Blueprint visually, but the logic lives outside editorial authoring.',
    figmaSignals: ['dashboard', 'table', 'chart', 'kpi', 'analytics', 'pie chart', 'treemap'],
    keywords: ['dashboard', 'table', 'chart', 'kpi', 'analytics', 'pie chart', 'treemap', 'data table', 'statistics', 'estadisticas'],
    extensionTriggers: ['live data', 'api', 'permissions', 'filters', 'export', 'drill-down'],
    weight: 25,
  },
];

export const MATERIALS = [
  {
    id: 'reference-zip',
    name: 'extended-blueprint-feature-reference-blueprint.zip',
    role: 'Local development reference',
    use: 'Inspect props, readable ESM (82,720 lines), CSS, and examples to understand how DX components are composed. The index.d.ts (2,062 lines) provides TypeScript contracts for all 116 components.',
  },
  {
    id: 'wcm-library',
    name: 'WCM_Library / Blueprint Extensions',
    role: 'Portal/WCM contract',
    use: 'Validate content types, form configs, dxcomponents, registered JavaScript, and extension examples.',
  },
  {
    id: 'portal-blueprint',
    name: 'Librerias Blueprint nativas de Portal',
    role: 'OOTB baseline',
    use: 'Reuse what Portal already provides before creating extensions.',
  },
  {
    id: 'hcl-pdfs',
    name: 'PDFs HCL Blueprint',
    role: 'Official learning material',
    use: 'Cross-check criteria, scope, and architecture against HCL documentation.',
  },
  {
    id: 'storybook',
    name: 'HCL Blueprint Storybook',
    role: 'Visual component reference',
    use: 'Validate visual appearance of each DX component before matching against Figma frames.',
  },
];

export const REVIEW_CHECKS = [
  'The Figma layer name is semantic and not purely visual.',
  'The block is decided by Blueprint/WCM contract, not only by Storybook resemblance.',
  'Visual differences are resolved before proposing an extension.',
  'Blocks with logic, live data, or authentication are not forced into editorial WCM.',
  'When DXCardRounded or another extension appears, validate it against Blueprint Extensions.',
  'WCM_Library import remains outside this phase and will be handled with dxclient/dx-deploy later.',
  'Inner buttons, images, or icons inside a card are props of the parent, not independent components.',
  'Repeated elements of the same type should map to a catalog or collection, not N independent components.',
];
