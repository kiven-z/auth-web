import { addDrawer } from '@/components/ui/Drawer';
import UserAuthorizationSurfaceDrawer from '@/views/system/user/workstation/panels/authorization/UserAuthorizationSurfaceDrawer.vue';
import { useI18n } from 'vue-i18n';

/** 打开用户授权面抽屉入参 */
export interface OpenUserAuthorizationSurfaceOptions {
  userId: string;
  /** 展示用用户名（拼进标题） */
  username?: string | null;
}

/**
 * 打开用户授权面抽屉（关系分页查询 + 刷新画像）
 * @returns 打开方法
 */
function useOpenUserAuthorizationSurface() {
  const { t } = useI18n();

  /**
   * 打开指定用户的授权面
   * @param options 用户标识与展示名
   */
  function openUserAuthorizationSurface(options: OpenUserAuthorizationSurfaceOptions) {
    const titleSuffix = options.username ? ` · ${options.username}` : '';
    addDrawer({
      title: `${t('users.authorizationSurface.title')}${titleSuffix}`,
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => <UserAuthorizationSurfaceDrawer userId={options.userId} />,
    });
  }

  return { openUserAuthorizationSurface };
}

export default useOpenUserAuthorizationSurface;
