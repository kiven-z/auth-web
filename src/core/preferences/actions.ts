import { getConfig } from '@/auth/config';
import { patchLayout } from './storage';
import { useAppStoreHook } from '@/store/modules/app';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { useUserStoreHook } from '@/store/modules/user';
import { storageLocal, toggleClass } from '@pureadmin/utils';
import { applyThemePreferences } from './apply';

/** 侧栏展开状态写入选项 */
export interface SetSidebarOpenedOptions {
  withoutAnimation?: boolean;
  resize?: string;
}

/**
 * 更新侧栏展开状态并持久化（可在 Pinia action 等非 setup 上下文调用）
 * @param opened 是否展开；省略时切换当前状态
 * @param options withoutAnimation、resize 与 store 行为一致
 */
export function setSidebarOpened(opened?: boolean, options?: SetSidebarOpenedOptions): void {
  const resize = options?.resize;
  const appStore = useAppStoreHook();

  if (opened && resize) {
    appStore.sidebar.withoutAnimation = true;
    appStore.sidebar.opened = true;
    patchLayout({ sidebarStatus: true });
  } else if (!opened && resize) {
    appStore.sidebar.withoutAnimation = true;
    appStore.sidebar.opened = false;
    patchLayout({ sidebarStatus: false });
  } else if (!opened && !resize) {
    appStore.sidebar.withoutAnimation = false;
    appStore.sidebar.opened = !appStore.sidebar.opened;
    appStore.sidebar.isClickCollapse = !appStore.sidebar.opened;
    patchLayout({ sidebarStatus: appStore.sidebar.opened });
  } else if (opened !== undefined) {
    appStore.sidebar.opened = opened;
    patchLayout({ sidebarStatus: opened });
  }
}

/**
 * 清空本地 UI 偏好缓存并返回登录（布局偏好全清 + 统一会话清理）
 */
export async function resetUiPreferences(): Promise<void> {
  storageLocal().clear();
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  useAppStoreHook().setLayout(Layout);
  patchLayout({
    layout: Layout,
    epThemeColor: EpThemeColor,
    theme: getConfig().Theme ?? 'light',
  });
  applyThemePreferences();
  useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
  toggleClass(Grey, 'html-grey', document.querySelector('html'));
  toggleClass(Weak, 'html-weakness', document.querySelector('html'));
  await useUserStoreHook().clearLocalSession();
}
