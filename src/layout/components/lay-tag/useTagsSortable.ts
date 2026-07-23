import type { RouteConfigs } from '@/layout/types';
import { useMultiTagsStore } from '@/store/modules/app/multiTags';
import { isBoolean } from '@pureadmin/utils';
import Sortable from 'sortablejs';
import { storeToRefs } from 'pinia';
import { nextTick, onBeforeUnmount, type Ref, watch } from 'vue';

/** 路由 meta 上的固定标签标记 */
interface MetaWithFixedTag {
  fixedTag?: boolean;
}

/**
 * 标签稳定 key（path + query + params）
 * @param item 标签路由项
 * @returns key
 */
export function getTagItemKey(item: RouteConfigs): string {
  return `${item.path ?? ''}::${JSON.stringify(item.query ?? {})}::${JSON.stringify(item.params ?? {})}`;
}

/**
 * 是否固定标签
 * @param item 标签项
 * @returns 是否固定
 */
function isFixedTagItem(item: RouteConfigs | undefined): boolean {
  const fixedTag = (item?.meta as MetaWithFixedTag | undefined)?.fixedTag;
  return isBoolean(fixedTag) && fixedTag === true;
}

/**
 * 标签栏横向拖拽排序（SortableJS）；固定标签不可拖、不可作为落点
 * @param tabListRef 标签列表根节点
 * @param enabled 是否启用（标签栏可见时）
 */
export function useTagsSortable(tabListRef: Ref<HTMLElement | undefined>, enabled: Ref<boolean>): void {
  let sortableInstance: ReturnType<typeof Sortable.create> | null = null;
  const { multiTags } = storeToRefs(useMultiTagsStore());

  function destroySortable(): void {
    sortableInstance?.destroy();
    sortableInstance = null;
  }

  function initSortable(): void {
    destroySortable();
    const wrapper = tabListRef.value;
    if (!wrapper || !enabled.value) {
      return;
    }

    sortableInstance = Sortable.create(wrapper, {
      animation: 160,
      direction: 'horizontal',
      draggable: '.scroll-item:not(.fixed-tag)',
      filter: '.fixed-tag',
      preventOnFilter: false,
      ghostClass: 'tags-sortable-ghost',
      chosenClass: 'tags-sortable-chosen',
      dragClass: 'tags-sortable-drag',
      onMove(event) {
        return !event.related.classList.contains('fixed-tag');
      },
      onEnd(event) {
        void nextTick(() => {
          const { oldIndex, newIndex } = event;
          if (oldIndex == null || newIndex == null || oldIndex === newIndex) {
            return;
          }

          const multiTagsStore = useMultiTagsStore();
          const nextTags = [...multiTagsStore.multiTags];
          const moved = nextTags[oldIndex];
          const target = nextTags[newIndex];

          if (!moved || isFixedTagItem(moved) || isFixedTagItem(target)) {
            multiTagsStore.handleTags('equal', [...multiTagsStore.multiTags]);
            return;
          }

          const [row] = nextTags.splice(oldIndex, 1);
          nextTags.splice(newIndex, 0, row);
          multiTagsStore.handleTags('equal', nextTags);
        });
      },
    });
  }

  watch(
    [tabListRef, enabled, () => multiTags.value.length],
    () => {
      void nextTick(() => initSortable());
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    destroySortable();
  });
}
