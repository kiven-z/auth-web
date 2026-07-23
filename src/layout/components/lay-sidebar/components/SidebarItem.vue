<script lang="ts" setup>
import { getConfig } from '@/auth/config';
import { menuType } from '@/layout/types';
import { ReText } from '@/components/ui/ReText';
import { useLayout } from '@/layout/hooks/layout/useLayout';
import { MENU_TITLE_ROW_STYLE } from '@/layout/utils/menu-path';
import { getMenuTooltipEffect } from '@/layout/utils/tooltip-effect';
import { transformI18n } from '@/app/plugins/i18n';
import { useAppStore } from '@/store/modules/app/app';
import SidebarLinkItem from './SidebarLinkItem.vue';
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { computed, type CSSProperties, type PropType, ref, toRaw, useAttrs } from 'vue';

import ArrowUp from '~icons/ep/arrow-up-bold';
import EpArrowDown from '~icons/ep/arrow-down-bold';
import ArrowLeft from '~icons/ep/arrow-left-bold';
import ArrowRight from '~icons/ep/arrow-right-bold';

const attrs = useAttrs();
const appStore = useAppStore();
const { layout } = useLayout();
const isCollapse = computed(() => !appStore.getSidebarStatus);
const tooltipEffect = getMenuTooltipEffect();
const getDivStyle = MENU_TITLE_ROW_STYLE;

const props = defineProps({
  item: {
    type: Object as PropType<menuType>,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };
});

const getSubMenuIconStyle = computed((): CSSProperties => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: layout.value === 'horizontal' ? '0 5px 0 0' : isCollapse.value ? '0 auto' : '0 5px 0 0',
  };
});

const textClass = computed(() => {
  const item = props.item;
  const baseClass = 'w-full! text-inherit!';
  if (
    layout.value !== 'horizontal' &&
    isCollapse.value &&
    !toRaw(item.meta.icon) &&
    ((layout.value === 'vertical' && item.parentId === null) || (layout.value === 'mix' && item.pathList.length === 2))
  ) {
    return `${baseClass} min-w-[54px]! text-center! px-3!`;
  }
  return baseClass;
});

const expandCloseIcon = computed(() => {
  if (!getConfig()?.MenuArrowIconNoTransition) return '';
  return {
    'expand-close-icon': useRenderIcon(EpArrowDown),
    'expand-open-icon': useRenderIcon(ArrowUp),
    'collapse-close-icon': useRenderIcon(ArrowRight),
    'collapse-open-icon': useRenderIcon(ArrowLeft),
  };
});

const onlyOneChild: menuType = ref(null);

function hasOneShowingChild(children: menuType[] = [], parent: menuType) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
  });

  if (showingChildren[0]?.meta?.showParent) {
    return false;
  }

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }
  return false;
}

/** 拼接菜单路由路径（替代 path-browserify，避免浏览器端 process 未定义） */
function resolvePath(routePath: string) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  }
  if (!routePath) {
    return props.basePath;
  }
  if (routePath.startsWith('/')) {
    return routePath;
  }
  const base = props.basePath.replace(/\/+$/, '');
  return base ? `${base}/${routePath}` : `/${routePath}`;
}
</script>

<template>
  <SidebarLinkItem
    v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)"
    :to="item"
  >
    <el-menu-item
      :class="{ 'layout-menu__title--leaf': !isNest }"
      :index="resolvePath(onlyOneChild.path)"
      :style="getNoDropdownStyle"
      v-bind="attrs"
    >
      <div v-if="toRaw(item.meta.icon)" :style="getSubMenuIconStyle" class="layout-menu__icon">
        <component :is="useRenderIcon(toRaw(onlyOneChild.meta.icon) || (item.meta && toRaw(item.meta.icon)))" />
      </div>
      <el-text
        v-if="
          (!item?.meta.icon && isCollapse && layout === 'vertical' && item?.pathList?.length === 1) ||
          (!onlyOneChild.meta.icon && isCollapse && layout === 'mix' && item?.pathList?.length === 2)
        "
        class="w-full! px-3! min-w-[54px]! text-center! text-inherit!"
        truncated
      >
        {{ transformI18n(onlyOneChild.meta.title) }}
      </el-text>

      <template #title>
        <div :style="getDivStyle">
          <ReText
            :tippyProps="{
              offset: [0, -10],
              theme: tooltipEffect,
            }"
            class="w-full! text-inherit!"
          >
            {{ transformI18n(onlyOneChild.meta.title) }}
          </ReText>
          <div v-if="onlyOneChild.meta.extraIcon" class="flex justify-center items-center">
            <component :is="useRenderIcon(toRaw(onlyOneChild.meta.extraIcon))" class="w-[30px] h-[30px]" />
          </div>
        </div>
      </template>
    </el-menu-item>
  </SidebarLinkItem>
  <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported v-bind="expandCloseIcon">
    <template #title>
      <div v-if="toRaw(item.meta.icon)" :style="getSubMenuIconStyle" class="layout-menu__icon">
        <component :is="useRenderIcon(item.meta && toRaw(item.meta.icon))" />
      </div>
      <ReText
        v-if="
          layout === 'mix' && toRaw(item.meta.icon)
            ? !isCollapse || item?.pathList?.length !== 2
            : !(layout === 'vertical' && isCollapse && toRaw(item.meta.icon) && item.parentId === null)
        "
        :class="textClass"
        :tippyProps="{
          offset: [0, -10],
          theme: tooltipEffect,
        }"
      >
        {{ transformI18n(item.meta.title) }}
      </ReText>
      <div v-if="!isCollapse && item.meta.extraIcon" class="flex justify-center items-center">
        <component :is="useRenderIcon(toRaw(item.meta.extraIcon))" class="w-[30px] h-[30px]" />
      </div>
    </template>

    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :base-path="resolvePath(child.path)"
      :is-nest="true"
      :item="child"
      class="layout-menu__nest"
    />
  </el-sub-menu>
</template>
