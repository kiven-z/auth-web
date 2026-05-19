import type { MenuForm, MenuSaveRequest, SysMenuDetailVO } from '@/api/system/menu';
import { MenuTypeEnums } from '@/views/system/menu/constants/menuEnums';

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
 * 规范化父级 ID：空串视为 null，与后端 Long 可空对齐。
 */
function normalizeParentId(v: string | null | undefined): string | null {
  if (v === undefined || v === null || v === '') {
    return null;
  }
  return String(v);
}

/**
 * 表单 → 保存请求体（数值字段强制为 JSON 数字，ID 为字符串以兼容雪花精度）
 */
export function formToSaveRequest(f: MenuForm): MenuSaveRequest {
  const rawType = f.menuType ?? MenuTypeEnums.MENU;
  const menuType = typeof rawType === 'string' ? Number.parseInt(rawType, 10) : Number(rawType);
  const rankRaw = f.menuRank ?? 0;
  const menuRank = typeof rankRaw === 'string' ? Number.parseInt(rankRaw, 10) : Number(rankRaw);
  const safeMenuType = Number.isFinite(menuType) ? menuType : MenuTypeEnums.MENU;
  const safeMenuRank = Number.isFinite(menuRank) ? Math.trunc(menuRank) : 0;

  return {
    id: f.id !== undefined && f.id !== null && String(f.id) !== '' ? String(f.id) : undefined,
    parentId: normalizeParentId(f.parentId ?? undefined),
    menuType: safeMenuType,
    path: f.path,
    name: (f.name ?? '').trim(),
    redirect: f.redirect,
    component: f.component,
    title: (f.title ?? '').trim(),
    icon: f.icon,
    showLink: boolToFlag(f.showLink, true),
    menuRank: safeMenuRank,
    extraIcon: f.extraIcon,
    showParent: boolToFlag(f.showParent, true),
    keepAlive: boolToFlag(f.keepAlive, false),
    frameSrc: f.frameSrc,
    frameLoading: boolToFlag(f.frameLoading, true),
    transitionName: f.transitionName,
    enterTransition: f.enterTransition,
    leaveTransition: f.leaveTransition,
    hiddenTag: boolToFlag(f.hiddenTag, false),
    dynamicLevel: (() => {
      if (f.dynamicLevel === undefined || f.dynamicLevel === null) {
        return undefined;
      }
      const n = typeof f.dynamicLevel === 'string' ? Number.parseInt(f.dynamicLevel, 10) : Number(f.dynamicLevel);
      return Number.isFinite(n) ? Math.trunc(n) : undefined;
    })(),
    activePath: f.activePath,
    fixedTag: boolToFlag(f.fixedTag, false),
    status: boolToStatus(f.status),
    remark: f.remark,
  };
}
