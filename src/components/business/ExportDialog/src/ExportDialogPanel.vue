<script lang="ts" setup>
import type { ExportScope } from '@/api/common';
import { EXPORT_MAX_ROWS } from '@/api/common';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ExportDialogFormState, ExportDialogPanelExpose, ExportDialogPanelProps } from './types';

defineOptions({ name: 'ExportDialogPanel' });

const props = withDefaults(defineProps<ExportDialogPanelProps>(), {
  maxExportRows: EXPORT_MAX_ROWS,
});

const { t } = useI18n();
const formRef = ref<FormInstance>();

const form = reactive({
  exportScope: 'CURRENT_PAGE' as ExportScope,
  fromPage: props.currentPage,
  toPage: props.currentPage,
});

const maxPage = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const estimatedRowCount = computed(() => {
  if (form.exportScope !== 'PAGE_RANGE') {
    return props.pageSize;
  }
  return (form.toPage - form.fromPage + 1) * props.pageSize;
});
const rowLimitExceeded = computed(() => estimatedRowCount.value > props.maxExportRows);
const currentPageSummary = computed(() =>
  t('export.currentPageSummary', { page: props.currentPage, size: props.pageSize })
);
const estimatedRowsHint = computed(() =>
  t('export.estimatedRows', { count: estimatedRowCount.value, max: props.maxExportRows })
);

const rules = computed<FormRules>(() => ({
  fromPage: [
    {
      validator: (_rule, value: number, callback) => {
        if (form.exportScope !== 'PAGE_RANGE') {
          callback();
          return;
        }
        if (value < 1 || value > maxPage.value) {
          callback(new Error(t('export.pageRangeInvalid')));
          return;
        }
        callback();
      },
      trigger: 'change',
    },
  ],
  toPage: [
    {
      validator: (_rule, value: number, callback) => {
        if (form.exportScope !== 'PAGE_RANGE') {
          callback();
          return;
        }
        if (value < form.fromPage || value > maxPage.value) {
          callback(new Error(t('export.pageRangeInvalid')));
          return;
        }
        if (rowLimitExceeded.value) {
          callback(new Error(t('export.rowLimitExceeded', { max: props.maxExportRows })));
          return;
        }
        callback();
      },
      trigger: 'change',
    },
  ],
}));

watch(
  () => props.currentPage,
  (page) => {
    form.fromPage = page;
    form.toPage = page;
  },
  { immediate: true }
);

/**
 * 校验导出表单
 * @returns 校验通过为 `true`
 */
const validate = async (): Promise<boolean> => {
  if (form.exportScope === 'FULL_ASYNC') {
    return false;
  }
  if (form.exportScope === 'CURRENT_PAGE' && props.pageSize > props.maxExportRows) {
    return false;
  }
  if (form.exportScope === 'PAGE_RANGE' && rowLimitExceeded.value) {
    return false;
  }
  const formInstance = formRef.value;
  if (!formInstance) {
    return false;
  }
  return formInstance.validate().catch(() => false);
};

/**
 * 读取当前表单状态
 * @returns 导出范围与页码区间
 */
const getFormState = (): ExportDialogFormState => ({
  exportScope: form.exportScope,
  fromPage: form.fromPage,
  toPage: form.toPage,
});

defineExpose<ExportDialogPanelExpose>({ validate, getFormState });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
    <!-- 导出方式 -->
    <el-form-item :label="t('export.scopeLabel')">
      <el-radio-group v-model="form.exportScope">
        <!-- 当前页 -->
        <el-radio value="CURRENT_PAGE">{{ t('export.scopeCurrentPage') }}</el-radio>
        <!-- 指定页码范围 -->
        <el-radio value="PAGE_RANGE">{{ t('export.scopePageRange') }}</el-radio>
        <!-- 全量异步（预留，提示文案未开发功能暂不走 i18n） -->
        <el-tooltip content="敬请期待，全量异步导出将在后续版本提供" placement="top">
          <span>
            <el-radio disabled value="FULL_ASYNC">{{ t('export.scopeFullAsync') }}</el-radio>
          </span>
        </el-tooltip>
      </el-radio-group>
    </el-form-item>

    <!-- 当前页说明 -->
    <p v-if="form.exportScope === 'CURRENT_PAGE'">
      {{ currentPageSummary }}
    </p>

    <!-- 页码区间 -->
    <template v-if="form.exportScope === 'PAGE_RANGE'">
      <!-- 起始页 -->
      <el-form-item :label="t('export.fromPage')" prop="fromPage">
        <el-input-number v-model="form.fromPage" :max="maxPage" :min="1" />
      </el-form-item>
      <!-- 结束页 -->
      <el-form-item :label="t('export.toPage')" prop="toPage">
        <el-input-number v-model="form.toPage" :max="maxPage" :min="1" />
      </el-form-item>
      <p>{{ estimatedRowsHint }}</p>
    </template>
  </el-form>
</template>
