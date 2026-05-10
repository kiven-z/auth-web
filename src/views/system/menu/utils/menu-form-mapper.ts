import type { SysMenuDetailVO } from '@/api/system/menu';
import { MenuTypeEnums } from '@/enums/menuEnums';
import type { MenuForm, MenuSaveRequest } from '@/types/system';

/** 0/1 → boolean（展示用） */
export function oneAsTrue(v: number | undefined | null): boolean {
  return v === 1;
}

/** boolean → 0/1 */
export function boolToFlag(b: boolean | undefined, defaultTrue = false): number {
  if (b === undefined) {
    return defaultTrue ? 1 : 0;
  }
  return b ? 1 : 0;
}

/** 后端 status：0 启用 → UI true */
export function statusToBool(status: number | undefined | null): boolean {
  return status === 0;
}

/** UI true=启用 → 后端 0 */
export function boolToStatus(b: boolean | undefined): number {
  return b === false ? 1 : 0;
}

/**
 * 详情 → 表单（UI 布尔与数字分离）
 */
export function detailToForm(d: SysMenuDetailVO): MenuForm {
  return {
    id: d.id,
    parentId: d.parentId,
    menuType: d.menuType as MenuForm['menuType'],
    path: d.path,
    name: d.name,
    redirect: d.redirect,
    component: d.component,
    title: d.title,
    icon: d.icon,
    showLink: oneAsTrue(d.showLink),
    menuRank: d.menuRank,
    extraIcon: d.extraIcon,
    showParent: oneAsTrue(d.showParent),
    keepAlive: oneAsTrue(d.keepAlive),
    frameSrc: d.frameSrc,
    frameLoading: oneAsTrue(d.frameLoading),
    transitionName: d.transitionName,
    enterTransition: d.enterTransition,
    leaveTransition: d.leaveTransition,
    hiddenTag: oneAsTrue(d.hiddenTag),
    dynamicLevel: d.dynamicLevel,
    activePath: d.activePath,
    fixedTag: oneAsTrue(d.fixedTag),
    status: statusToBool(d.status),
    remark: d.remark,
  };
}

/**
 * 新建默认表单
 */
export function createEmptyMenuForm(): MenuForm {
  return {
    parentId: null,
    menuType: MenuTypeEnums.菜单,
    path: '',
    name: '',
    title: '',
    menuRank: 0,
    showLink: true,
    showParent: true,
    keepAlive: false,
    status: true,
    hiddenTag: false,
    fixedTag: false,
    frameLoading: true,
    dynamicLevel: 1,
  };
}

/**
 * 表单 → 保存请求体
 */
export function formToSaveRequest(f: MenuForm): MenuSaveRequest {
  const menuType = f.menuType ?? MenuTypeEnums.菜单;
  return {
    id: f.id,
    parentId: f.parentId ?? null,
    menuType,
    path: f.path,
    name: (f.name ?? '').trim(),
    redirect: f.redirect,
    component: f.component,
    title: (f.title ?? '').trim(),
    icon: f.icon,
    showLink: boolToFlag(f.showLink, true),
    menuRank: f.menuRank ?? 0,
    extraIcon: f.extraIcon,
    showParent: boolToFlag(f.showParent, true),
    keepAlive: boolToFlag(f.keepAlive, false),
    frameSrc: f.frameSrc,
    frameLoading: boolToFlag(f.frameLoading, true),
    transitionName: f.transitionName,
    enterTransition: f.enterTransition,
    leaveTransition: f.leaveTransition,
    hiddenTag: boolToFlag(f.hiddenTag, false),
    dynamicLevel: f.dynamicLevel,
    activePath: f.activePath,
    fixedTag: boolToFlag(f.fixedTag, false),
    status: boolToStatus(f.status),
    remark: f.remark,
  };
}
