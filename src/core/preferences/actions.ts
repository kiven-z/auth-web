import { getConfig } from '@/auth/config';
import { patchLayout } from './storage';
import { useAppStoreHook } from '@/store/modules/app/app';
import { useMultiTagsStoreHook } from '@/store/modules/app/multiTags';
import { useUserStoreHook } from '@/store/modules/auth/user';
import { storageLocal, toggleClass } from '@pureadmin/utils';
import { applyThemePreferences } from './apply';

/** 侧栏展开状态写入选项 */
export interface SetSidebarOpenedOptions {
  withoutAnimation?: boolean;
  resize?: string;
}

/**
 * 更新侧栏展开状态；用户操作会持久化，视口 resize 仅改运行时 store
 * @param opened 是否展开；省略时切换当前状态
 * @param options withoutAnimation、resize 与 store 行为一致
 */
export function setSidebarOpened(opened?: boolean, options?: SetSidebarOpenedOptions): void {
  const resize = options?.resize;
  const appStore = useAppStoreHook();

  // 视口断点适配：只改运行时侧栏，不写入偏好、不同步服务端
  if (resize) {
    appStore.sidebar.withoutAnimation = true;
    appStore.sidebar.opened = Boolean(opened);
    return;
  }

  // 未传参：用户点击切换
  if (opened === undefined) {
    appStore.sidebar.withoutAnimation = false;
    appStore.sidebar.opened = !appStore.sidebar.opened;
    appStore.sidebar.isClickCollapse = !appStore.sidebar.opened;
    patchLayout({ sidebarStatus: appStore.sidebar.opened });
    return;
  }

  // 显式 true / false：直接设置并持久化
  appStore.sidebar.opened = opened;
  patchLayout({ sidebarStatus: opened });
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
