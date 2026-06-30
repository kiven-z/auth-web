import Avatar from '@/assets/user.jpg';
import { getConfig } from '@/auth/config';
import { transformI18n } from '@/plugins/i18n';
import { remainingPaths, router } from '@/router';
import { getTopMenu } from '@/router/utils/misc';
import { emitter } from '@/services/event-bus/mitt';
import { useAppStoreHook } from '@/store/modules/app';
import { useEpThemeStoreHook } from '@/store/modules/epTheme';
import { usePermissionStoreHook } from '@/store/modules/permission';
import { useUserStoreHook } from '@/store/modules/user';
import { isAllEmpty, useGlobal } from '@pureadmin/utils';
import { useFullscreen } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, type CSSProperties } from 'vue';
import { useRouter } from 'vue-router';
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';
import type { routeMetaType } from '../../types';

const errorInfo = 'The current routing configuration is incorrect, please check the configuration';

export function useNav() {
  const authApp = useAppStoreHook();
  const routers = useRouter().options.routes;
  const { isFullscreen, toggle } = useFullscreen();
  const { wholeMenus } = storeToRefs(usePermissionStoreHook());
  /** 平台`layout`中所有`el-tooltip`的`effect`配置，默认`light` */
  const tooltipEffect = getConfig()?.TooltipEffect ?? 'light';

  const getDivStyle = computed((): CSSProperties => {
    return {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
    };
  });

  /** 头像（如果头像为空则使用 src/assets/user.jpg ） */
  const userAvatar = computed(() => {
    return isAllEmpty(useUserStoreHook()?.avatar) ? Avatar : useUserStoreHook()?.avatar;
  });

  /** 昵称（如果昵称为空则显示用户名） */
  const username = computed(() => {
    return isAllEmpty(useUserStoreHook()?.nickname) ? useUserStoreHook()?.username : useUserStoreHook()?.nickname;
  });

  /** 设置国际化选中后的样式 */
  const getDropdownItemStyle = computed(() => {
    return (locale, t) => {
      return {
        background: locale === t ? useEpThemeStoreHook().epThemeColor : '',
        color: locale === t ? '#f4f4f5' : '#000',
      };
    };
  });

  const getDropdownItemClass = computed(() => {
    return (locale, t) => {
      return locale === t ? '' : 'dark:hover:text-primary!';
    };
  });

  const avatarsStyle = computed(() => {
    return username.value ? { marginRight: '10px' } : '';
  });

  const isCollapse = computed(() => {
    return !authApp.getSidebarStatus;
  });

  const device = computed(() => {
    return authApp.getDevice;
  });

  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();
  const layout = computed(() => {
    return $storage?.layout?.layout;
  });

  const title = computed(() => {
    return $config.Title;
  });

  /** 动态title */
  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title;
    if (Title) document.title = `${transformI18n(meta.title)} | ${Title}`;
    else document.title = transformI18n(meta.title);
  }

  /** 退出登录（请求后端清理会话后清本地） */
  function logout() {
    void useUserStoreHook().logoutAndClear();
  }

  function backTopMenu() {
    router.push(getTopMenu()?.path);
  }

  function onPanel() {
    emitter.emit('openPanel');
  }

  function toggleSideBar() {
    authApp.toggleSideBar();
  }

  function handleResize(menuRef) {
    menuRef?.handleResize();
  }

  function resolvePath(route) {
    if (!route.children) return console.error(errorInfo);
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0]?.path;
    if (httpReg.test(routeChildPath)) {
      return route.path + '/' + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  function menuSelect(indexPath: string) {
    if (wholeMenus.value.length === 0 || isRemaining(indexPath)) return;
    emitter.emit('changLayoutRoute', indexPath);
  }

  /** 判断路径是否参与菜单 */
  function isRemaining(path: string) {
    return remainingPaths.includes(path);
  }

  /**
   * 获取`logo
   */
  function getLogo() {
    return new URL('/logo.svg', import.meta.url).href;
  }

  return {
    title,
    device,
    layout,
    logout,
    routers,
    $storage,
    isFullscreen,
    Fullscreen,
    ExitFullscreen,
    toggle,
    backTopMenu,
    onPanel,
    getDivStyle,
    changeTitle,
    toggleSideBar,
    menuSelect,
    handleResize,
    resolvePath,
    getLogo,
    isCollapse,
    pureApp: authApp,
    username,
    userAvatar,
    avatarsStyle,
    tooltipEffect,
    getDropdownItemStyle,
    getDropdownItemClass,
  };
}
