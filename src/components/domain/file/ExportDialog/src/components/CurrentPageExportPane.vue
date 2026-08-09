<script lang="ts" setup>
import { message } from '@/services/feedback/message';
import { useI18n } from 'vue-i18n';
import { DEFAULT_MAX_EXPORT_ROWS } from '../constants';
import type { ExportDialogFormState, ExportPaneExpose } from '../types';

defineOptions({ name: 'CurrentPageExportPane' });

const props = withDefaults(
  defineProps<{
    currentPage: number;
    pageSize: number;
    maxExportRows?: number;
  }>(),
  {
    maxExportRows: DEFAULT_MAX_EXPORT_ROWS,
  }
);

const { t } = useI18n();

/**
 * 校验当前页导出是否超出行数上限
 * @returns 校验通过为 `true`
 */
const validate = async (): Promise<boolean> => {
  if (props.pageSize > props.maxExportRows) {
    message(t('fileExportDialog.rowLimitExceeded', { max: props.maxExportRows }));
    return false;
  }
  return true;
};

/**
 * 读取当前页导出表单状态
 * @returns 导出范围（当前页）
 */
const getFormState = (): ExportDialogFormState => ({
  exportScope: 'CURRENT_PAGE',
  fromPage: props.currentPage,
  toPage: props.currentPage,
});

defineExpose<ExportPaneExpose>({ validate, getFormState });
</script>

<template>
  <p>{{ t('fileExportDialog.currentPageSummary', { page: currentPage, size: pageSize }) }}</p>
</template>
