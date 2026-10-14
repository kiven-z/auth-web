<script lang="ts" setup>
import { onClickOutside, useResizeObserver } from '@vueuse/core';
import { delay } from '@/shared/utils/async/delay';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TagItem from './components/TagItem.vue';
import TagsContextMenu from './TagsContextMenu.vue';
import { useTagsBar } from './hooks/use-tags-bar';
import { useTagsScroll } from './hooks/use-tags-scroll';
import { useTagsSortable } from './hooks/use-tags-sortable';
import { isSameTag } from '@/store/modules/preferences/tags/tag-push-rules';
import { isFixedTagItem } from './utils/fixed-tag';
import { navigateToTag } from './utils/tag-navigate';

import ArrowLeftSLine from '~icons/ri/arrow-left-s-line';
import ArrowRightSLine from '~icons/ri/arrow-right-s-line';

defineOptions({
  name: 'TagsBar',
});

const route = useRoute();
const router = useRouter();
const { multiTags } = storeToRefs(useTagsPreferencesStore());

const containerDom = ref<HTMLElement>();
const tabDom = ref<HTMLElement>();
const scrollbarDom = ref<HTMLDivElement>();
const contextmenuRef = ref();
const isShowArrow = ref(false);

const { syncArrowVisible, scrollTagIntoView, scrollByArrow, handleWheel } = useTagsScroll({
  scrollbarRef: scrollbarDom,
  tabListRef: tabDom,
  isShowArrow,
});

useTagsSortable(tabDom);

/**
 * 路由变化后滚动激活标签并刷新箭头
 */
async function dynamicTagView(): Promise<void> {
  await nextTick();
  const index = multiTags.value.findIndex((item) =>
    isSameTag(item, {
      path: route.path,
      query: route.query,
      params: route.params,
    })
  );
  await scrollTagIntoView(index);
}

const { deleteMenu, openMenu, closeMenu, selectTag, visible, menuStyle, menuItems, syncTagsWithRoute } = useTagsBar({
  containerDom,
  dynamicTagView,
});

onClickOutside(contextmenuRef, closeMenu, {
  detectIframe: true,
});

watch(route, () => {
  void dynamicTagView();
  syncTagsWithRoute();
});

onMounted(() => {
  syncTagsWithRoute();
  useResizeObserver(scrollbarDom, () => {
    syncArrowVisible();
    void dynamicTagView();
  });
  delay().then(() => dynamicTagView());
});
</script>

<template>
  <div ref="containerDom" class="layout-tags">
    <span v-show="isShowArrow" class="arrow-left">
      <ArrowLeftSLine @click="scrollByArrow(-1)" />
    </span>
    <div ref="scrollbarDom" class="scroll-container" @wheel.prevent="handleWheel">
      <div ref="tabDom" class="tab select-none">
        <TagItem
          v-for="(item, index) in multiTags"
          :key="`${item.path ?? ''}::${JSON.stringify(item.query ?? {})}::${JSON.stringify(item.params ?? {})}`"
          :active="isSameTag(item, route)"
          :fixed="isFixedTagItem(item)"
          :index="index"
          :item="item"
          @click="navigateToTag(router, item)"
          @close="deleteMenu(item)"
          @contextmenu.prevent="openMenu(item, $event)"
        />
      </div>
    </div>
    <span v-show="isShowArrow" class="arrow-right">
      <ArrowRightSLine @click="scrollByArrow(1)" />
    </span>

    <div ref="contextmenuRef">
      <TagsContextMenu :items="menuItems" :menu-style="menuStyle" :visible="visible" @select="selectTag" />
    </div>
  </div>
</template>

<style lang="scss">
@import url('index.scss');
</style>
