<script lang="ts" setup>
import { delay } from '@/shared/utils/async/delay';
import { computed, ref, toRef, useAttrs } from 'vue';
import { useI18n } from 'vue-i18n';

import ExpandIcon from './images/expand.svg?component';
import RefreshIcon from './images/refresh.svg?component';
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';

import './index.scss';
import { TABLE_BAR_FAKE_REFRESH_MS, TABLE_BAR_ICON_CLASS, type TableBarDensity } from './constants';
import { useTableBarColumns } from './hooks/useTableBarColumns';
import { useTreeExpandAll } from './hooks/useTreeExpandAll';
import ColumnSettingPopover from './render/ColumnSettingPopover.vue';
import DensityDropdown from './render/DensityDropdown.vue';
import type { TableTreeControlRef } from './types';
import { tippyOptions } from './utils/tippyOptions';

defineOptions({
  name: 'TableBar',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /** 无 title 插槽时显示的标题；为空则使用 i18n `tableBar.defaultTitle` */
    title?: string;
    /** 树形表格展开/折叠时传入表格实例 */
    tableRef?: TableTreeControlRef;
    columns?: TableColumnList;
    isExpandAll?: boolean;
    /** 外部控制的刷新 loading；传入时不再使用内部假 loading */
    refreshLoading?: boolean;
    /** 填满定高父级（与 DataTable adaptive=fill 配套） */
    fill?: boolean;
  }>(),
  {
    title: '',
    columns: () => [],
    isExpandAll: true,
    fill: false,
  }
);

const emit = defineEmits<{
  refresh: [];
  fullscreen: [value: boolean];
}>();

const attrs = useAttrs();
const { t } = useI18n();

const loading = ref(false);
const isFullscreen = ref(false);

const columnsRef = toRef(props, 'columns');
const tableRefModel = toRef(props, 'tableRef');

const size = ref<TableBarDensity>('default');
const {
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
} = useTableBarColumns(columnsRef);

const { isExpandAll, onExpand } = useTreeExpandAll(tableRefModel, props.isExpandAll);

const refreshSpinning = computed(() => props.refreshLoading ?? loading.value);
const showTreeExpand = computed(() => !!props.tableRef?.size);
const fullscreenIcon = computed(() => (isFullscreen.value ? ExitFullscreen : Fullscreen));

function onRefresh() {
  if (props.refreshLoading === undefined) {
    loading.value = true;
    emit('refresh');
    void delay(TABLE_BAR_FAKE_REFRESH_MS).then(() => {
      loading.value = false;
    });
    return;
  }
  emit('refresh');
}

function onFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  emit('fullscreen', isFullscreen.value);
}
</script>

<template>
  <div
    :class="{
      'table-bar--fullscreen': isFullscreen,
      'table-bar--fill': fill,
    }"
    class="table-bar bg-auth-container"
    v-bind="attrs"
  >
    <div class="table-bar__toolbar">
      <slot name="title">
        <p class="m-0 truncate text-base font-bold">
          {{ title || t('tableBar.defaultTitle') }}
        </p>
      </slot>

      <div class="table-bar__actions">
        <div v-if="$slots.buttons" class="mr-4 flex">
          <slot name="buttons" />
        </div>

        <template v-if="showTreeExpand">
          <ExpandIcon
            v-tippy="tippyOptions(t, isExpandAll ? 'tableBar.tippyCollapse' : 'tableBar.tippyExpand')"
            :class="['w-4', TABLE_BAR_ICON_CLASS]"
            :style="{ transform: isExpandAll ? 'none' : 'rotate(-90deg)' }"
            @click="onExpand"
          />
          <el-divider direction="vertical" />
        </template>

        <RefreshIcon
          v-tippy="tippyOptions(t, 'tableBar.refresh')"
          :class="['w-4', TABLE_BAR_ICON_CLASS, refreshSpinning ? 'animate-spin' : '']"
          @click="onRefresh"
        />
        <el-divider direction="vertical" />

        <DensityDropdown v-model:size="size" />
        <el-divider direction="vertical" />

        <ColumnSettingPopover
          v-model:check-all="checkAll"
          :check-all-change="handleCheckAllChange"
          :check-column-list="checkColumnList"
          :check-column-list-change="handleCheckColumnListChange"
          :checked-columns="checkedColumns"
          :checked-columns-change="handleCheckedColumnsChange"
          :destroy-sortable="destroySortable"
          :init-sortable="initSortable"
          :is-fixed-column="isFixedColumn"
          :is-indeterminate="isIndeterminate"
          :reset="resetColumns"
        />
        <el-divider direction="vertical" />

        <IconifyIconOffline
          v-tippy="tippyOptions(t, isFullscreen ? 'tableBar.tippyExitFullscreen' : 'tableBar.tippyFullscreen')"
          :class="['w-4', TABLE_BAR_ICON_CLASS]"
          :icon="fullscreenIcon"
          @click="onFullscreen"
        />
      </div>
    </div>

    <div class="table-bar__body">
      <slot :dynamic-columns="dynamicColumns" :size="size" />
    </div>
  </div>
</template>
