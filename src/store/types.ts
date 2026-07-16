import type { RouteRecordName } from 'vue-router';

/** 标签页缓存模式 */
export interface cacheType {
  mode: string;
  name?: RouteRecordName;
}

/** 标签页滚动位置 */
export interface positionType {
  startIndex?: number;
  length?: number;
}

/** 应用布局状态 */
export interface appType {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    /** 是否由用户手动点击折叠侧边栏 */
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
  viewportSize: { width: number; height: number };
}

/** 多标签页路由项 */
export interface multiType {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
}

/** 系统设置项 */
export interface setType {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
}

/** 当前登录用户状态 */
export interface userType {
  avatar?: string;
  username?: string;
  nickname?: string;
  /** 用户 ID（Long 字符串化） */
  userId?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  isRemembered?: boolean;
  loginDay?: number;
}
