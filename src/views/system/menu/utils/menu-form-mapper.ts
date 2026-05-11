import type { SysMenuDetailVO } from '@/api/system/menu';
import { MenuTypeEnums } from '@/enums/menuEnums';
import type { MenuForm, MenuSaveRequest } from '@/types/system';

/** Boolean → boolean（展示用，后端 true=是） */
export function oneAsTrue(v: boolean | undefined | null): boolean {
  return v ?? false;
}

/** boolean → Boolean（后端 Boolean 类型，true=是） */
export function boolToFlag(b: boolean | undefined, defaultTrue = false): boolean {
  return b ?? defaultTrue;
}

/** 后端 Boolean status (true=启用) → UI boolean */
export function statusToBool(status: boolean | undefined | null): boolean {
  return status ?? true;
}

/** UI boolean → 后端 Boolean (true=启用) */
export function boolToStatus(b: boolean | undefined): boolean {
  return b ?? true;
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
    menuType: MenuTypeEnums.MENU,
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
  const menuType = f.menuType ?? MenuTypeEnums.MENU;
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
