<script lang="ts" setup>
import { type Component, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CurrentPageExportPane from './components/CurrentPageExportPane.vue';
import FullAsyncExportPane from './components/FullAsyncExportPane.vue';
import PageRangeExportPane from './components/PageRangeExportPane.vue';
import { DEFAULT_MAX_EXPORT_ROWS } from './constants';
import type {
  ExportDialogFormState,
  ExportDialogPanelExpose,
  ExportDialogPanelProps,
  ExportPaneExpose,
  ExportScope,
} from './types';

defineOptions({ name: 'ExportDialogPanel' });

const props = withDefaults(defineProps<ExportDialogPanelProps>(), {
  maxExportRows: DEFAULT_MAX_EXPORT_ROWS,
  asyncExportEnabled: false,
});

const { t } = useI18n();
const activeScope = ref<ExportScope>('CURRENT_PAGE');
const activePaneRef = ref<ExportPaneExpose | null>(null);

const paneMap: Record<ExportScope, Component> = {
  CURRENT_PAGE: CurrentPageExportPane,
  PAGE_RANGE: PageRangeExportPane,
  FULL_ASYNC: FullAsyncExportPane,
};

const paneProps = computed(() => ({
  currentPage: props.currentPage,
  pageSize: props.pageSize,
  total: props.total,
  maxExportRows: props.maxExportRows,
}));

/**
 * 转发当前 pane 的校验
 * @returns 校验通过为 `true`
 */
const validate = async (): Promise<boolean> => {
  const pane = activePaneRef.value;
  if (!pane) {
    return false;
  }
  return pane.validate();
};

/**
 * 转发当前 pane 的表单状态
 * @returns 导出范围与页码区间
 */
const getFormState = (): ExportDialogFormState => {
  return (
    activePaneRef.value?.getFormState() ?? {
      exportScope: activeScope.value,
      fromPage: props.currentPage,
      toPage: props.currentPage,
    }
  );
};

defineExpose<ExportDialogPanelExpose>({ validate, getFormState });
</script>

<template>
  <div>
    <el-tabs v-model="activeScope">
      <el-tab-pane :label="t('fileExportDialog.scopeCurrentPage')" name="CURRENT_PAGE" />
      <el-tab-pane :label="t('fileExportDialog.scopePageRange')" name="PAGE_RANGE" />
      <el-tab-pane :disabled="!asyncExportEnabled" :label="t('fileExportDialog.scopeFullAsync')" name="FULL_ASYNC" />
    </el-tabs>

    <component :is="paneMap[activeScope]" ref="activePaneRef" v-bind="paneProps" />
  </div>
</template>
