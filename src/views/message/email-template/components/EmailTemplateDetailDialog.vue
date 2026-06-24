<script lang="tsx" setup>
import {
  type EmailTemplateDetailVO,
  getEmailTemplateById,
  getEmailTemplatePreviewHtml,
} from '@/api/system/email-template';
import ReDescription from '@/components/ui/Description';
import { renderBooleanStatusTag } from '@/composables/layout/renderBooleanStatusTag';
import { errorMessage } from '@/ui/feedback/message';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

/** 详情 + 预览：仅主键，组件内拉取接口 */
interface EmailTemplateDetailDialogProps {
  id: string;
}

const props = defineProps<EmailTemplateDetailDialogProps>();
const { t } = useI18n();

const loading = ref(false);

// 预览 iframe 引用
const previewFrameRef = ref<HTMLIFrameElement | null>(null);
// 详情数据
const detail = ref<EmailTemplateDetailVO | null>(null);
// 渲染后的 HTML
const renderedHtml = ref('');

const columns = computed(() => [
  { label: t('emailTemplate.templateCode'), prop: 'templateCode', labelWidth: 120, copy: true },
  { label: t('emailTemplate.templateName'), prop: 'templateName', labelWidth: 120, copy: true },
  { label: t('emailTemplate.subject'), prop: 'subject', labelWidth: 120, copy: true, span: 2 },
  { label: t('emailTemplate.description'), prop: 'description', labelWidth: 120, copy: true, span: 2 },
  { label: t('emailTemplate.priority'), prop: 'priority', labelWidth: 120, copy: true },
  {
    label: t('emailTemplate.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderBooleanStatusTag(value),
  },
  {
    label: t('emailTemplate.requireFieldsJson'),
    prop: 'requireFields',
    labelWidth: 120,
    span: 2,
    cellRenderer: ({ value }: { value: unknown }) => (
      <span class="whitespace-pre-wrap break-all text-left">{JSON.stringify(value ?? [])}</span>
    ),
  },
]);

/**
 * 加载数据
 * @returns 加载数据后，更新详情数据、渲染后的 HTML
 */
const onLoadData = async () => {
  loading.value = true;
  try {
    detail.value = await getEmailTemplateById(props.id);
    renderedHtml.value = await getEmailTemplatePreviewHtml(props.id);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
  } finally {
    loading.value = false;
  }
};

/**
 * 监听渲染后的 HTML 变化，更新 iframe 的 srcdoc
 * @param html 渲染后的 HTML
 */
watch(
  () => renderedHtml.value,
  async (html) => {
    await nextTick();
    const el = previewFrameRef.value;
    if (!el) return;
    el.srcdoc = html;
  },
  { immediate: true }
);

onMounted(() => {
  onLoadData();
});
</script>

<template>
  <div v-loading="loading">
    <ReDescription :column="2" :columns="columns" :data="detail ? [detail] : []" border />

    <div class="text-sm font-medium mb-2">{{ t('emailTemplate.renderedEffect') }}</div>
    <div class="border border-(--el-border-color) overflow-auto rounded bg-(--el-fill-color-blank)">
      <iframe
        ref="previewFrameRef"
        class="w-full h-105 border-0 block"
        sandbox="allow-same-origin"
        title="email-template-preview"
      />
    </div>
  </div>
</template>
