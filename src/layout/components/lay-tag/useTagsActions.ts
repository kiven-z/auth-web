import { type RouteConfigs, type routeMetaType, routerArrays, type tagsViewsType } from '@/layout/types';
import { $t } from '@/app/plugins/i18n';
import { remainingPaths } from '@/router';
import { getTopMenu, handleAliveRoute } from '@/router/utils/misc';
import NProgress from '@/services/progress';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { useSettingStore } from '@/store/modules/app/settings';
import { isAllEmpty, isEqual } from '@pureadmin/utils';
import { nextTick, type Ref, toRaw } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';

/** 路由 meta 上的固定标签标记（类型未收口前局部读取） */
type MetaWithFixedTag = routeMetaType & { fixedTag?: boolean };

/**
 * 是否固定标签
 * @param meta 路由 meta
 * @returns 是否固定
 */
function isFixedTagMeta(meta?: routeMetaType): boolean {
  return Boolean((meta as MetaWithFixedTag | undefined)?.fixedTag);
}

interface TagsActionsDeps {
  route: RouteLocationNormalizedLoaded;
  router: Router;
  multiTags: Ref<Array<RouteConfigs>>;
  tagsViews: Array<tagsViewsType>;
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
 * 标签关闭 / 右键菜单 / 路由同步（与 TagsBar 模板解耦，避免单文件膨胀）
 * @param deps 标签栏运行时依赖
 * @returns 菜单与关闭相关方法
 */
export function useTagsActions(deps: TagsActionsDeps) {
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
  const fixedTags = [
    ...routerArrays,
    ...usePermissionStore().flatteningRoutes.filter((item) => isFixedTagMeta(item?.meta)),
  ];

  /**
   * 按路由树补齐缺失标签
   * @param value 路由 path
   */
  function dynamicRouteTag(value: string): void {
    const hasValue = multiTags.value.some((item) => item.path === value);

    function concatPath(arr: readonly object[], pathValue: string) {
      if (hasValue) {
        return;
      }
      arr.forEach((arrItem: RouteConfigs) => {
        if (arrItem.path === pathValue) {
          useMultiTagsStore().handleTags('push', {
            path: pathValue,
            meta: arrItem.meta,
            name: arrItem.name,
          });
        } else if (arrItem.children && arrItem.children.length > 0) {
          concatPath(arrItem.children, pathValue);
        }
      });
    }
    concatPath(router.options.routes, value);
  }

  /** 刷新当前路由 */
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

  /**
   * 按策略关闭标签并必要时跳转
   * @param obj 目标标签
   * @param current 当前 path
   * @param tag left | right | other
   */
  function deleteDynamicTag(obj: RouteConfigs, current: string, tag?: string): void {
    const valueIndex: number = multiTags.value.findIndex((item: RouteConfigs) => {
      if (item.query) {
        if (item.path === obj.path) {
          return item.query === obj.query;
        }
      } else if (item.params) {
        if (item.path === obj.path) {
          return item.params === obj.params;
        }
      } else {
        return item.path === obj.path;
      }
      return false;
    });

    const spliceRoute = (startIndex?: number, length?: number, other?: boolean): void => {
      if (other) {
        useMultiTagsStore().handleTags(
          'equal',
          [VITE_HIDE_HOME === 'false' ? fixedTags : toRaw(getTopMenu()), obj].flat()
        );
      } else {
        useMultiTagsStore().handleTags('splice', '', {
          startIndex,
          length,
        });
      }
      void dynamicTagView();
    };

    if (tag === 'other') {
      spliceRoute(1, 1, true);
    } else if (tag === 'left') {
      spliceRoute(fixedTags.length, valueIndex - fixedTags.length);
    } else if (tag === 'right') {
      spliceRoute(valueIndex + 1, multiTags.value.length);
    } else {
      spliceRoute(valueIndex, 1);
    }

    const newRoute = useMultiTagsStore().handleTags('slice') as Array<RouteConfigs>;
    if (current === route.path) {
      if (tag === 'left') {
        return;
      }
      pushTagRoute(newRoute[0]);
    } else {
      if (!multiTags.value.length) {
        return;
      }
      if (multiTags.value.some((item) => item.path === route.path)) {
        return;
      }
      pushTagRoute(newRoute[0]);
    }
  }

  /**
   * 跳转到标签对应路由
   * @param tagRoute 标签路由
   */
  function pushTagRoute(tagRoute?: RouteConfigs): void {
    if (!tagRoute) {
      return;
    }
    if (tagRoute.query) {
      router.push({ name: tagRoute.name, query: tagRoute.query as never });
    } else if (tagRoute.params) {
      router.push({ name: tagRoute.name, params: tagRoute.params as never });
    } else {
      router.push({ path: tagRoute.path });
    }
  }

  /**
   * 关闭标签并清理 keep-alive
   * @param item 标签
   * @param tag 关闭策略
   */
  function deleteMenu(item: RouteConfigs, tag?: string): void {
    deleteDynamicTag(item, item.path, tag);
    handleAliveRoute(route as ToRouteType);
  }

  /**
   * 下拉 / 右键菜单项点击
   * @param key 菜单索引
   * @param item 菜单项
   * @param selectRoute 右键选中的标签
   */
  function onClickDrop(key: number, item: tagsViewsType, selectRoute?: RouteConfigs): void {
    if (item && item.disabled) {
      return;
    }

    let selectTagRoute: RouteConfigs;
    if (selectRoute) {
      selectTagRoute = {
        path: selectRoute.path,
        meta: selectRoute.meta,
        name: selectRoute.name,
        query: selectRoute?.query,
        params: selectRoute?.params,
      };
    } else {
      selectTagRoute = { path: route.path, meta: route.meta };
    }

    switch (key) {
      case 0:
        onFresh();
        break;
      case 1:
        deleteMenu(selectTagRoute);
        break;
      case 2:
        deleteMenu(selectTagRoute, 'left');
        break;
      case 3:
        deleteMenu(selectTagRoute, 'right');
        break;
      case 4:
        deleteMenu(selectTagRoute, 'other');
        break;
      case 5:
        useMultiTagsStore().handleTags('splice', '', {
          startIndex: fixedTags.length,
          length: multiTags.value.length,
        });
        router.push(topPath);
        handleAliveRoute(route as ToRouteType);
        break;
      case 6: {
        onContentFullScreen();
        const settingStore = useSettingStore();
        setTimeout(() => {
          if (settingStore.hiddenSideBar) {
            tagsViews[6].icon = ExitFullscreen;
            tagsViews[6].text = $t('buttons.contentExitFullScreen');
          } else {
            tagsViews[6].icon = Fullscreen;
            tagsViews[6].text = $t('buttons.contentFullScreen');
          }
        }, 100);
        break;
      }
    }
    setTimeout(() => {
      showMenuModel(route.fullPath, route.query, route.params);
    });
  }

  /**
   * 右侧下拉命令
   * @param command 命令载荷
   */
  function handleCommand(command: { key: number; item: tagsViewsType }): void {
    const { key, item } = command;
    onClickDrop(key, item);
  }

  /**
   * 右键菜单项点击
   * @param key 菜单索引
   * @param item 菜单项
   */
  function selectTag(key: number, item: tagsViewsType): void {
    closeMenu();
    onClickDrop(key, item, currentSelect.value as RouteConfigs);
  }

  /**
   * 批量设置关闭类菜单显隐
   * @param value 是否显示
   */
  function showMenus(value: boolean): void {
    Array.of(1, 2, 3, 4, 5).forEach((index) => {
      tagsViews[index].show = value;
    });
  }

  /**
   * 批量设置关闭类菜单禁用
   * @param value 是否禁用
   * @param fixedTag 左侧是否为固定标签
   */
  function disabledMenus(value: boolean, fixedTag = false): void {
    Array.of(1, 2, 3, 4, 5).forEach((index) => {
      tagsViews[index].disabled = value;
    });
    if (fixedTag) {
      tagsViews[2].show = false;
      tagsViews[2].disabled = true;
    }
  }

  /**
   * 按当前标签位置刷新右键菜单可用项
   * @param currentPath 当前 path
   * @param query query
   * @param params params
   * @param refresh 是否强制显示刷新
   */
  function showMenuModel(currentPath: string, query: object = {}, params: object = {}, refresh = false): void {
    const allRoute = multiTags.value;
    const routeLength = multiTags.value.length;
    let currentIndex = -1;
    if (!isAllEmpty(params)) {
      currentIndex = allRoute.findIndex((item) => isEqual(item.params, params));
    } else if (!isAllEmpty(query)) {
      currentIndex = allRoute.findIndex((item) => isEqual(item.query, query));
    } else {
      currentIndex = allRoute.findIndex((item) => item.path === currentPath);
    }

    function fixedTagDisabled() {
      if (isFixedTagMeta(allRoute[currentIndex]?.meta)) {
        Array.of(1, 2, 3, 4, 5).forEach((index) => {
          tagsViews[index].disabled = true;
        });
      }
    }

    showMenus(true);

    if (refresh) {
      tagsViews[0].show = true;
    }

    if (currentIndex === 1 && routeLength !== 2) {
      tagsViews[2].show = false;
      Array.of(1, 3, 4, 5).forEach((index) => {
        tagsViews[index].disabled = false;
      });
      tagsViews[2].disabled = true;
      fixedTagDisabled();
    } else if (currentIndex === 1 && routeLength === 2) {
      disabledMenus(false);
      Array.of(2, 3, 4).forEach((index) => {
        tagsViews[index].show = false;
        tagsViews[index].disabled = true;
      });
      fixedTagDisabled();
    } else if (routeLength - 1 === currentIndex && currentIndex !== 0) {
      tagsViews[3].show = false;
      Array.of(1, 2, 4, 5).forEach((index) => {
        tagsViews[index].disabled = false;
      });
      tagsViews[3].disabled = true;
      if (isFixedTagMeta(allRoute[currentIndex - 1]?.meta)) {
        tagsViews[2].show = false;
        tagsViews[2].disabled = true;
      }
      fixedTagDisabled();
    } else if (currentIndex === 0 || currentPath === `/redirect${topPath}`) {
      disabledMenus(true);
    } else {
      disabledMenus(false, isFixedTagMeta(allRoute[currentIndex - 1]?.meta));
      fixedTagDisabled();
    }
  }

  /**
   * 打开右键菜单
   * @param tag 标签
   * @param event 鼠标事件
   */
  function openMenu(tag: RouteConfigs, event: MouseEvent): void {
    closeMenu();
    if (tag.path === topPath || isFixedTagMeta(tag?.meta)) {
      showMenus(false);
      tagsViews[0].show = true;
    } else if (route.path !== tag.path && route.name !== tag.name) {
      tagsViews[0].show = false;
      showMenuModel(tag.path, tag.query, tag.params);
    } else if (multiTags.value.length === 2 && route.path !== tag.path) {
      showMenus(true);
      tagsViews[4].show = false;
      showMenuModel(tag.path, tag.query, tag.params);
    } else {
      showMenuModel(tag.path, tag.query, tag.params, true);
    }

    currentSelect.value = tag;
    const menuMinWidth = 140;
    const offsetLeft = containerDom.value.getBoundingClientRect().left;
    const offsetWidth = containerDom.value.offsetWidth;
    const maxLeft = offsetWidth - menuMinWidth;
    const left = event.clientX - offsetLeft + 5;
    if (left > maxLeft) {
      buttonLeft.value = maxLeft;
    } else {
      buttonLeft.value = left;
    }
    useSettingStore().hiddenSideBar ? (buttonTop.value = event.clientY) : (buttonTop.value = event.clientY - 40);
    nextTick(() => {
      visible.value = true;
    });
  }

  /**
   * 点击标签切换路由
   * @param item 标签
   */
  function tagOnClick(item: RouteConfigs): void {
    const { name, path } = item;
    if (name) {
      if (item.query) {
        router.push({
          name,
          query: item.query as Record<string, string>,
        });
      } else if (item.params) {
        router.push({
          name,
          params: item.params as Record<string, string>,
        });
      } else {
        router.push({ name });
      }
    } else {
      router.push({ path });
    }
  }

  /**
   * 路由变化时补标签并刷新菜单态
   */
  function syncTagsWithRoute(): void {
    if (route.path.includes('/redirect')) {
      return;
    }
    if (usePermissionStore().wholeMenus.length > 0 && !remainingPaths.includes(route.path)) {
      dynamicRouteTag(route.path);
    }
    setTimeout(() => {
      showMenuModel(route.fullPath, route.query, route.params);
    });
  }

  /**
   * 挂载时按当前路由初始化标签
   */
  function initTagsFromRoute(): void {
    showMenuModel(route.fullPath);
    if (usePermissionStore().wholeMenus.length > 0 && !remainingPaths.includes(route.path)) {
      dynamicRouteTag(route.path);
    }
  }

  return {
    deleteMenu,
    handleCommand,
    selectTag,
    openMenu,
    tagOnClick,
    showMenuModel,
    syncTagsWithRoute,
    initTagsFromRoute,
    dynamicRouteTag,
  };
}
