<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { DEFAULT_MAX_EXPORT_ROWS } from '../constants';
import type { ExportDialogFormState, ExportPaneExpose } from '../types';

defineOptions({ name: 'PageRangeExportPane' });

const props = withDefaults(
  defineProps<{
    currentPage: number;
    pageSize: number;
    total: number;
    maxExportRows?: number;
  }>(),
  {
    maxExportRows: DEFAULT_MAX_EXPORT_ROWS,
  }
);

const { t } = useI18n();
const formRef = ref<FormInstance>();

const form = reactive({
  fromPage: props.currentPage,
  toPage: props.currentPage,
});

const maxPage = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const estimatedRowCount = computed(() => (form.toPage - form.fromPage + 1) * props.pageSize);
const rowLimitExceeded = computed(() => estimatedRowCount.value > props.maxExportRows);

const rules = computed<FormRules>(() => ({
  toPage: [
    {
      validator: (_rule, value: number, callback) => {
        if (value < form.fromPage) {
          callback(new Error(t('fileExportDialog.pageRangeInvalid')));
          return;
        }
        if (rowLimitExceeded.value) {
          callback(new Error(t('fileExportDialog.rowLimitExceeded', { max: props.maxExportRows })));
          return;
        }
        callback();
      },
      trigger: 'change',
    },
  ],
}));

/**
 * 校验页码区间表单
 * @returns 校验通过为 `true`
 */
const validate = async (): Promise<boolean> => {
  const formInstance = formRef.value;
  if (!formInstance) {
    return false;
  }
  return formInstance.validate().catch(() => false);
};

/**
 * 读取页码区间导出表单状态
 * @returns 导出范围与页码区间
 */
const getFormState = (): ExportDialogFormState => ({
  exportScope: 'PAGE_RANGE',
  fromPage: form.fromPage,
  toPage: form.toPage,
});

defineExpose<ExportPaneExpose>({ validate, getFormState });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules">
    <div class="page-range-row">
      <el-form-item :label="t('fileExportDialog.fromPage')" prop="fromPage">
        <el-input-number v-model="form.fromPage" :max="maxPage" :min="1" controls-position="right" />
      </el-form-item>
      <el-form-item :label="t('fileExportDialog.toPage')" prop="toPage">
        <el-input-number v-model="form.toPage" :max="maxPage" :min="1" controls-position="right" />
      </el-form-item>
    </div>

    <el-text truncated type="info">
      {{ t('fileExportDialog.estimatedRows', { count: estimatedRowCount, max: maxExportRows }) }}
    </el-text>
  </el-form>
</template>
