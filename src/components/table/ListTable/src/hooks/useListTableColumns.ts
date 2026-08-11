import { transformI18n } from '@/app/plugins/i18n';
import { getKeyList } from '@/shared/utils/array/getKeyList';
import cloneDeep from 'lodash/cloneDeep';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import Sortable from 'sortablejs';
import type { Ref } from 'vue';
import { nextTick as vueNextTick, onBeforeUnmount, ref, watch } from 'vue';

import { LIST_TABLE_UNMANAGED_COLUMN_TYPES } from '../constants';

function filterVisibleColumns(columns: TableColumnList): TableColumns[] {
  return cloneDeep(columns).filter((column) =>
    isBoolean(column?.hide) ? !column.hide : !(isFunction(column?.hide) && (column.hide as () => boolean)())
  );
}

/** 可进列设置面板的业务列（排除 selection / index / expand） */
function isSettingManagedColumn(column: TableColumns): boolean {
  const type = column.type as string | undefined;
  return !type || !(LIST_TABLE_UNMANAGED_COLUMN_TYPES as readonly string[]).includes(type);
}

/**
 * 列显隐、拖拽排序状态与 Sortable 绑定
 * @param columnsRef 表格列配置 ref
 * @returns 列显隐状态及操作方法
 */
export function useListTableColumns(columnsRef: Ref<TableColumnList>) {
  const checkAll = ref(true);
  const isIndeterminate = ref(false);

  const checkColumnList = ref<string[]>(
    getKeyList(cloneDeep(columnsRef.value.filter(isSettingManagedColumn)), 'label')
  );
  const checkedColumns = ref<string[]>(
    getKeyList(cloneDeep(filterVisibleColumns(columnsRef.value).filter(isSettingManagedColumn)), 'label')
  );
  const dynamicColumns = ref<TableColumnList>(cloneDeep(columnsRef.value));

  let sortableInstance: ReturnType<typeof Sortable.create> | null = null;

  function destroySortable() {
    sortableInstance?.destroy();
    sortableInstance = null;
  }

  function syncCheckColumnListFromDynamic() {
    checkColumnList.value = getKeyList(dynamicColumns.value.filter(isSettingManagedColumn), 'label');
  }

  /** 拖拽结束：固定列还原 DOM；业务列写回 dynamicColumns */
  function applySortableReorder(evt: Sortable.SortableEvent) {
    const { newIndex, oldIndex, item } = evt;
    if (newIndex == null || oldIndex == null || !item?.parentNode) {
      return;
    }

    const managedIndices = dynamicColumns.value
      .map((column, index) => (isSettingManagedColumn(column) ? index : -1))
      .filter((index) => index >= 0);
    const oldDynIndex = managedIndices[oldIndex];
    const newDynIndex = managedIndices[newIndex];
    if (oldDynIndex == null || newDynIndex == null) {
      return;
    }

    const oldColumn = dynamicColumns.value[oldDynIndex];
    const newColumn = dynamicColumns.value[newDynIndex];
    const targetThElem = item;
    const wrapperElem = targetThElem.parentNode as HTMLElement;

    if (oldColumn?.fixed || newColumn?.fixed) {
      const oldThElem = wrapperElem.children[oldIndex] as HTMLElement;
      if (newIndex > oldIndex) {
        oldThElem.before(targetThElem);
      } else {
        oldThElem.after(targetThElem);
      }
      return;
    }

    const managed = managedIndices.map((index) => dynamicColumns.value[index]);
    const [moved] = managed.splice(oldIndex, 1);
    managed.splice(newIndex, 0, moved);
    managedIndices.forEach((dynIndex, i) => {
      dynamicColumns.value[dynIndex] = managed[i]!;
    });
    syncCheckColumnListFromDynamic();
  }

  function handleSortableEnd(evt: Sortable.SortableEvent) {
    // 延后修改 Vue 数据，避免 Sortable._onDrop 尚未完成时列表被 patch 替换导致内部解绑读到 null
    void vueNextTick(() => applySortableReorder(evt));
  }

  function bindSortable(wrapper: HTMLElement) {
    sortableInstance = Sortable.create(wrapper, {
      animation: 300,
      handle: '.drag-btn',
      onEnd: handleSortableEnd,
    });
  }

  /**
   * 在列设置 Popover 打开后绑定 Sortable（勿在 mouseenter 中反复 destroy/create，否则拖拽中 teardown 会触发 Sortable 对 null 调 removeEventListener）。
   * @param columnGroupRoot 列勾选列表根节点（直接作为 Sortable 容器）
   */
  function initSortable(columnGroupRoot: HTMLElement | null | undefined) {
    void vueNextTick(() => {
      destroySortable();
      if (!columnGroupRoot) {
        return;
      }
      bindSortable(columnGroupRoot);
    });
  }

  function handleCheckAllChange(val: boolean) {
    checkedColumns.value = val ? checkColumnList.value : [];
    isIndeterminate.value = false;
    dynamicColumns.value.forEach((column) => {
      if (isSettingManagedColumn(column)) {
        column.hide = !val;
      }
    });
  }

  function handleCheckedColumnsChange(value: string[]) {
    checkedColumns.value = [...value];
    const checkedCount = value.length;
    checkAll.value = checkedCount === checkColumnList.value.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < checkColumnList.value.length;
  }

  function handleCheckColumnListChange(val: boolean, label: string) {
    const match = dynamicColumns.value
      .filter(isSettingManagedColumn)
      .find((item) => transformI18n(item.label) === transformI18n(label));
    if (match) {
      match.hide = !val;
    }
  }

  function resetColumns() {
    checkAll.value = true;
    isIndeterminate.value = false;
    dynamicColumns.value = cloneDeep(columnsRef.value);
    checkColumnList.value = getKeyList(cloneDeep(columnsRef.value.filter(isSettingManagedColumn)), 'label');
    checkedColumns.value = getKeyList(
      cloneDeep(filterVisibleColumns(columnsRef.value).filter(isSettingManagedColumn)),
      'label'
    );
  }

  /**
   * 父级列配置变化时（如切换语言、热更新列定义）重算可见列与勾选态，并释放 Sortable 以免绑在过期 DOM 上。
   */
  watch(
    columnsRef,
    () => {
      resetColumns();
      destroySortable();
    },
    { deep: true }
  );

  function isFixedColumn(label: string): boolean {
    const col = dynamicColumns.value
      .filter(isSettingManagedColumn)
      .find((item) => transformI18n(item.label) === transformI18n(label));
    return !!col?.fixed;
  }

  onBeforeUnmount(() => {
    destroySortable();
  });

  return {
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
