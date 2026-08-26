<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ExportPreCheckResult } from '@/features/file/api/models/export-precheck';
import resolvePreCheckView from './resolvePreCheckView';
import type { ExportPreCheckView } from './types';

defineOptions({
  name: 'ExportPreCheckDialog',
});

const props = defineProps<{
  /** 弹窗打开后执行前置检查 */
  runPreCheck: () => Promise<ExportPreCheckResult>;
}>();

const emit = defineEmits<{
  result: [result: ExportPreCheckResult];
  failed: [error: unknown];
}>();

const { t } = useI18n();
const result = ref<ExportPreCheckResult | null>(null);

const view = computed<ExportPreCheckView | null>(() => {
  const current = result.value;
  if (!current) {
    return null;
  }
  return resolvePreCheckView(current, t);
});

onMounted(async () => {
  try {
    const data = await props.runPreCheck();
    result.value = data;
    emit('result', data);
  } catch (error: unknown) {
    emit('failed', error);
  }
});
</script>

<template>
  <div class="export-pre-check-dialog min-h-40 p-2">
    <el-result v-if="view" :icon="view.icon" :sub-title="view.sub" :title="view.title" />
    <el-result v-else :title="t('fileExport.checking')" icon="info" />
  </div>
</template>
