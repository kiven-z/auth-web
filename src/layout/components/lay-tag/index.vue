<script lang="ts" setup>
import { useTags } from '@/layout/hooks/navigation/useTag';
import { delay, isAllEmpty, isEqual, useResizeObserver } from '@pureadmin/utils';
import { onClickOutside } from '@vueuse/core';
import { computed, nextTick, onMounted as vueOnMounted, ref, watch } from 'vue';
import type { tagsViewsType } from '../../types';
import TagChrome from './components/TagChrome.vue';
import TagsContextMenu from './TagsContextMenu.vue';
import { useTagsActions } from './useTagsActions';
import { getTagItemKey, useTagsSortable } from './useTagsSortable';

import ArrowDown from '~icons/ri/arrow-down-s-line';
import ArrowLeftSLine from '~icons/ri/arrow-left-s-line';
import ArrowRightSLine from '~icons/ri/arrow-right-s-line';

const {
  Close,
  route,
  router,
  visible,
  showTags,
  instance,
  multiTags,
  tagsViews,
  buttonTop,
  buttonLeft,
  showModel,
  translateX,
  isFixedTag,
  activeIndex,
  getTabStyle,
  isScrolling,
  iconIsActive,
  linkIsActive,
  currentSelect,
  scheduleIsActive,
  getContextMenuStyle,
  closeMenu,
  onMouseenter,
  onMouseleave,
  transformI18n,
  onContentFullScreen,
} = useTags();

const tabDom = ref<HTMLElement>();
const containerDom = ref();
const scrollbarDom = ref();
const contextmenuRef = ref();
const isShowArrow = ref(false);
const tagsSortableEnabled = computed(() => !showTags.value);

useTagsSortable(tabDom, tagsSortableEnabled);

const dynamicTagView = async () => {
  await nextTick();
  const index = multiTags.value.findIndex((item) => {
    if (!isAllEmpty(route.query)) {
      return isEqual(route.query, item.query);
    }
    if (!isAllEmpty(route.params)) {
      return isEqual(route.params, item.params);
    }
    return route.path === item.path;
  });
  moveToView(index);
};

const moveToView = async (index: number): Promise<void> => {
  await nextTick();
  const tabNavPadding = 10;
  if (!instance.refs['dynamic' + index]) {
    return;
  }
  const tabItemEl = instance.refs['dynamic' + index][0];
  const tabItemElOffsetLeft = (tabItemEl as HTMLElement)?.offsetLeft;
  const tabItemOffsetWidth = (tabItemEl as HTMLElement)?.offsetWidth;
  const scrollbarDomWidth = scrollbarDom.value ? scrollbarDom.value?.offsetWidth : 0;
  const tabDomWidth = tabDom.value ? tabDom.value?.offsetWidth : 0;

  scrollbarDomWidth <= tabDomWidth ? (isShowArrow.value = true) : (isShowArrow.value = false);
  if (tabDomWidth < scrollbarDomWidth || tabItemElOffsetLeft === 0) {
    translateX.value = 0;
  } else if (tabItemElOffsetLeft < -translateX.value) {
    translateX.value = -tabItemElOffsetLeft + tabNavPadding;
  } else if (
    tabItemElOffsetLeft > -translateX.value &&
    tabItemElOffsetLeft + tabItemOffsetWidth < -translateX.value + scrollbarDomWidth
  ) {
    translateX.value = Math.min(0, scrollbarDomWidth - tabItemOffsetWidth - tabItemElOffsetLeft - tabNavPadding);
  } else {
    translateX.value = -(tabItemElOffsetLeft - (scrollbarDomWidth - tabNavPadding - tabItemOffsetWidth));
  }
};

/**
 * 横向滚动标签栏
 * @param offset 偏移量
 */
const handleScroll = (offset: number): void => {
  const scrollbarDomWidth = scrollbarDom.value ? scrollbarDom.value?.offsetWidth : 0;
  const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0;
  if (offset > 0) {
    translateX.value = Math.min(0, translateX.value + offset);
  } else if (scrollbarDomWidth < tabDomWidth) {
    if (translateX.value >= -(tabDomWidth - scrollbarDomWidth)) {
      translateX.value = Math.max(translateX.value + offset, scrollbarDomWidth - tabDomWidth);
    }
  } else {
    translateX.value = 0;
  }
  isScrolling.value = false;
};

/**
 * 滚轮滚动
 * @param event 滚轮事件
 */
const handleWheel = (event: WheelEvent): void => {
  isScrolling.value = true;
  const scrollIntensity = Math.abs(event.deltaX) + Math.abs(event.deltaY);
  let offset = 0;
  if (event.deltaX < 0) {
    offset = scrollIntensity > 0 ? scrollIntensity : 100;
  } else {
    offset = scrollIntensity > 0 ? -scrollIntensity : -100;
  }
  smoothScroll(offset);
};

/**
 * 平滑滚动
 * @param offset 总偏移
 */
const smoothScroll = (offset: number): void => {
  const scrollAmount = 20;
  let remaining = Math.abs(offset);

  const scrollStep = () => {
    const scrollOffset = Math.sign(offset) * Math.min(scrollAmount, remaining);
    handleScroll(scrollOffset);
    remaining -= Math.abs(scrollOffset);
    if (remaining > 0) {
      requestAnimationFrame(scrollStep);
    }
  };

  requestAnimationFrame(scrollStep);
};

const { deleteMenu, handleCommand, selectTag, openMenu, tagOnClick, syncTagsWithRoute, initTagsFromRoute } =
  useTagsActions({
    route,
    router,
    multiTags,
    tagsViews,
    currentSelect: currentSelect as never,
    visible,
    buttonTop,
    buttonLeft,
    containerDom,
    closeMenu,
    onContentFullScreen,
    dynamicTagView,
  });

onClickOutside(contextmenuRef, closeMenu, {
  detectIframe: true,
});

watch(route, () => {
  activeIndex.value = -1;
  void dynamicTagView();
  syncTagsWithRoute();
});

vueOnMounted(() => {
  if (!instance) {
    return;
  }
  initTagsFromRoute();
  useResizeObserver(scrollbarDom, dynamicTagView);
  delay().then(() => dynamicTagView());
});

/**
 * 右键菜单选择
 * @param key 索引
 * @param item 菜单项
 */
function onContextSelect(key: number, item: tagsViewsType): void {
  selectTag(key, item);
}

/**
 * 下拉命令
 * @param command 命令
 */
function onDropdownCommand(command: { key: number; item: tagsViewsType }): void {
  handleCommand(command);
}
</script>

<template>
  <div v-if="!showTags" ref="containerDom" class="tags-view">
    <span v-show="isShowArrow" class="arrow-left">
      <IconifyIconOffline :icon="ArrowLeftSLine" @click="handleScroll(200)" />
    </span>
    <div
      ref="scrollbarDom"
      :class="showModel === 'chrome' && 'chrome-scroll-container'"
      class="scroll-container"
      @wheel.prevent="handleWheel"
    >
      <div ref="tabDom" :style="getTabStyle" class="tab select-none">
        <div
          v-for="(item, index) in multiTags"
          :key="getTagItemKey(item)"
          :ref="'dynamic' + index"
          :class="[
            'scroll-item is-closable',
            linkIsActive(item),
            showModel === 'chrome' && 'chrome-item',
            isFixedTag(item) && 'fixed-tag',
          ]"
          @click="tagOnClick(item)"
          @contextmenu.prevent="openMenu(item, $event)"
          @mouseenter.prevent="onMouseenter(index)"
          @mouseleave.prevent="onMouseleave(index)"
        >
          <template v-if="showModel !== 'chrome'">
            <span class="tag-title dark:text-text_color_primary! dark:hover:text-primary!">
              {{ transformI18n(item.meta.title) }}
            </span>
            <span
              v-if="isFixedTag(item) ? false : iconIsActive(item, index) || (index === activeIndex && index !== 0)"
              class="el-icon-close"
              @click.stop="deleteMenu(item)"
            >
              <IconifyIconOffline :icon="Close" />
            </span>
            <span v-if="showModel !== 'card'" :ref="'schedule' + index" :class="[scheduleIsActive(item)]" />
          </template>
          <div v-else class="chrome-tab">
            <div class="chrome-tab__bg">
              <TagChrome />
            </div>
            <span class="tag-title">
              {{ transformI18n(item.meta.title) }}
            </span>
            <span v-if="isFixedTag(item) ? false : index !== 0" class="chrome-close-btn" @click.stop="deleteMenu(item)">
              <IconifyIconOffline :icon="Close" />
            </span>
            <span class="chrome-tab-divider" />
          </div>
        </div>
      </div>
    </div>
    <span v-show="isShowArrow" class="arrow-right">
      <IconifyIconOffline :icon="ArrowRightSLine" @click="handleScroll(-200)" />
    </span>

    <div ref="contextmenuRef">
      <TagsContextMenu
        :menu-style="getContextMenuStyle"
        :tags-views="tagsViews"
        :visible="visible"
        @select="onContextSelect"
      >
        <template #label="{ item }">
          {{ transformI18n(item.text) }}
        </template>
      </TagsContextMenu>
    </div>

    <el-dropdown placement="bottom-end" trigger="click" @command="onDropdownCommand">
      <span class="arrow-down">
        <IconifyIconOffline :icon="ArrowDown" class="dark:text-white" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, key) in tagsViews"
            :key="key"
            :command="{ key, item }"
            :disabled="item.disabled"
            :divided="item.divided"
          >
            <IconifyIconOffline :icon="item.icon" />
            {{ transformI18n(item.text) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
@import url('./index.scss');
</style>
