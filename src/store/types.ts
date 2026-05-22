import type { RouteRecordName } from 'vue-router';

export interface cacheType {
  mode: string;
  name?: RouteRecordName;
}

export interface positionType {
  startIndex?: number;
  length?: number;
}

export interface appType {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
  viewportSize: { width: number; height: number };
}

export interface multiType {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
}

export interface setType {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
}

export interface userType {
  avatar?: string;
  username?: string;
  nickname?: string;
  // 与后端用户主键一致（字符串化 Long）
  userId?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
  isRemembered?: boolean;
  loginDay?: number;
}
