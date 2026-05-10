import React, { MouseEventHandler, FormEventHandler, MutableRefObject, ReactElement, Component, ButtonHTMLAttributes } from 'react';
import * as d3 from 'd3';
import { IntroJs, Step } from 'intro.js';

declare const purifyAndParseHTML: (content: string | undefined, enclosingDIV?: boolean) => JSX.Element;
declare const parseHTML: (content: string | undefined, enclosingDIV?: boolean) => JSX.Element;
declare const purifyHTML: (content: string | undefined, enclosingDIV?: boolean) => JSX.Element;
declare const parseContent: (content: string | undefined) => JSX.Element;
declare const parseContentAndMedia: (content: string | undefined, enclosingDIV?: boolean) => JSX.Element;
declare const parseLinks: (content: string | undefined, enclosingDIV?: boolean) => JSX.Element;

interface ButtonLinkProps {
    url: string;
    target?: string;
}
interface LinksProps {
    url: string;
    label: string;
    target?: string;
}
interface LinkIconProps {
    url: string;
    label: string;
    target?: string;
    icon?: {
        class: string;
        position?: ("left" | "right");
    };
    hideLabel?: boolean;
}
declare const getLinkTarget: (target: string | undefined) => string;
declare const getLinkIcon: (target: string | undefined) => JSX.Element | "";
declare const generateLinkAnchor: (linkProps: LinksProps, className?: string, props?: any) => JSX.Element;
declare const generateLinkIcon: (linkProps: LinkIconProps, className?: string, props?: any) => JSX.Element;

interface ImageProps {
    url: string;
    altText?: string;
}
interface GalleryImageProps {
    url: string;
    description: string;
}

interface ButtonProps$3 {
    label?: string;
    onClick: Function;
}
interface NumericButtonProps {
    label: number;
    onClick: Function;
}
interface ButtonMouseHandler {
    label?: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
}
interface IconButtonProps {
    label: string;
    onClick?: Function | FormEventHandler | MouseEventHandler<HTMLButtonElement>;
    icon?: {
        class: string;
        position?: "left" | "right";
        testId?: string;
    };
    hideLabel?: boolean;
}

/**
 * @param ref[]
 * @param onClickOutSideAction
 *
 * How to use:
 * In your component create a constant using this format:
 * - const <varName> = useRef(null);
 * - then add this variable as param to the container you want to listen of 'outside' clicks:
 * example: <div ref={<varName>}></div>
 *
 * You can repeat these steps to create multiple references and assing them to multiple containers.
 *
 * Under this declaration call this function (clickOutsideAlerter) and use your new created variable(s) as the first parameter in an array structure.
 * As second param send any action you want to execute when clicking outside the specified container.
 * Example:
 * clickOutsideAlerter( [myFirstRef, mySecondRef, ...] , myFunction );
 */
declare const clickOutsideAlerter: (refs: any[], onClickOutSideAction: Function) => void;
declare function disableOverlay(id: string, className: string, callback: Function): void;
declare const renderOverlayElement: (id: string, className: string, overlayActive: boolean, callback: Function) => JSX.Element;

declare const getVideoFormat: (url: string, className?: string, testId?: string, videoRef?: React.RefObject<HTMLVideoElement>) => JSX.Element;

/**
 *
 * Be sure that if you are using months or days without zeros, you should use the format
 * with the / separator
 */
interface DateValues {
    year: string;
    month: string;
    day: string;
}
declare const getValuesFromDateFormat: (receivedDate: string, receivedFormat: string | undefined) => {
    year: string;
    month: string;
    day: string;
};
declare const getMonthPrefix: (month: string) => string;
declare const getFullMonth: (month: string) => string;
declare const getMomentDayShort: (day: number) => "" | "Mon" | "Sun" | "Tu" | "Wed" | "Th" | "Fri" | "Sat";

declare const overflowText: (word: string, limit: number) => string;

declare const getColNumber: (elementsPerRow: number | undefined) => {
    sm: number;
    md: number;
    lg: number;
    xl: number;
};

interface ChartItem {
    value?: number;
    name: string;
    color?: string;
}
interface PieChartItem extends ChartItem {
    percent: number;
}
interface TreeMapChartItem extends ChartItem {
    group?: string;
    children?: TreeMapChartItem[];
}
interface PieChartInit {
    data: PieChartItem[];
    width: number;
    diagonalLineLenght: number;
    diagonalLineOffset: number;
    horizontalLineLenght: number;
    showNominal?: boolean;
    prefix?: string;
    suffix?: string;
}
declare class Chart {
    defaultColors: any;
    svg: d3.Selection<SVGSVGElement, any, any, any>;
    data: PieChartItem[] | TreeMapChartItem;
    constructor(data: ChartItem[] | ChartItem, width: number, chartType: string);
    getPieColor(d: d3.PieArcDatum<ChartItem>): string;
    getTreeMapColor(d: d3.HierarchyRectangularNode<TreeMapChartItem>): string;
}
declare class PieChart extends Chart {
    data: PieChartItem[];
    radius: number;
    pie: d3.Pie<any, PieChartItem>;
    arc: d3.Arc<any, any>;
    showNominal: boolean;
    prefix: string;
    suffix: string;
    constructor(init: PieChartInit);
    midAngle(d: d3.PieArcDatum<ChartItem>): number;
    midAngleP(d: d3.PieArcDatum<ChartItem>): number;
    renderArc(innerRadiusPercent: number, outerRadiusPercent: number): void;
    renderBackgroundArc(innerRadiusPercent: number, outerRadiusPercent: number): void;
    renderLine(centerOffset: number, lineLenght: number, horizontalLineLenght: number): void;
    renderLabels(lineLenght: number): void;
}

interface QuickLinksProps {
    index: number;
    title?: string;
    hideTitle?: boolean;
    quickLinksCollection: QuickLink[];
}
interface QuickLink {
    firstHeader: string;
    secondHeader?: string;
    superHeader?: string;
    iconClass?: string;
    target?: string;
    url: string;
}
declare const DXQuickLinks: (props: QuickLinksProps) => JSX.Element;

interface NavigationItemProps {
    title: string;
    url?: string;
    target?: string;
    children?: NavigationItemProps[];
    index: number;
    quickLinks?: QuickLinksProps;
}

declare const renderAvatarLetters: (name: string, optionalClass?: undefined | string, key?: string, testId?: string) => JSX.Element;
declare const renderAvatarProjectMembers: (name: string, optionalClass?: undefined | string, key?: string, testId?: string, mouseEnterFn?: Function, mouseLeaveFn?: Function) => JSX.Element;

interface TagProps {
    label: string;
    color?: string;
}

interface SliderIcons {
    prev?: string;
    next?: string;
}
interface StateIcons {
    close?: string;
    open?: string;
}
declare const getIcon: (icon: any, value: string, defaultIcon: string) => any;

declare const Button: (props: ButtonMouseHandler) => JSX.Element;

interface DownloadCardProps {
    url: string;
    fileName?: string;
    size?: string;
    _downloadFn?: Function;
    icons?: {
        download?: string;
        pdf?: string;
        png?: string;
        jpg?: string;
        svg?: string;
        html?: string;
        js?: string;
        css?: string;
        zip?: string;
        doc?: string;
        ppt?: string;
        xls?: string;
        fileOther?: string;
    };
}
declare const DXDownloadCard: (props: DownloadCardProps) => JSX.Element;

interface DownloadGroupProps {
    downloads: DownloadCardProps[];
    title?: string;
}
declare const DXDownloadGroup: (props: DownloadGroupProps) => JSX.Element;

interface CardComponent {
    _search?: string;
    index?: number;
    [x: string]: any;
}

interface AccordionProps extends CardComponent {
    label: string;
    body: string;
    files?: DownloadGroupProps;
    _catalogHandler?: Function;
    _catalogIndex?: Number;
    active?: boolean;
    icons?: StateIcons;
}
declare const DXAccordion: (props: AccordionProps) => JSX.Element;

interface AccordionCatalogProps {
    items: {
        data: {};
        accordion: AccordionProps;
    }[];
    paginationProps: {
        sets: string[];
        active: number;
        activeSet: number;
    };
    totalItems: number;
    filterType: string;
    categories: string[];
    hideFilters?: boolean;
    searchLabel?: string;
    searchPlaceholder?: string;
    activeIndex?: number;
}
declare const DXAccordionCatalog: (props: AccordionCatalogProps) => JSX.Element;

interface AdProps {
    img?: ImageProps;
    icon?: string;
    text?: string;
    backgroundColor?: string;
}
declare const DXAd: (props: AdProps) => JSX.Element;

interface AdsProps {
    ads: AdProps[];
}
declare const DXAds: (props: AdsProps) => JSX.Element;

interface AppCardProps extends CardComponent {
    media: ImageProps | string;
    actionFn: Function;
    label: string;
}
declare const DXAppCard: (props: AppCardProps) => JSX.Element;

interface CountdownProps {
    date: string;
    showSeconds?: boolean;
    textColor?: string;
}
declare const DXCountdownFloater: (props: CountdownProps) => JSX.Element;

interface BannerStripeProps {
    index: number;
    header: string;
    body?: string;
    textPosition?: "right" | "left";
    textColor?: string;
    background?: BackgroundProps$3;
    foreground?: ForegroundProps;
    buttons?: IconButtonProps[];
    bodyClass?: string;
}
interface BackgroundProps$3 {
    url?: string;
    gradient?: boolean;
    color?: string;
}
interface ForegroundProps {
    image?: string;
    video?: string;
    alt?: string;
    countdown?: CountdownProps;
}
declare const DXBannerStripe: (props: BannerStripeProps) => JSX.Element;

declare type DisplayType = "primary" | "secondary" | "unstyled" | undefined;
declare type ButtonType = "button" | "submit" | "reset" | undefined;
interface ButtonProps$2 {
    label: string;
    hideLabel?: boolean;
    id?: string;
    role?: string;
    ariaExpanded?: boolean;
    type?: ButtonType;
    hidden?: boolean;
    disabled?: boolean;
    className?: string;
    value?: string | number;
    style?: {};
    reactRef?: MutableRefObject<any>;
    onClick?: Function | FormEventHandler | MouseEventHandler<HTMLButtonElement>;
    displayType?: DisplayType;
    icon?: {
        class: string;
        position?: "left" | "right";
        testId?: string;
    };
    tabIndex?: number;
}
interface HelperAttrs {
    "data-testid"?: string;
}
declare const DXButton: React.FC<ButtonProps$2 & HelperAttrs>;

interface Event$3 {
    name: string;
    date: string;
    link: string;
    color?: string;
}
interface CalendarProps {
    events: Event$3[];
    small?: boolean;
    seeMoreText?: string;
    _selectEvent?: (eventNumber: Event$3) => void;
    icons?: SliderIcons;
}
declare const DXCalendar: (props: CalendarProps) => JSX.Element;

interface BasicComponent {
    _edit?: EditButtonProps;
}
interface ClickableLink {
    url: string;
    target?: string;
}
interface EditButtonProps {
    button?: Function;
    link?: ClickableLink;
}

interface Event$2 {
    date: string;
    dateFormat?: string;
    startTime: string;
    endTime?: string;
}
interface IconInfo {
    icon: string;
    text?: string;
}
interface CardProps extends BasicComponent, CardComponent {
    title: LinksProps;
    cover?: ImageProps;
    coverSticker?: string;
    checkbox?: Function;
    label?: string;
    metaLabel?: string;
    options?: ButtonProps$3[];
    description?: string;
    bodyMetadata?: string;
    event?: Event$2;
    iconData?: IconInfo;
    images?: {
        items: ImageProps[];
        moreFn?: Function;
    };
    primaryButton?: IconButtonProps;
    secondaryButton?: IconButtonProps;
    bottomLabel?: boolean;
}
declare const DXCard: (props: CardProps) => JSX.Element;

interface CaseCardProps {
    title: string;
    subtitle: string;
    label: TagProps;
    options: ButtonProps$3[];
}
declare const DXCaseCard: (props: CaseCardProps) => JSX.Element;

interface CasesCatalogProps {
    items: CaseCardProps[];
}
declare const DXCasesCatalog: (props: CasesCatalogProps) => JSX.Element;

interface CardButtonProps extends BasicComponent, CardComponent {
    header: string;
    body?: string;
    img: ImageProps;
    link: string;
    direction?: ("left" | "right");
    cta?: {
        label: string;
        justify?: ("left" | "right" | "center");
        icon?: {
            class: string;
            position?: ("left" | "right");
        };
    };
}
declare const DXCardButton: (props: CardButtonProps) => JSX.Element;

interface CBCatalogProps extends BasicComponent {
    elements: CardButtonProps[];
    header?: string;
    variant: string;
    elementsPerRow?: number;
    icons?: SliderIcons;
}
declare const DXCardButtonCatalog: (props: CBCatalogProps) => JSX.Element;

interface CarouselItem {
    image: ImageProps;
    title: string;
    subtitle?: string;
    body?: string;
    button?: IconButtonProps;
}
interface CarouselProps {
    items: CarouselItem[];
    size: ("small" | "medium" | "big");
}
declare const DXCarousel: (props: CarouselProps) => JSX.Element;

interface CatalogProps extends BasicComponent {
    items: CardProps[];
    totalItems: number;
    filterType: string;
    paginationProps: {
        sets: string[];
        active: number;
        activeSet: number;
    };
    categories: string[];
    searchLabel?: string;
    searchPlaceholder?: string;
    hideFilters?: boolean;
    elementsPerRow?: number;
    masonryLayout?: boolean;
    maxCardHeight?: string;
}
declare const DXCatalog: (props: CatalogProps) => JSX.Element;

interface ChartCardProps {
    id: string;
    displayName: string;
    jobTitle?: string;
    hideImage?: boolean;
    profileImage?: string;
    reportersNumbers?: ButtonNumber;
    menuOptions?: ItemsProps[];
    onCollapsedChange?: (isCollapsed: string) => void;
    reporterUsers?: ChartCardProps[];
    manager?: ChartCardProps;
    icons?: StateIcons;
}
interface ItemsProps {
    label: string;
    href?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
interface ButtonNumber {
    index?: number;
    label?: number;
    onClick?: Function;
}
declare const DXChartCard: (props: ChartCardProps) => JSX.Element;

interface DashboardCardProps {
    index: number;
    data: string;
    label: string;
    onClick?: Function;
    mainIcon?: string;
    secondaryIcon?: string;
}
declare const DXDashboardCard: (props: DashboardCardProps) => JSX.Element;

interface DashboardContainerProps {
    title?: string;
    icons?: {
        header?: string;
        collapse?: string;
    };
    link?: LinksProps;
    elements: {
        collapsible?: boolean;
        collapsedHeigh?: string;
        showCollapsedOverlay?: boolean;
        subtitle?: string;
        reactChild?: ReactElement;
        customChild?: CustomElementType;
    }[];
    primaryButton?: IconButtonProps;
    secondaryButton?: IconButtonProps;
    borderlessButton?: IconButtonProps;
    badge?: string;
}
interface CustomElementType {
    type: string;
    props: any;
}
declare const DXDashboardContainer: (props: DashboardContainerProps) => JSX.Element;

interface Column {
    id: string;
    name: string;
    selector?: Function;
    sortable?: boolean;
    sortFunction?: Function;
    right?: boolean;
    center?: boolean;
    labelElement?: {
        dataProperty: string;
        color?: string;
    };
    dataProp: string;
}
interface Data {
    [x: string]: any;
    expandableContent?: string;
}
interface DataTableProps {
    columns: Column[];
    data: Data[];
    responsive?: boolean;
    striped?: boolean;
    noTableHead?: boolean;
    pagination?: boolean;
    paginationPerPage?: number;
    paginationRowsPerPageOptions?: number[];
    expandableRows?: boolean;
    noExpandContentMsg?: string;
}
declare const DXDataTable: (props: DataTableProps) => JSX.Element;

interface DirectoryCardProps extends CardComponent {
    index: number;
    title: string;
    subtitle: LinksProps;
    image?: string;
    [x: string]: any;
    labels?: TagProps[];
    primaryButtons?: IconButtonProps[];
    secondaryButtons?: IconButtonProps[];
    icons?: StateIcons;
}
declare const DXDirectoryCard: (props: DirectoryCardProps) => JSX.Element;

interface DirectoryProps {
    items: DirectoryItem[];
    paginationProps: {
        sets: string[];
        active: number;
        activeSet: number;
    };
    totalItems: number;
    filterType: string;
    categories?: string[];
    hideFilters?: boolean;
    searchLabel?: string;
    searchPlaceholder?: string;
}
interface DirectoryItem {
    data: {};
    card: DirectoryCardProps;
    index?: number;
}
declare const DXDirectory: (props: DirectoryProps) => JSX.Element;

interface DrawerMenuProps {
    direction: "left" | "right";
    contentId: string;
    contentFunction?: Function;
    dark?: boolean;
    showOverlay?: boolean;
    iconClass?: string;
}
declare const DXDrawerMenu: (props: DrawerMenuProps) => JSX.Element;

interface EventProps extends BasicComponent, CardComponent {
    variant: "featured" | "river" | "featured-compact";
    eventFrom: string;
    eventTo?: string;
    eventType?: string;
    eventName: LinksProps;
    eventLocation?: string;
    eventButton?: IconButtonProps;
    eventTime24hrFormat?: boolean;
    icons?: {
        event?: string;
        featured?: string;
        location?: string;
    };
}
declare const DXEvent: (props: EventProps) => JSX.Element;

interface EventCatalogProps {
    items: EventCatalogItem[];
    totalItems: number;
    paginationProps: {
        sets: string[];
        active: number;
        activeSet: number;
    };
    filterType: string;
    categories?: string[];
    hideFilters?: boolean;
    elementsPerRow?: number;
    searchLabel?: string;
    searchPlaceholder?: string;
    hideTypeFilter?: boolean;
}
interface EventCatalogItem {
    data: {};
    event: EventProps;
}
declare const DXEventCatalog: (props: EventCatalogProps) => JSX.Element;

interface SocialShareProps {
    title?: string;
    size?: "small" | "big";
    light?: boolean;
    socialMediaActions: {
        facebook?: {
            display?: boolean;
            onClick?: Function;
        };
        linkedin?: {
            display?: boolean;
            onClick?: Function;
        };
        twitter?: {
            display?: boolean;
            onClick?: Function;
        };
    };
    pageDetails: {
        url: string;
        pageTitle: string;
        description?: string;
    };
}
declare const DXSocialShare: (props: SocialShareProps) => JSX.Element;

interface EventDetailsProp {
    title: string;
    eventFrom: string;
    eventTo: string;
    beginHour: string;
    endHour: string;
    location: string;
    addressLines?: string[];
    eventUrl?: LinksProps;
    mapUrl?: string;
    addToMyCalendar?: boolean;
    contact?: Function;
    getDirections?: Function;
    share?: Function | SocialShareProps;
    register?: Function;
    calendarButtons?: {
        google?: boolean;
        apple?: boolean;
        yahoo?: boolean;
        outlook?: boolean;
    };
    icons?: {
        calendar?: string;
        contact?: string;
        location?: string;
        share?: string;
        register?: string;
        google?: string;
        apple?: string;
        yahoo?: string;
        outlook?: string;
        close?: string;
    };
}
declare const DXEventDetails: (props: EventDetailsProp) => JSX.Element;

interface EventItemProps extends CardComponent {
    variant: "event" | "form";
    eventName?: string;
    eventDate?: string;
    dateFormat?: string;
    eventStartTime?: string;
    eventEndTime?: string;
    formName?: string;
    formNumber?: string;
    formPrice?: number;
    link: LinksProps;
}
declare const DXEventItem: (props: EventItemProps) => JSX.Element | null;

interface EmptyStateProps {
    title: string;
    text?: string;
    image?: ImageProps;
    primaryButton?: IconButtonProps;
    secondaryButton?: IconButtonProps;
}

interface EventElement {
    id: string;
    name: string;
    startDate: string;
    endDate?: string;
    url?: string;
}
interface CategoryElement {
    category?: string;
    events: EventElement[];
}
interface EventTabsProps {
    tabs: CategoryElement[];
    eventsPerPage?: number;
    eventsPerPageMobile?: number;
    empty?: EmptyStateProps;
    dateFormat?: string;
    eventNameCharLimit?: number;
    icons?: ExtendedSliderIcons$1;
}
interface ExtendedSliderIcons$1 extends SliderIcons {
    event?: string;
}
declare const DXEventTabs: (props: EventTabsProps) => JSX.Element;

interface ExpensesCardProps {
    value: number;
    label: string;
    actionButton?: IconButtonProps;
    localeSetting?: string;
    type?: ("complete" | "incomplete");
    currencySymbol?: string;
}
declare const DXExpensesCard: (props: ExpensesCardProps) => JSX.Element;

interface FastAccessMenuProps {
    title?: string;
    link?: LinksProps;
    items: LinksProps[];
    children?: React.ReactNode;
    buttonCustom?: LinksProps;
    icons?: ExtendedSliderIcons;
}
interface ExtendedSliderIcons extends SliderIcons {
    header?: string;
}
declare const DXFastAccessMenu: (props: FastAccessMenuProps) => JSX.Element;

interface Event$1 {
    info: LinksProps;
    date: string;
    [x: string]: any;
}
interface FullCalendarProps {
    events: Event$1[];
    isMobile?: boolean;
    icons?: SliderIcons;
}
declare const DXFullCalendar: (props: FullCalendarProps) => JSX.Element;

interface FullImageCardProps extends BasicComponent, CardComponent {
    image: ImageProps;
    subtitle?: string;
    description: string;
    link: string;
    dateFormat?: string;
}
declare const DXFullImageCard: (props: FullImageCardProps) => JSX.Element;

interface FullImageCatalogItem {
    data: {};
    card: FullImageCardProps;
    index?: number;
}
interface FullImageCatalogProps extends BasicComponent {
    items: FullImageCatalogItem[];
    paginationProps: {
        sets: string[];
        active: number;
        activeSet: number;
    };
    totalItems: number;
    filterType: string;
    categories: string[];
    hideFilters?: boolean;
    searchLabel?: string;
    searchPlaceholder?: string;
    elementsPerRow?: number;
}
declare const DXFullImageCatalog: (props: FullImageCatalogProps) => JSX.Element;

interface FullImageMiniCatalogProps extends BasicComponent {
    index: number;
    items: FullImageCardProps[];
    icons?: SliderIcons;
}
declare const DXFullImageMiniCatalog: (props: FullImageMiniCatalogProps) => JSX.Element;

interface GalleryProps {
    images: GalleryImageProps[];
    title: string;
    date?: string;
    innerInfo?: boolean;
    hideInfo?: boolean;
    icons?: SliderIcons;
}
declare const DXGallery: (props: GalleryProps) => JSX.Element;

interface GenericCatalogProps extends BasicComponent {
    filter?: CatalogFilterProps;
    body: CatalogBodyProps;
    pagination: CatalogPaginationProps;
}
interface CatalogFilterProps {
    search?: {
        label?: string;
        placeholder?: string;
    };
    filters: FilterProps[];
    hide?: boolean;
}
interface FilterProps {
    label?: string;
    attribute: string;
    type: ('select' | 'checkbox' | 'switch' | 'toggle');
}
interface CatalogBodyProps {
    items: CardComponent[];
    componentType: string;
    elementsPerRow?: number;
    empty?: EmptyStateProps;
}
interface CatalogPaginationProps {
    sets: string[];
    active: number;
    activeSet: number;
}
declare const DXGenericCatalog: (props: GenericCatalogProps) => JSX.Element;

interface GenericMiniCatalogProps extends BasicComponent {
    body: MiniCatalogBodyProps;
    header?: MiniCatalogHeaderProps;
}
interface MiniCatalogHeaderProps {
    title: string;
    button?: IconButtonProps;
}
interface MiniCatalogBodyProps {
    items: CardComponent[];
    componentType: string;
    variant?: "slider" | "grid";
    empty?: EmptyStateProps;
    elementsPerRow?: number;
    icons?: SliderIcons;
}
declare const DXGenericMiniCatalog: (props: GenericMiniCatalogProps) => JSX.Element;

interface FooterProps {
    logo: string;
    altLogo?: string;
    logoMobile?: string;
    altMobile?: string;
    copyright: string;
    primaryLinks: LinksProps[];
    secondaryLinks: LinksProps[];
}
declare const DXGlobalFooter: (props: FooterProps) => JSX.Element;

interface ParallaxProps {
    slidesCollection: Fold[];
}
interface Fold {
    banner: Banner;
    content: Content;
}
interface Banner {
    keypad?: Keypad;
    backgroundColor?: string;
    fontColor?: string;
    topImage?: ImageProps;
    mainImage?: ImageProps;
    bottomImage?: ImageProps;
}
interface Content {
    title?: string;
    richText?: string;
    keypad?: Keypad;
    backgroundColor?: string;
    fontColor?: string;
    viewMore?: LinksProps;
    topImage?: ImageProps;
    mainImage?: ImageProps;
    bottomImage?: ImageProps;
}
interface Keypad {
    background?: string;
    buttons: LinksProps[];
}
declare const DXHalfParallax: (props: ParallaxProps) => JSX.Element;

interface SSuggestionsProps {
    searchItems: LinksProps[];
    searchFn?: Function;
    searchPlaceholder?: string;
    iconPosition?: ("left" | "right");
    icons?: {
        search?: string;
        link?: string;
    };
}
declare const DXSearchSuggestions: (props: SSuggestionsProps) => JSX.Element;

interface HeroBannerProps extends BasicComponent {
    index: number;
    header: string;
    subheader?: string;
    body?: string;
    textAlign?: string;
    textColor?: string;
    background?: BackgroundProps$2;
    foreground?: ShapeProps$1;
    primaryButton?: IconButtonProps;
    secondaryButton?: IconButtonProps;
    link?: LinksProps;
    searchSuggestion?: SSuggestionsProps;
    icons?: {
        link?: string;
    };
    animatedText?: {
        content: string[];
        typeSpeed?: number;
        deleteSpeed?: number;
        loop?: boolean;
        hideTitle?: boolean;
    };
}
interface BackgroundProps$2 {
    isVideo?: boolean;
    url?: string;
    opacity?: "light" | "dark";
    heightDesktop?: string;
    heightMobile?: string;
}
interface ShapeProps$1 {
    image: string;
    alt?: string;
    alignment?: string;
}
declare const DXHeroBanner: (props: HeroBannerProps) => JSX.Element;

interface HeroBannerCarouselProps extends BasicComponent {
    index: number;
    items: HeroBannerProps[];
    animationTime?: number;
    autoScrollTime?: number;
    bulletsPosition?: "left" | "center" | "right";
}
declare const DXHeroBannerCarousel: (props: HeroBannerCarouselProps) => JSX.Element;

interface HeroBannerOverlayProps extends BasicComponent {
    index: number;
    header: string;
    subheader?: string;
    body?: string;
    textAlign?: string;
    textColor?: string;
    background?: BackgroundProps$1;
    media?: MediaProps;
    overlayImage?: string;
    foreground?: ShapeProps;
    buttons?: IconButtonProps[];
    link?: LinksProps;
    icons?: {
        link?: string;
    };
}
interface BackgroundProps$1 {
    color?: "primary" | "secondary";
    heightDesktop?: string;
    heightMobile?: string;
    paddingTop?: string;
    paddingBottom?: string;
}
interface MediaProps {
    isVideo?: boolean;
    url?: string;
    opacity?: "light" | "dark";
    marginLeft?: string;
    marginRight?: string;
}
interface ShapeProps {
    image: string;
    alt?: string;
    alignment?: string;
}
declare const DXHeroBannerOverlay: (props: HeroBannerOverlayProps) => JSX.Element;

interface PersonData {
    name?: string;
    role?: string;
    location?: string;
    imageDesktop: string;
    imageMobile?: string;
}
interface HBPersonProps extends BasicComponent {
    title: string;
    subtitle: string;
    searchSuggestion: SSuggestionsProps;
    bannerUrl?: string;
    interval?: number;
    persons: PersonData[];
    bodyClass?: string;
    personInfoClass?: string;
}
declare const DXHeroBannerPerson: (props: HBPersonProps) => JSX.Element;

interface HBStackingProps {
    items: HeroBannerProps[];
    cardMargin?: string;
    stackTopOffset?: string;
}
declare const DXHeroBannerStacking: (props: HBStackingProps) => JSX.Element;

interface InteractiveButtonProps {
    active: IconButtonWithMessage;
    inactive: IconButtonWithMessage;
    disabled?: boolean;
    isActive?: boolean;
}
interface IconButtonWithMessage extends IconButtonProps {
    message: string;
}
declare const DXInteractiveButton: (props: InteractiveButtonProps) => JSX.Element;

interface TabContentItem {
    image?: ImageProps;
    video?: {
        url: string;
        title?: string;
    };
    accordionCatalog?: {
        activeIndex?: number;
        items: AccordionProps[];
    };
    textContent?: {
        title: string;
        subtitle?: string;
        body?: string;
        button?: IconButtonProps;
    };
    catalog?: {
        items: EventItemProps[];
        paginationProps: {
            sets: string[];
            active: number;
            activeSet: number;
        };
        elementsPerRow?: number;
    };
}
interface TabItem {
    label: string;
    content: TabContentItem;
}
interface InteractiveTabsProps {
    tabs: TabItem[];
    mediaPosition?: "left" | "right";
    maxMediaHeight?: string;
}
declare const DXInteractiveTabs: (props: InteractiveTabsProps) => JSX.Element;

interface JiraTaskItem {
    title: LinksProps;
    id?: string;
    text?: string;
    status?: TagProps;
}
interface JiraTaskCardProps extends CardComponent {
    tasks?: JiraTaskItem[];
    projectInfo: ProjectCardProps$1;
    empty?: EmptyStateProps;
    icons?: StateIcons;
}
interface ProjectCardProps$1 {
    name: string;
    img?: ImageProps;
    symbol?: string;
    tags: string[];
    manager?: {
        img?: string;
        name: string;
        profileLink: string;
    };
    members: {
        name: string;
        img?: string;
    }[];
    action?: IconButtonProps;
}
declare const DXJiraTaskCard: (props: JiraTaskCardProps) => JSX.Element;

interface LinkListProps extends BasicComponent {
    title: {
        value: string;
        type: string;
        cta?: LinkIconProps;
    };
    links: LinksProps[];
    elementsPerRow?: number;
    maxLimitDesktop?: number;
    maxLimitMobile?: number;
}
declare const DXLinkList: (props: LinkListProps) => JSX.Element;

interface FooterInfo {
    section: string;
    address: string;
    phone: string;
    links?: LinksProps[];
}
interface FooterSection {
    name: string;
    links: LinksProps[];
}
interface BackgroundImageProps {
    url: string;
    repeat?: string;
    size?: string;
}
interface LocalFooterProps {
    logo?: ImageProps;
    logoMobile?: ImageProps;
    info?: FooterInfo;
    sections: FooterSection[];
    backgroundColor?: string;
    backgroundImageRight?: BackgroundImageProps;
    backgroundImageLeft?: BackgroundImageProps;
}
declare const DXLocalFooter: (props: LocalFooterProps) => JSX.Element;

interface MapProps {
    iframeUrl: string;
}
declare const DXMap: (props: MapProps) => JSX.Element;

interface MegaMenuProps {
    navigationItems: NavigationItem$2[];
    active?: number;
    menuImage?: string;
    globalLinks?: LinksProps[];
    secondaryLevelContainerId: string;
    parentRef?: React.MutableRefObject<null>;
    showOverlay?: boolean;
    icons?: {
        firstLevel?: string;
        secondLevel?: string;
    };
}
interface NavigationItem$2 {
    index: number;
    title: string;
    iconClass?: string;
    url?: string;
    target?: string;
    children?: NavigationItem$2[];
    bannerProps?: BannerProps[];
    onClick?: Function;
}
interface BannerProps {
    title: string;
    image: string;
    body: string;
    imageFit?: string;
    link?: LinksProps;
}
declare const DXMegaMenu: (props: MegaMenuProps) => JSX.Element;

interface MenuOrganizerProps {
    items: MenuItem[];
    onChange(currentArray: MenuItem[]): void;
    empty?: EmptyStateProps;
}
interface MenuItem {
    id?: string;
    label: string;
    [x: string]: any;
}
declare const DXMenuOrganizer: (props: MenuOrganizerProps) => JSX.Element;

interface NextMeetingProps {
    title: string;
    startDateTime: string;
    endDateTime: string;
    link: LinksProps;
    icons?: {
        event?: string;
        link?: string;
    };
}
declare const DXMyNextMeeting: (props: NextMeetingProps) => JSX.Element;

interface NavigationItem$1 extends LinksProps {
    active?: boolean;
    items?: NavigationItem$1[];
    opened?: boolean;
}
interface VerticalNavigationProps {
    items: NavigationItem$1[];
    icons?: StateIcons;
}
declare const DXVerticalNavigation: (props: VerticalNavigationProps) => JSX.Element;

interface MicrositeProps {
    sliderMenu: MicrositeSliderProps;
    navigation: MicrositeNavigationProps;
    icons?: StateIconsExtended;
}
interface StateIconsExtended extends StateIcons {
    more?: string;
    search?: string;
}
interface MicrositeSliderProps {
    menuTitle: string;
    openButtonLabel?: string;
    nextMeeting?: NextMeetingProps;
    moreLink: LinksProps;
}
interface MicrositeNavigationProps {
    closePlaceholder?: string;
    image?: ImageProps;
    searchPlaceholder?: string;
    searchSubmit: FormEventHandler;
    links: VerticalNavigationProps;
    footerButton: CardButtonProps;
}
declare const DXMicrositeNavigation: (props: MicrositeProps) => JSX.Element;

interface MiniCatalogProps extends BasicComponent {
    index: number;
    items: CardProps[];
    icons?: SliderIcons;
}
declare const DXMiniCatalog: (props: MiniCatalogProps) => JSX.Element;

interface NavItems {
    title: string;
    icon?: string;
    contentId: string;
    image?: ImageProps;
    contentFunction?: Function;
}
interface MobileTabMenuNavigationProps {
    items: NavItems[];
    dark?: boolean;
    icons?: {
        close?: string;
    };
}
declare const DXMobileTabMenuNavigation: (props: MobileTabMenuNavigationProps) => JSX.Element;

interface ModalWindowsProps {
    index: number;
    openModal?: boolean;
    title: string;
    text?: string;
    image?: ImageProps;
    primaryButton?: IconButtonProps;
    secondaryButton?: IconButtonProps;
    unstyledButton?: IconButtonProps;
    type?: Status;
    size?: Size;
    disableDisplayFlex?: boolean;
}
declare type Size = 'full-screen' | 'lg' | 'sm' | undefined;
declare type Status = 'danger' | 'info' | 'success' | 'warning' | undefined;
declare const DXModalWindows: (props: ModalWindowsProps) => JSX.Element;

interface MosaicButtonProps {
    index: number;
    size: "lg" | "md" | "sm";
    title: string;
    link: ButtonLinkProps;
    subtitle?: string;
    image?: ImageProps;
}
declare const DXMosaicButton: (props: MosaicButtonProps) => JSX.Element;

interface MosaicBannerProps {
    items: MosaicButtonProps[];
}
declare const DXMosaicBanner: (props: MosaicBannerProps) => JSX.Element;

interface LinksCardProps {
    label: LinksProps | string;
    upButton?: ButtonProps$1;
    downButton?: ButtonProps$1;
    dropdown?: DropdownProps[];
    icons?: {
        card?: string;
        up?: string;
        down?: string;
        menu?: string;
    };
}
interface ButtonProps$1 extends IconButtonProps {
    [index: string]: any;
}
interface DropdownProps {
    label: string;
    onClick: FormEventHandler;
}
declare const DXMyLinksCard: (props: LinksCardProps) => JSX.Element;

interface MySavedLinksProps {
    links: LinksProps[];
    link?: LinksProps;
    title?: string;
    empty?: EmptyStateProps;
    icons?: {
        link?: string;
    };
}
declare const DXMySavedLinks: (props: MySavedLinksProps) => JSX.Element;

interface NavigationProps$1 {
    navigationImage: string;
    navigationImageAlt?: string;
    navigationImageHeight?: number;
    navigationImageWidth?: number;
    searchSubmit: FormEventHandler;
    navigationItems: NavigationItem[];
    active?: number;
    icons?: {
        firstLevel?: string;
        secondLevel?: string;
        search?: string;
    };
}
interface NavigationItem {
    title: string;
    url?: string;
    target?: string;
    children?: NavigationItem[];
    index: number;
    quickLinks?: QuickLinksProps;
}
declare const DXNavigationHeader: (props: NavigationProps$1) => JSX.Element;

interface SearchInputProps {
    searchOptions: LinksProps[];
    searchCards: CardProps[];
    searchFn?: Function;
    buttonLabel?: string;
    placeholder?: string;
    collapsed?: boolean;
    suggestedInfo?: TypeSection[];
    showOverlay?: boolean;
    icons?: {
        search?: string;
        close?: string;
    };
}
interface TypeSection {
    type: string;
    cards: CardProps[];
}
declare const DXSearchInput: (props: SearchInputProps) => JSX.Element;

interface ToolButtonProps {
    icon: string;
    label: string;
    image?: ImageProps;
    showLabel?: boolean;
    onClick: Function;
    badge?: number;
}
declare const DXToolButton: (props: ToolButtonProps) => JSX.Element;

interface UtilityItem extends ToolButtonProps {
    contentId: string;
    contentFunction?: Function;
}
interface UtilityZoneProps {
    items: UtilityItem[];
    panelsContainerId?: string;
    showOverlay?: boolean;
    enableIconPanels?: boolean;
}
declare const DXUtilityZone: ({ items, panelsContainerId, showOverlay, enableIconPanels }: UtilityZoneProps) => JSX.Element;

interface PortalLogosProps {
    main: LinkImage;
    secondary?: LinkImage;
}
interface LinkImage extends LinksProps {
    imageSrc: string;
}
declare const DXPortalLogos: (props: PortalLogosProps) => JSX.Element;

declare const DXNavigationHeader2: (props: any) => JSX.Element;

interface MobileNavigationProps extends NavigationProps$1 {
    headerHeight?: string;
    icons?: {
        search?: string;
        navigationFoward?: string;
        navigationBack?: string;
        close?: string;
        menu?: string;
    };
}
declare const DXNavigationHeaderMobile: (props: MobileNavigationProps) => JSX.Element;

interface NavigationProps {
    navigationImage: NavigationImageProps;
    navigationItems: NavigationItem$2[];
    active?: number;
    globalLinks?: LinksProps[];
    menuImage?: string;
    utilities?: UtilitiesProps;
    icons?: {
        firstLevel?: string;
        secondLevel?: string;
        search?: string;
        close?: string;
    };
}
interface UtilitiesProps {
    searchSubmit: (searchValue: string) => void;
    buttonSubmit?: FormEventHandler;
    buttonText?: string;
    searchPlaceholder?: string;
    iconSubmit?: FormEventHandler;
    iconName?: string;
}
interface NavigationImageProps {
    imageUrl: string;
    imageAlt?: string;
    imageHeight?: number;
    imageWidth?: number;
    sizeLarge?: boolean;
}
declare const DXNavigationHeaderWithUtilities: (props: NavigationProps) => JSX.Element;

interface NewsCardProps extends BasicComponent, CardComponent {
    link: LinksProps;
    date: string;
    image?: ImageProps;
    dateFormat?: string;
    contentType?: string;
    contentPosition?: "connected" | "split";
    layout?: "top" | "left";
}
declare const DXNewsCard: (props: NewsCardProps) => JSX.Element;

interface NewsCardCatalogProps extends BasicComponent {
    items: NewsCardProps[];
    totalItems: number;
    filterType: string;
    paginationProps: {
        sets: string[];
        active: number;
        activeSet: number;
    };
    searchLabel?: string;
    searchPlaceholder?: string;
    hideFilters?: boolean;
    dateFormat?: string;
    elementsPerRow?: number;
}
declare const DXNewsCardCatalog: (props: NewsCardCatalogProps) => JSX.Element;

interface SocialCardProps extends CardComponent {
    title: LinksProps;
    authorText: string;
    likes?: NumericButtonProps;
    comments?: NumericButtonProps;
    body?: string;
    image?: ImageProps;
    sticker?: ImageProps;
    type?: "primary" | "medium" | "small";
    icons?: {
        user?: string;
        comments?: string;
        likes?: string;
    };
}
declare const DXSocialCard: (props: SocialCardProps) => JSX.Element;

interface NewsFeedProps {
    title: string;
    filterCategories: string[];
    items: (NFSocialCardProps | NFFullImageCard)[];
    allButtonText?: string;
}
interface NFSocialCardProps extends SocialCardProps {
    categories: string[];
    size?: number;
}
interface NFFullImageCard extends FullImageCardProps {
    categories: string[];
    size?: number;
    height?: "regular" | "small";
}
declare const DXNewsFeed: (props: NewsFeedProps) => JSX.Element;

interface NewsRollProps {
    newsRollItems: NewsRollItem[];
    icons?: {
        link?: string;
    };
}
interface NewsRollItem extends LinksProps {
    primaryImage: ImageProps;
    secondaryImage?: ImageProps;
}
declare const DXNewsRoll: (props: NewsRollProps) => JSX.Element;

interface NewsletterProps {
    heading: string;
    headingColor?: string;
    type?: NewsletterType;
    inputPlaceholder?: string;
    maxLength?: number;
    button?: IconButtonProps;
    link?: LinksProps;
    background?: BackgroundProps;
}
interface BackgroundProps {
    color?: string;
    image?: string;
    size?: string;
    repeat?: string;
    position?: string;
}
declare type NewsletterType = "message" | "email" | "link";
declare const DXNewsletterBanner: (props: NewsletterProps) => JSX.Element;

interface OnPageBannerProps {
    title: string;
    subtitle: string;
    height?: string;
    imageProps: PageBannerImagePops;
    breadcrumb?: string | LinksProps[];
    icons?: {
        breadcrumb?: string;
    };
    button?: InteractiveButtonProps;
    bodyClass?: string;
}
interface PageBannerImagePops {
    image: string;
    objectFit?: string;
    imageAlt?: string;
    gradientSize?: string;
}
declare const DXOnPageBanner: (props: OnPageBannerProps) => JSX.Element;

interface OnboardingProps {
    steps: OnboardingStep[];
    nextLabel?: string;
    prevLabel?: string;
    doneLabel?: string;
    showBullets?: boolean;
    exitOnEsc?: boolean;
    exitOnOverlayClick?: boolean;
    onComplete?: () => void;
}
interface OnboardingStep extends Step {
    onNextClick?: () => void;
}
declare class DXOnboarding extends Component<OnboardingProps> {
    myIntro: IntroJs;
    introJs: any;
    constructor(props: OnboardingProps);
    render(): JSX.Element;
    componentDidMount(): void;
    onExit: () => void;
    onBeforeChange: (nextIndex: number | undefined) => Promise<void>;
}

interface OrgChartProps {
    users: ChartCardProps[];
    icons?: {
        button?: string;
    };
}
declare const DXOrgChart: (props: OrgChartProps) => JSX.Element;

interface OrgChartBottomUpProps {
    users: ChartCardProps;
}
declare const DXOrgChartBottomUp: (props: OrgChartBottomUpProps) => JSX.Element;

interface PaginationProps {
    sets: string[];
    onChangeSet: Function;
    onChangeActive: Function;
    totalPages: number;
    totalItems: number;
    active: number;
    activeSet: number;
}
declare const DXPagination: (props: PaginationProps) => JSX.Element;

interface ParallaxContentBlockProps {
    items: ContentBlock[];
}
interface ContentBlock {
    image: ImageProps;
    title: string;
    richText: string;
    secondaryParagraph?: string;
    video?: string;
    link?: LinksProps;
}
declare const DXParallaxContentBlock: (props: ParallaxContentBlockProps) => JSX.Element;

interface ParallaxNavigationProps {
    position?: "right" | "left";
    items: LinkWithIcon[];
}
interface LinkWithIcon {
    icon: string;
    link: LinksProps;
}
declare const DXParallaxNavigation: (props: ParallaxNavigationProps) => JSX.Element;

interface PieProps {
    index: number;
    data: ChartItem[];
    valueDecimals?: number;
    showNominal?: boolean;
    prefix?: string;
    suffix?: string;
}
declare const DXPieChart: (props: PieProps) => JSX.Element;

interface PortalAlertsProps {
    type: ("success" | "warning" | "error" | "general");
    iconClass?: string;
    title: string;
    link: LinksProps;
    hideLink?: boolean;
}
declare const DXPortalAlerts: (props: PortalAlertsProps) => JSX.Element;

interface PrivacyFilterProps {
    selectors: string[];
    isActive?: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
    icons?: {
        show?: string;
        hide?: string;
    };
}
declare const DXPrivacyFilter: (props: PrivacyFilterProps) => JSX.Element;

interface ProductSliderProps {
    icons?: {
        scroll?: string;
    };
    items: ProductSliderItem[];
}
interface ProductSliderItem {
    title: string;
    image: ImageProps;
    category?: string;
    body?: string;
    button?: IconButtonProps;
}
declare const DXProductSlider: (props: ProductSliderProps) => JSX.Element;

interface SocialMedia {
    display?: boolean;
    url: string;
    target: string;
}
interface SocialPresenceProps {
    title?: string;
    size?: "big" | "small";
    light?: boolean;
    socialMediaLinks: {
        facebook?: SocialMedia;
        linkedin?: SocialMedia;
        twitter?: SocialMedia;
        instagram?: SocialMedia;
    };
}
declare const DXSocialPresence: (props: SocialPresenceProps) => JSX.Element;

interface ProfileCardProps extends CardComponent {
    name: string;
    image?: ImageProps;
    socialMedia?: SocialPresenceProps;
}
declare const DXProfileCard: (props: ProfileCardProps) => JSX.Element;

interface ProfileInfoProps {
    image?: ImageProps;
    fullName: string;
    jobTitle?: string;
    department?: string;
    location?: string;
    office?: string;
    email?: LinksProps;
    phone?: LinksProps;
    primaryButton?: IconButtonProps;
    secondaryButton?: LinksProps;
    address: string;
    socialPresence?: SocialPresenceProps;
    icons?: {
        toggle?: string;
        edit?: string;
    };
    optionalButtons?: IconButtonProps[];
    iframeUrl?: string;
    editAction?: Function;
    enableCollapsed?: boolean;
}
declare const DXProfileInfo: (props: ProfileInfoProps) => JSX.Element;

interface ProjectCardProps extends CardComponent {
    name: string;
    img?: ImageProps;
    symbol?: string;
    tags: string[];
    manager: {
        img?: string;
        name: string;
        profileLink: string;
    };
    members: {
        name: string;
        img?: string;
    }[];
    action: IconButtonProps;
    icons?: StateIcons;
}
declare const DXProjectCard: (props: ProjectCardProps) => JSX.Element;

interface DXQuestionsTabsProps {
    title: string;
    seeOtherLink: LinksProps;
    questionDetailLinkText?: string;
    sections: DXQuestionsTabsSection[];
    icons?: {
        close?: string;
        link?: string;
    };
}
interface DXQuestionsTabsSection {
    title: string;
    iconName?: string;
    questions: DXQuestionsTabsQuestion[];
}
interface DXQuestionsTabsQuestion {
    question: string;
    answer: string;
    questionDetailLink: string;
    target?: string;
}
declare const DXQuestionsTabs: (props: DXQuestionsTabsProps) => JSX.Element;

interface QuoteProps {
    index: number;
    body: string;
    thumbnail?: ImageProps;
    authorName?: string;
    hideQuotes?: boolean;
    paddingDesktop?: string;
    paddingMobile?: string;
    icons?: {
        quoteOpen?: string;
        quoteClose?: string;
    };
}
declare const DXQuote: (props: QuoteProps) => JSX.Element;

interface RiverOfContentProps {
    index: number;
    header: string;
    links: LinksProps[];
    viewAllLink: {
        url: string;
        label?: string;
    };
    headerCharLimit?: number;
    itemCharLimit?: number;
    collapsible?: boolean;
    icons?: {
        link?: string;
    };
}
declare const DXRiverOfContent: (props: RiverOfContentProps) => JSX.Element;

interface RiverOfNewsProps extends BasicComponent {
    title: string;
    riverOfNews: NewsCardProps[];
    allDateFormat?: string;
    viewAllLink: LinksProps;
}
declare const DXRiverOfNewsClassic: (props: RiverOfNewsProps) => JSX.Element;

interface ScrollableCardProps {
    items: CardInfo[];
    icons?: SliderIcons;
}
interface CardInfo {
    title: string;
    image?: string;
    subtitle?: string;
    links?: LinksProps[];
    hideImage?: boolean;
    [x: string]: any;
}
declare const DXScrollableCard: (props: ScrollableCardProps) => JSX.Element;

interface DXSearchAndQuestionsProps {
    backgroundImage?: string;
    backgroundColor?: string;
    sqBackgroundColor?: string;
    sqBackgroundOpacity?: number;
    questionsTabs: DXQuestionsTabsProps;
    searchSuggestions: SSuggestionsProps;
}
declare const DXSearchAndQuestions: (props: DXSearchAndQuestionsProps) => JSX.Element;

interface StraightCardProps extends CardComponent {
    title: LinksProps;
    date?: string;
    tags?: TagProps[];
    dateFormat?: string;
    breadcrumb?: string | LinksProps[];
    subtitle?: string;
    showLink?: boolean;
    showChevron?: boolean;
    icons?: {
        breadcrumb?: string;
        link?: string;
    };
}
declare const DXStraightCard: (props: StraightCardProps) => JSX.Element;

interface SearchResultsCatalogProps {
    items: StraightCardProps[];
    paginationProps?: {
        sets: string[];
        active: number;
        activeSet: number;
    };
    elementsPerRow?: number;
}
declare const DXSearchResultsCatalog: (props: SearchResultsCatalogProps) => JSX.Element;

interface SidebarMenuProps {
    title: string;
    cardButtons?: CardButtonProps[];
    card?: CardProps;
}
declare const DXSidebarMenu: (props: SidebarMenuProps) => JSX.Element;

interface Item {
    id: string;
    label: string;
    children?: Item[];
}
interface TableProps {
    title: string;
    items: Item[];
    firstLevelStyle?: string;
    secondLevelStyle?: string;
    thirdLevelStyle?: string;
}
declare const DXTableOfContents: (props: TableProps) => JSX.Element;

interface TaxFilterProps {
    type: string;
    label?: string;
    values: string[];
    attribute: string;
}
interface TaxonomyFilterProps {
    totalItems: number;
    filters: TaxFilterProps[];
    filteredCount: number;
    filterItems: Function;
    searchLabel?: string;
    searchPlaceholder?: string;
    hideSearch?: boolean;
    icons?: {
        filter?: string;
        filterClose?: string;
    };
}
declare const DXTaxonomyFilter: (props: TaxonomyFilterProps) => JSX.Element;

interface TextBreakProps {
    title: String;
    subtitle?: String;
    button?: IconButtonProps;
    align?: string;
    background: {
        color: string;
        image?: string;
    };
    textColor?: string;
}
declare const DXTextBreak: (props: TextBreakProps) => JSX.Element;

interface TickerProps {
    items: TickerItem[];
    currencySymbol?: string;
    empty?: EmptyStateProps;
    icons?: {
        up?: string;
        down?: string;
        link?: string;
    };
}
interface TickerItem {
    name: string;
    broker: string;
    price: number;
    percentage: number;
    dateTime?: string;
    link: LinksProps;
}
declare const DXTicker: (props: TickerProps) => JSX.Element;

interface TickerMenuProps extends TickerProps {
    animationTime?: number;
}
declare const DXTickerMenu: (props: TickerMenuProps) => JSX.Element;

interface ButtonProps {
    label: string;
    disabled?: boolean;
    displayType?: ButtonHTMLAttributes<HTMLButtonElement> | any;
    handleClick?: Function;
}
interface ToggleMenuProps {
    buttons: ButtonProps[];
    vertical?: boolean;
    type?: 'single' | 'multi';
    activeIndexes?: number[];
}
declare const DXToggleMenu: (props: ToggleMenuProps) => JSX.Element;

interface TreeMapProps {
    index: number;
    data: TreeMapChartItem;
    hideFilters?: boolean;
}
declare const DXTreeMap: (props: TreeMapProps) => JSX.Element;

interface TwitterFeedProps {
    title?: string;
    description?: string;
    type: "profile" | "tweet" | "list";
    url: string;
    options?: any;
}
declare const DXTwitterFeed: (props: TwitterFeedProps) => JSX.Element;

interface BeltIcon {
    button: {
        iconClass?: string;
        label: string;
        onClick: Function;
    };
    title?: string;
}
interface UtilityBeltProps {
    items: BeltIcon[];
    textVariant?: boolean;
    align?: ("left" | "center" | "right");
    displayType?: ("primary" | "secondary" | "unstyled");
}
declare const DXUtilityBelt: (props: UtilityBeltProps) => JSX.Element;

interface UserDashboardProps {
    image?: ImageProps;
    title: string;
    subtitle: string;
    metadata: string;
    utilityBelt?: UtilityBeltProps;
    vertical?: boolean;
    hideImage?: boolean;
    align?: ("left" | "center" | "right");
}
declare const DXUserDashboard: (props: UserDashboardProps) => JSX.Element;

interface VideoProps {
    playlist: string;
    apiKey: string;
    service: 'vimeo' | 'youtube';
    layout?: 'vertical' | 'horizontal' | undefined;
    link: LinksProps;
}
declare const DXVideo: (props: VideoProps) => JSX.Element;

interface Event {
    info: LinksProps;
    date: string;
}
interface WeeklyCalendarProps {
    fullCalendarLink: string;
    events: Event[];
    icons?: SliderIcons;
}
declare const DXWeeklyCalendar: (props: WeeklyCalendarProps) => JSX.Element;

export { Button, ButtonLinkProps, ButtonMouseHandler, ButtonProps$3 as ButtonProps, Chart, ChartItem, DXAccordion, DXAccordionCatalog, DXAd, DXAds, DXAppCard, DXBannerStripe, DXButton, DXCalendar, DXCard, DXCardButton, DXCardButtonCatalog, DXCarousel, DXCaseCard, DXCasesCatalog, DXCatalog, DXChartCard, DXCountdownFloater, DXDashboardCard, DXDashboardContainer, DXDataTable, DXDirectory, DXDirectoryCard, DXDownloadCard, DXDownloadGroup, DXDrawerMenu, DXEvent, DXEventCatalog, DXEventDetails, DXEventItem, DXEventTabs, DXExpensesCard, DXFastAccessMenu, DXFullCalendar, DXFullImageCard, DXFullImageCatalog, DXFullImageMiniCatalog, DXGallery, DXGenericCatalog, DXGenericMiniCatalog, DXGlobalFooter, DXHalfParallax, DXHeroBanner, DXHeroBannerCarousel, DXHeroBannerOverlay, DXHeroBannerPerson, DXHeroBannerStacking, DXInteractiveButton, DXInteractiveTabs, DXJiraTaskCard, DXLinkList, DXLocalFooter, DXMap, DXMegaMenu, DXMenuOrganizer, DXMicrositeNavigation, DXMiniCatalog, DXMobileTabMenuNavigation, DXModalWindows, DXMosaicBanner, DXMosaicButton, DXMyLinksCard, DXMyNextMeeting, DXMySavedLinks, DXNavigationHeader, DXNavigationHeader2, DXNavigationHeaderMobile, DXNavigationHeaderWithUtilities, DXNewsCard, DXNewsCardCatalog, DXNewsFeed, DXNewsRoll, DXNewsletterBanner, DXOnPageBanner, DXOnboarding, DXOrgChart, DXOrgChartBottomUp, DXPagination, DXParallaxContentBlock, DXParallaxNavigation, DXPieChart, DXPortalAlerts, DXPortalLogos, DXPrivacyFilter, DXProductSlider, DXProfileCard, DXProfileInfo, DXProjectCard, DXQuestionsTabs, DXQuickLinks, DXQuote, DXRiverOfContent, DXRiverOfNewsClassic, DXScrollableCard, DXSearchAndQuestions, DXSearchInput, DXSearchResultsCatalog, DXSearchSuggestions, DXSidebarMenu, DXSocialCard, DXSocialPresence, DXSocialShare, DXStraightCard, DXTableOfContents, DXTaxonomyFilter, DXTextBreak, DXTicker, DXTickerMenu, DXToggleMenu, DXToolButton, DXTreeMap, DXTwitterFeed, DXUserDashboard, DXUtilityBelt, DXUtilityZone, DXVerticalNavigation, DXVideo, DXWeeklyCalendar, DateValues, GalleryImageProps, IconButtonProps, ImageProps, LinkIconProps, LinksProps, NavigationItemProps, PieChart, PieChartItem, SliderIcons, StateIcons, TagProps, clickOutsideAlerter, disableOverlay, generateLinkAnchor, generateLinkIcon, getColNumber, getFullMonth, getIcon, getLinkIcon, getLinkTarget, getMomentDayShort, getMonthPrefix, getValuesFromDateFormat, getVideoFormat, overflowText, parseContent, parseContentAndMedia, parseHTML, parseLinks, purifyAndParseHTML, purifyHTML, renderAvatarLetters, renderAvatarProjectMembers, renderOverlayElement };
