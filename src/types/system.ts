/**
 * 系统模块表单类型（菜单等）
 */
import type { MenuTypeValue } from '@/enums/menuEnums';

/** 菜单弹窗/编辑表单（与 MenuDialog 字段对齐；部分字段 UI 用 boolean，提交前经 mapper 转 0/1） */
export interface MenuForm {
  id?: string;
  parentId?: string | null;
  /** 菜单类型 0/1/2 */
  menuType?: MenuTypeValue;
  path?: string;
  name?: string;
  redirect?: string;
  component?: string;
  /** 标题（可为 i18n key 或展示文案） */
  title?: string;
  icon?: string;
  /** UI: boolean；提交映射 show_link 0/1 */
  showLink?: boolean;
  menuRank?: number;
  extraIcon?: string;
  showParent?: boolean;
  /** 页面级角色（若后端仍支持内联字段；主流程在分配抽屉） */
  roles?: string[];
  auths?: string[];
  keepAlive?: boolean;
  frameSrc?: string;
  /** iframe 首次加载动画 0/1，UI boolean */
  frameLoading?: boolean;
  transitionName?: string;
  enterTransition?: string;
  leaveTransition?: string;
  hiddenTag?: boolean;
  dynamicLevel?: number;
  activePath?: string;
  fixedTag?: boolean;
  /** UI: boolean；提交映射 status 0/1 */
  status?: boolean;
  meta?: Record<string, unknown>;
  remark?: string;
}

/** 创建/更新请求体（camelCase，与后端约定对齐） */
export interface MenuSaveRequest {
  id?: string;
  parentId?: string | null;
  menuType: number;
  path?: string;
  name: string;
  redirect?: string;
  component?: string;
  title: string;
  icon?: string;
  showLink: number;
  menuRank: number;
  extraIcon?: string;
  showParent?: number;
  keepAlive: number;
  frameSrc?: string;
  frameLoading?: number;
  transitionName?: string;
  enterTransition?: string;
  leaveTransition?: string;
  hiddenTag?: number;
  dynamicLevel?: number;
  activePath?: string;
  fixedTag?: number;
  status: number;
  remark?: string;
}
