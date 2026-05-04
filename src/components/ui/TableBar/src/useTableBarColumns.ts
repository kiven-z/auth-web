import { transformI18n } from '@/plugins/i18n';
import { cloneDeep, getKeyList, isBoolean, isFunction } from '@pureadmin/utils';
import Sortable from 'sortablejs';
import type { Ref } from 'vue';
import { nextTick, onBeforeUnmount, ref } from 'vue';

function filterVisibleColumns(columns: TableColumnList): TableColumns[] {
  return cloneDeep(columns).filter((column) =>
    isBoolean(column?.hide) ? !column.hide : !(isFunction(column?.hide) && (column.hide as () => boolean)())
  );
}

/**
 * 列显隐、密度、拖拽排序状态与 Sortable 绑定。
 */
export function useTableBarColumns(columnsRef: Ref<TableColumnList>) {
  const size = ref<'large' | 'default' | 'small'>('default');
  const checkAll = ref(true);
  const isIndeterminate = ref(false);

  const checkColumnList = ref<string[]>(getKeyList(cloneDeep(columnsRef.value), 'label'));
  const checkedColumns = ref<string[]>(getKeyList(cloneDeep(filterVisibleColumns(columnsRef.value)), 'label'));
  const dynamicColumns = ref<TableColumnList>(cloneDeep(columnsRef.value));

  let sortableInstance: ReturnType<typeof Sortable.create> | null = null;

  function destroySortable() {
    sortableInstance?.destroy();
    sortableInstance = null;
  }

  /**
   * 在列设置 Popover 内，将 Sortable 绑定到 CheckboxGroup 子容器。
   */
  function initSortable(columnGroupRoot: HTMLElement | null | undefined) {
    void nextTick(() => {
      destroySortable();
      const wrapper = columnGroupRoot?.firstElementChild as HTMLElement | null | undefined;
      if (!wrapper) {
        return;
      }
      sortableInstance = Sortable.create(wrapper, {
        animation: 300,
        handle: '.drag-btn',
        onEnd: ({ newIndex, oldIndex, item }) => {
          const targetThElem = item;
          const wrapperElem = targetThElem.parentNode as HTMLElement;
          const oldColumn = dynamicColumns.value[oldIndex];
          const newColumn = dynamicColumns.value[newIndex];
          if (oldColumn?.fixed || newColumn?.fixed) {
            const oldThElem = wrapperElem.children[oldIndex] as HTMLElement;
            if (newIndex > oldIndex) {
              wrapperElem.insertBefore(targetThElem, oldThElem);
            } else {
              wrapperElem.insertBefore(targetThElem, oldThElem ? oldThElem.nextElementSibling : oldThElem);
            }
            return;
          }
          const currentRow = dynamicColumns.value.splice(oldIndex, 1)[0];
          dynamicColumns.value.splice(newIndex, 0, currentRow);
        },
      });
    });
  }

  function handleCheckAllChange(val: boolean) {
    checkedColumns.value = val ? checkColumnList.value : [];
    isIndeterminate.value = false;
    dynamicColumns.value.forEach((column) => {
      column.hide = !val;
    });
  }

  function handleCheckedColumnsChange(value: string[]) {
    checkedColumns.value = [...value];
    const checkedCount = value.length;
    checkAll.value = checkedCount === checkColumnList.value.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < checkColumnList.value.length;
  }

  function handleCheckColumnListChange(val: boolean, label: string) {
    const match = dynamicColumns.value.filter(
      (item) => transformI18n(item.label as string) === transformI18n(label)
    )[0];
    if (match) {
      match.hide = !val;
    }
  }

  function resetColumns() {
    checkAll.value = true;
    isIndeterminate.value = false;
    dynamicColumns.value = cloneDeep(columnsRef.value);
    checkColumnList.value = getKeyList(cloneDeep(columnsRef.value), 'label');
    const visible = filterVisibleColumns(columnsRef.value);
    checkedColumns.value = getKeyList(cloneDeep(visible), 'label');
  }

  function isFixedColumn(label: string): boolean {
    const col = dynamicColumns.value.filter((item) => transformI18n(item.label as string) === transformI18n(label))[0];
    return !!col?.fixed;
  }

  onBeforeUnmount(() => {
    destroySortable();
  });

  return {
    size,
    checkAll,
    isIndeterminate,
    checkColumnList,
    checkedColumns,
    dynamicColumns,
    handleCheckAllChange,
    handleCheckedColumnsChange,
    handleCheckColumnListChange,
    resetColumns,
    initSortable,
    destroySortable,
    isFixedColumn,
  };
}
