import { $t } from '@/app/plugins/i18n';
import type { RouteConfigs, TagContextMenuItem } from '@/layout/types';
import { routerArrays } from '@/layout/types';
import { getTopMenu, handleAliveRoute } from '@/router/utils/misc';
import NProgress from '@/services/progress';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { useSettingStore } from '@/store/modules/app/settings';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { nextTick, type Ref, toRaw } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';

import { TAG_MENU_INDEX, TagMenuAction } from '../constants/tagMenu';
import type { CloseScope } from '../types';
import { applyCloseScope, pickNavigateTag, shouldNavigateAfterClose } from '../utils/closeTags';
import { applyOpenMenuPreset, computeMenuState } from '../utils/contextMenuPolicy';
import { buildFixedTags, isFixedTagMeta } from '../utils/fixedTag';
import { applyMenuState, resolveContextMenuLeft } from '../utils/menuView';
import { findTagIndex } from '../utils/tagIdentity';
import { navigateToTag } from '../utils/tagNavigate';
import { useTagRouteSync } from './useTagRouteSync';

interface TagsBarDeps {
  route: RouteLocationNormalizedLoaded;
  router: Router;
  multiTags: Ref<RouteConfigs[]>;
  tagsViews: TagContextMenuItem[];
  currentSelect: Ref<RouteConfigs | Record<string, never>>;
  visible: Ref<boolean>;
  buttonTop: Ref<number>;
  buttonLeft: Ref<number>;
  containerDom: Ref<HTMLElement | undefined>;
  closeMenu: () => void;
  onContentFullScreen: () => void;
  dynamicTagView: () => Promise<void>;
}

/**
 * 标签栏行为编排：关闭、菜单、路由同步
 * @param deps 标签栏运行时依赖
 * @returns 标签栏对外方法
 */
export function useTagsBar(deps: TagsBarDeps) {
  const {
    route,
    router,
    multiTags,
    tagsViews,
    currentSelect,
    visible,
    buttonTop,
    buttonLeft,
    containerDom,
    closeMenu,
    onContentFullScreen,
    dynamicTagView,
  } = deps;

  const { VITE_HIDE_HOME } = import.meta.env;
  const topPath = getTopMenu()?.path;
  const fixedTags = buildFixedTags(routerArrays, usePermissionStore().flatteningRoutes);
  const keepHomeFixedTags = VITE_HIDE_HOME === 'false';
  const topMenuTag = toRaw(getTopMenu()) as RouteConfigs | undefined;

  const { dynamicRouteTag, syncTagsWithRoute, initTagsFromRoute } = useTagRouteSync({
    route,
    router,
    multiTags,
    topPath,
  });

  function refreshMenuState(forceShowReload = false): void {
    applyMenuState(
      tagsViews,
      computeMenuState({
        tags: multiTags.value,
        currentPath: route.fullPath,
        query: route.query,
        params: route.params,
        topPath,
        forceShowReload,
      })
    );
  }

  function onFresh(): void {
    NProgress.start();
    const { fullPath, query } = route;
    router.replace({
      path: '/redirect' + fullPath,
      query,
    });
    handleAliveRoute(route as ToRouteType, 'refresh');
    NProgress.done();
  }

  function closeTagsByScope(target: RouteConfigs, scope: CloseScope): void {
    const targetIndex = findTagIndex(multiTags.value, target);
    const nextTags = applyCloseScope(
      multiTags.value,
      targetIndex,
      scope,
      fixedTags.length,
      target,
      topMenuTag,
      keepHomeFixedTags
    );
    useMultiTagsStore().setTags(nextTags);
    void dynamicTagView();

    const closedPath = target.path ?? '';
    if (shouldNavigateAfterClose(closedPath, route.path, scope, nextTags)) {
      navigateToTag(router, pickNavigateTag(nextTags));
    }
  }

  function deleteMenu(item: RouteConfigs, scope?: CloseScope): void {
    closeTagsByScope(item, scope ?? 'current');
    handleAliveRoute(route as ToRouteType);
  }

  function closeAllTags(): void {
    useMultiTagsStore().setTags(multiTags.value.slice(0, fixedTags.length));
    router.push(topPath);
    handleAliveRoute(route as ToRouteType);
    void dynamicTagView();
  }

  function toggleFullscreenMenuLabel(): void {
    const settingStore = useSettingStore();
    setTimeout(() => {
      const fullscreenIndex = TAG_MENU_INDEX[TagMenuAction.Fullscreen];
      if (settingStore.hiddenSideBar) {
        tagsViews[fullscreenIndex].icon = ExitFullscreen;
        tagsViews[fullscreenIndex].text = $t('buttons.contentExitFullScreen');
      } else {
        tagsViews[fullscreenIndex].icon = Fullscreen;
        tagsViews[fullscreenIndex].text = $t('buttons.contentFullScreen');
      }
    }, 100);
  }

  const menuHandlers: Record<TagMenuAction, (selectRoute?: RouteConfigs) => void> = {
    [TagMenuAction.Reload]: () => onFresh(),
    [TagMenuAction.Close]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'current'),
    [TagMenuAction.CloseLeft]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'left'),
    [TagMenuAction.CloseRight]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'right'),
    [TagMenuAction.CloseOther]: (selectRoute) => selectRoute && deleteMenu(selectRoute, 'other'),
    [TagMenuAction.CloseAll]: () => closeAllTags(),
    [TagMenuAction.Fullscreen]: () => {
      onContentFullScreen();
      toggleFullscreenMenuLabel();
    },
  };

  function onClickDrop(key: number, item: TagContextMenuItem, selectRoute?: RouteConfigs): void {
    if (item?.disabled) {
      return;
    }

    const selectTagRoute: RouteConfigs = selectRoute
      ? {
          path: selectRoute.path,
          meta: selectRoute.meta,
          name: selectRoute.name,
          query: selectRoute.query,
          params: selectRoute.params,
        }
      : { path: route.path, meta: route.meta };

    const action = Object.entries(TAG_MENU_INDEX).find(([, index]) => index === key)?.[0] as TagMenuAction | undefined;
    if (action) {
      menuHandlers[action](selectTagRoute);
    }

    setTimeout(() => {
      refreshMenuState();
    });
  }

  function handleCommand(command: { key: number; item: TagContextMenuItem }): void {
    onClickDrop(command.key, command.item);
  }

  function selectTag(key: number, item: TagContextMenuItem): void {
    closeMenu();
    onClickDrop(key, item, currentSelect.value as RouteConfigs);
  }

  function openMenu(tag: RouteConfigs, event: MouseEvent): void {
    closeMenu();

    let menuState = computeMenuState({
      tags: multiTags.value,
      currentPath: tag.path ?? '',
      query: tag.query,
      params: tag.params,
      topPath,
    });

    if (tag.path === topPath || isFixedTagMeta(tag.meta)) {
      menuState = applyOpenMenuPreset(menuState, 'fixed-only-reload');
    } else if (route.path !== tag.path && route.name !== tag.name) {
      menuState = applyOpenMenuPreset(menuState, 'hide-reload');
    } else if (multiTags.value.length === 2 && route.path !== tag.path) {
      menuState = applyOpenMenuPreset(menuState, 'hide-close-other');
    } else {
      menuState = computeMenuState({
        tags: multiTags.value,
        currentPath: tag.path ?? '',
        query: tag.query,
        params: tag.params,
        topPath,
        forceShowReload: true,
      });
    }

    applyMenuState(tagsViews, menuState);

    currentSelect.value = tag;
    const container = containerDom.value;
    if (container) {
      const rect = container.getBoundingClientRect();
      buttonLeft.value = resolveContextMenuLeft(event.clientX, rect.left, container.offsetWidth);
    }
    buttonTop.value = useSettingStore().hiddenSideBar ? event.clientY : event.clientY - 40;
    nextTick(() => {
      visible.value = true;
    });
  }

  function tagOnClick(item: RouteConfigs): void {
    navigateToTag(router, item);
  }

  return {
    deleteMenu,
    handleCommand,
    selectTag,
    openMenu,
    tagOnClick,
    showMenuModel: refreshMenuState,
    syncTagsWithRoute: () => syncTagsWithRoute(tagsViews),
    initTagsFromRoute: () => initTagsFromRoute(tagsViews),
    dynamicRouteTag,
  };
}
