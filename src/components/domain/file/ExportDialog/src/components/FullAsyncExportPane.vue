<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { ExportDialogFormState, ExportPaneExpose } from '../types';

defineOptions({ name: 'FullAsyncExportPane' });

const props = defineProps<{
  currentPage: number;
}>();

const { t } = useI18n();

/**
 * 异步导出无表单项，直接通过
 * @returns `true`
 */
const validate = async (): Promise<boolean> => true;

/**
 * 读取异步导出表单状态
 * @returns 导出范围（异步）
 */
const getFormState = (): ExportDialogFormState => ({
  exportScope: 'FULL_ASYNC',
  fromPage: props.currentPage,
  toPage: props.currentPage,
});

defineExpose<ExportPaneExpose>({ validate, getFormState });
</script>

<template>
  <ul class="async-points">
    <li>{{ t('fileExportDialog.asyncPoints.filter') }}</li>
    <li>{{ t('fileExportDialog.asyncPoints.delivery') }}</li>
  </ul>
</template>

<style scoped>
.async-points {
  padding-left: 1.25em;
  margin: 0;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}
</style>
