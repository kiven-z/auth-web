import type { FunctionalComponent } from 'vue';

const { VITE_HIDE_HOME } = import.meta.env;

export const routerArrays: Array<RouteConfigs> =
  VITE_HIDE_HOME === 'false'
    ? [
        {
          path: '/welcome',
          name: 'Welcome',
          meta: {
            title: 'menus.home',
            icon: 'ep/home-filled',
          },
        },
      ]
    : [];

/** 路由 meta 扩展字段 */
export interface routeMetaType {
  title?: string;
  icon?: string | FunctionalComponent;
  showLink?: boolean;
  savedPosition?: boolean;
}

/** 路由配置（菜单 / 标签页） */
export interface RouteConfigs {
  path?: string;
  query?: object;
  params?: object;
  meta?: routeMetaType;
  children?: RouteConfigs[];
  name?: string;
}

/** 多标签页集合 */
export interface multiTagsType {
  tags: Array<RouteConfigs>;
}

/** 标签页右键菜单项 */
export interface tagsViewsType {
  icon: string | FunctionalComponent;
  text: string;
  divided: boolean;
  disabled: boolean;
  show: boolean;
}

/** 布局设置状态 */
export interface setType {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    isClickCollapse: boolean;
  };
  device: string;
  fixedHeader: boolean;
  classes: {
    hideSidebar: boolean;
    openSidebar: boolean;
    withoutAnimation: boolean;
    mobile: boolean;
  };
  hideTabs: boolean;
}

/** 侧边栏菜单节点 */
export interface menuType {
  id?: number;
  name?: string;
  path?: string;
  noShowingChildren?: boolean;
  children?: menuType[];
  value: unknown;
  meta?: {
    icon?: string;
    title?: string;
    rank?: number;
    showParent?: boolean;
    extraIcon?: string;
  };
  showTooltip?: boolean;
  parentId?: number;
  pathList?: number[];
  redirect?: string;
}

/** 主题色配置 */
export interface themeColorsType {
  color: string;
  themeColor: string;
}

/** 带 wrap 的滚动条 DOM */
export interface scrollbarDomType extends HTMLElement {
  wrap?: {
    offsetWidth: number;
  };
}
