import type { MenuForm, MenuSaveRequest, SysMenuDetailVO } from '@/api/system/menu';
import { MenuTypeEnums } from '@/views/system/menu/constants/menu-type';

/**
 * 详情 → 表单
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
    showLink: d.showLink ?? false,
    menuRank: d.menuRank,
    extraIcon: d.extraIcon,
    showParent: d.showParent ?? false,
    keepAlive: d.keepAlive ?? false,
    frameSrc: d.frameSrc,
    frameLoading: d.frameLoading ?? false,
    transitionName: d.transitionName,
    enterTransition: d.enterTransition,
    leaveTransition: d.leaveTransition,
    hiddenTag: d.hiddenTag ?? false,
    dynamicLevel: d.dynamicLevel,
    activePath: d.activePath,
    fixedTag: d.fixedTag ?? false,
    status: d.status ?? true,
    remark: d.remark,
  };
}

/**
 * 规范化父级 ID：空串视为 null，与后端 Long 可空对齐。
 */
function normalizeParentId(v: string | null | undefined): string | null {
  if (v === undefined || v === null || v === '') {
    return null;
  }
  return v;
}

/**
 * 表单 → 保存请求体（数值字段强制为 JSON 数字）
 */
export function formToSaveRequest(f: MenuForm): MenuSaveRequest {
  const rawType = f.menuType ?? MenuTypeEnums.MENU;
  const menuType = typeof rawType === 'string' ? Number.parseInt(rawType, 10) : Number(rawType);
  const rankRaw = f.menuRank ?? 0;
  const menuRank = typeof rankRaw === 'string' ? Number.parseInt(rankRaw, 10) : Number(rankRaw);
  const safeMenuType = Number.isFinite(menuType) ? menuType : MenuTypeEnums.MENU;
  const safeMenuRank = Number.isFinite(menuRank) ? Math.trunc(menuRank) : 0;

  return {
    id: f.id !== undefined && f.id !== null && f.id !== '' ? f.id : undefined,
    parentId: normalizeParentId(f.parentId ?? undefined),
    menuType: safeMenuType,
    path: f.path,
    name: f.name ?? '',
    redirect: f.redirect,
    component: f.component,
    title: f.title ?? '',
    icon: f.icon,
    showLink: f.showLink ?? true,
    menuRank: safeMenuRank,
    extraIcon: f.extraIcon,
    showParent: f.showParent ?? true,
    keepAlive: f.keepAlive ?? false,
    frameSrc: f.frameSrc,
    frameLoading: f.frameLoading ?? true,
    transitionName: f.transitionName,
    enterTransition: f.enterTransition,
    leaveTransition: f.leaveTransition,
    hiddenTag: f.hiddenTag ?? false,
    dynamicLevel: (() => {
      if (f.dynamicLevel === undefined || f.dynamicLevel === null) {
        return undefined;
      }
      const n = typeof f.dynamicLevel === 'string' ? Number.parseInt(f.dynamicLevel, 10) : Number(f.dynamicLevel);
      return Number.isFinite(n) ? Math.trunc(n) : undefined;
    })(),
    activePath: f.activePath,
    fixedTag: f.fixedTag ?? false,
    status: f.status ?? true,
    remark: f.remark,
  };
}
