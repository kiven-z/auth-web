<script lang="ts" setup>
import { transformI18n } from '@/app/plugins/i18n';
import { nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import DragIcon from '../images/drag.svg?component';
import SettingIcon from '../images/settings.svg?component';
import { TABLE_BAR_ICON_CLASS } from '../constants';
import { tippyOptions } from '../utils/tippyOptions';

defineOptions({ name: 'ColumnSettingPopover' });

const { initSortable, checkAllChange, checkedColumnsChange, checkColumnListChange } = defineProps<{
  isIndeterminate: boolean;
  checkColumnList: string[];
  checkedColumns: string[];
  initSortable: (root: HTMLElement | null | undefined) => void;
  destroySortable: () => void;
  isFixedColumn: (label: string) => boolean;
  checkAllChange: (value: boolean) => void;
  checkedColumnsChange: (value: string[]) => void;
  checkColumnListChange: (value: boolean, label: string) => void;
  reset: () => void;
}>();

const checkAll = defineModel<boolean>('checkAll', { required: true });

const { t } = useI18n();
const columnGroupRef = ref<{ $el: HTMLElement } | null>(null);

async function onShow() {
  await nextTick();
  initSortable(columnGroupRef.value?.$el);
}
</script>

<template>
  <el-popover
    :popper-style="{ padding: 0 }"
    placement="bottom-start"
    trigger="click"
    width="200"
    @hide="destroySortable"
    @show="onShow"
  >
    <template #reference>
      <SettingIcon v-tippy="tippyOptions(t, 'tableBar.tippyColumnSettings')" :class="['w-4', TABLE_BAR_ICON_CLASS]" />
    </template>

    <div class="table-bar__popover-head">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        :label="t('tableBar.columnShowAll')"
        class="-mr-1!"
        @change="(value: boolean | string | number) => checkAllChange(!!value)"
      />
      <el-button link type="primary" @click="reset">
        {{ t('tableBar.reset') }}
      </el-button>
    </div>

    <div class="table-bar__column-body">
      <el-scrollbar max-height="36vh">
        <el-checkbox-group
          ref="columnGroupRef"
          :model-value="checkedColumns"
          @update:model-value="(value: Array<string | number>) => checkedColumnsChange(value as string[])"
        >
          <el-space :size="0" alignment="flex-start" direction="vertical">
            <div v-for="(item, index) in checkColumnList" :key="item" class="flex items-center">
              <DragIcon :class="['drag-btn mr-2 w-4', isFixedColumn(item) ? 'cursor-no-drop!' : 'cursor-grab!']" />
              <el-checkbox
                :key="index"
                :label="item"
                :value="item"
                @change="(value: boolean | string | number) => checkColumnListChange(!!value, item)"
              >
                <span :title="transformI18n(item)" class="inline-block w-30 truncate hover:text-text_color_primary">
                  {{ transformI18n(item) }}
                </span>
              </el-checkbox>
            </div>
          </el-space>
        </el-checkbox-group>
      </el-scrollbar>
    </div>
  </el-popover>
</template>
