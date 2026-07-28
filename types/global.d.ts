/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */
declare global {
  /**
   * 表格列定义（AuthDataTable、TableBar 列配置共用）
   */
  interface TableColumns {
    type?: 'selection' | 'index' | 'expand';
    label?: string;
    prop?: string;
    width?: number | string;
    minWidth?: number | string;
    fixed?: boolean | 'left' | 'right';
    align?: 'left' | 'center' | 'right';
    headerAlign?: 'left' | 'center' | 'right';
    hide?: boolean | ((row?: unknown) => boolean);
    showOverflowTooltip?: boolean | Record<string, unknown>;
    formatter?: (row: any, column?: any, cellValue?: any, index?: number) => unknown;
    cellRenderer?: (params: Record<string, unknown>) => unknown;
    slot?: string;
    index?: (index: number) => number;
    children?: TableColumns[];
    [key: string]: unknown;
  }

  type TableColumnList = TableColumns[];

  /**
   * Window 的类型提示
   */
  interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  /**
   * Document 的类型提示
   */
  interface Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
  }

  /**
   * 打包压缩格式的类型声明
   */
  type ViteCompression = 'none' | 'gzip' | 'brotli' | 'both' | 'gzip-clear' | 'brotli-clear' | 'both-clear';

  /**
   * 全局自定义环境变量的类型声明
   */
  interface ViteEnv {
    VITE_PORT: number;
    VITE_PUBLIC_PATH: string;
    VITE_ROUTER_HISTORY: string;
    VITE_PROXY_TARGET: string;
    VITE_CDN: boolean;
    VITE_HIDE_HOME: string;
    VITE_COMPRESSION: ViteCompression;
  }

  /**
   * 对应 `public/platform-config.json` 文件的类型声明
   */
  interface PlatformConfigs {
    Version?: string;
    Title?: string;
    FixedHeader?: boolean;
    HiddenSideBar?: boolean;
    MultiTagsCache?: boolean;
    MaxTagsLevel?: number;
    KeepAlive?: boolean;
    Locale?: string;
    Layout?: string;
    Theme?: string;
    DarkMode?: boolean;
    OverallStyle?: string;
    Grey?: boolean;
    Weak?: boolean;
    HideTabs?: boolean;
    HideFooter?: boolean;
    Stretch?: boolean | number;
    SidebarStatus?: boolean;
    EpThemeColor?: string;
    ShowLogo?: boolean;
    ShowModel?: string;
    MenuArrowIconNoTransition?: boolean;
    CachingAsyncRoutes?: boolean;
    TooltipEffect?: Effect;
    ResponsiveStorageNameSpace?: string;
    MenuSearchHistory?: number;
  }

  /**
   * 与 `PlatformConfigs` 类型不同，这里是缓存到浏览器本地存储的类型声明
   */
  interface StorageConfigs {
    version?: string;
    title?: string;
    fixedHeader?: boolean;
    hiddenSideBar?: boolean;
    multiTagsCache?: boolean;
    keepAlive?: boolean;
    locale?: string;
    layout?: string;
    theme?: string;
    darkMode?: boolean;
    grey?: boolean;
    weak?: boolean;
    hideTabs?: boolean;
    hideFooter?: boolean;
    sidebarStatus?: boolean;
    epThemeColor?: string;
    themeColor?: string;
    overallStyle?: string;
    showLogo?: boolean;
    showModel?: string;
    menuSearchHistory?: number;
    username?: string;
  }

  /**
   * `responsive-storage` 本地响应式 `storage` 的类型声明
   */
  interface ResponsiveStorage {
    locale: {
      locale?: string;
    };
    layout: {
      layout?: string;
      theme?: string;
      darkMode?: boolean;
      sidebarStatus?: boolean;
      epThemeColor?: string;
      themeColor?: string;
      overallStyle?: string;
    };
    configure: {
      grey?: boolean;
      weak?: boolean;
      hideTabs?: boolean;
      hideFooter?: boolean;
      showLogo?: boolean;
      showModel?: string;
      multiTagsCache?: boolean;
      stretch?: boolean | number;
    };
    tags?: Array<any>;
  }

  /**
   * 扩展 `Element`
   */
  interface Element {
    // v-ripple 作用于 src/app/directives/ripple/index.ts 文件
    _ripple?: {
      enabled?: boolean;
      centered?: boolean;
      class?: string;
      circle?: boolean;
      touched?: boolean;
    };
  }
}

export {};
