<script lang="tsx" setup>
import { getMessageTemplateById, type MessageTemplateDetailVO } from '@/api/message/message-template';
import ReDescription from '@/components/ui/Description';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { errorMessage } from '@/services/feedback/message';
import { IN_APP_TEMPLATE_CHANNEL } from '@/views/message/in-app-template/constants/channel';
import {
  type InAppContentTypeCode,
  resolveInAppContentType,
} from '@/views/message/in-app-template/constants/content-type';
import MarkdownIt from 'markdown-it';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

/** 详情：仅主键，组件内按 IN_APP 渠道拉取；HTML 消毒由后端完成，前端只按类型展示 */
interface InAppTemplateDetailDialogProps {
  id: string;
}

const props = defineProps<InAppTemplateDetailDialogProps>();
const { t } = useI18n();

/** Markdown 渲染：关闭原生 HTML 透传，避免前端二次消毒需求 */
const markdownRenderer = new MarkdownIt({ html: false, linkify: true, breaks: true });

const loading = ref(false);
const detail = ref<MessageTemplateDetailVO | null>(null);
const previewFrameRef = ref<HTMLIFrameElement | null>(null);

const contentType = computed<InAppContentTypeCode>(() => resolveInAppContentType(detail.value?.imMessageType));

const columns = computed(() => [
  { label: t('inAppTemplate.templateCode'), prop: 'templateCode', labelWidth: 140, copy: true },
  { label: t('inAppTemplate.templateName'), prop: 'templateName', labelWidth: 140, copy: true },
  { label: t('inAppTemplate.subject'), prop: 'subject', labelWidth: 140, copy: true, span: 2 },
  { label: t('inAppTemplate.description'), prop: 'description', labelWidth: 140, copy: true, span: 2 },
  { label: t('inAppTemplate.contentType'), prop: 'imMessageType', labelWidth: 140, copy: true },
  { label: t('inAppTemplate.priority'), prop: 'priority', labelWidth: 140, copy: true },
  {
    label: t('inAppTemplate.status'),
    prop: 'status',
    labelWidth: 140,
    cellRenderer: ({ value }: { value: boolean }) => renderBooleanStatusTag(value),
  },
  {
    label: t('messageTemplate.requireFieldsJson'),
    prop: 'requireFields',
    labelWidth: 140,
    span: 2,
    cellRenderer: ({ value }: { value: unknown }) => (
      <span class="whitespace-pre-wrap break-all text-left">{JSON.stringify(value ?? [])}</span>
    ),
  },
]);

/** 预览 HTML：HTML 用后端已消毒正文；MARKDOWN 本地转 HTML；TEXT 为空（走纯文本区） */
const previewHtml = computed(() => {
  const content = detail.value?.content ?? '';
  switch (contentType.value) {
    case 'HTML':
      return content;
    case 'MARKDOWN':
      return markdownRenderer.render(content);
    case 'TEXT':
    default:
      return '';
  }
});

/**
 * 加载站内信模板详情（后端已对 HTML 消毒）
 */
const onLoadData = async () => {
  loading.value = true;
  try {
    detail.value = await getMessageTemplateById(props.id, IN_APP_TEMPLATE_CHANNEL);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'inAppTemplate.loadFailed' });
  } finally {
    loading.value = false;
  }
};

watch(
  previewHtml,
  async (html) => {
    await nextTick();
    if (previewFrameRef.value) {
      previewFrameRef.value.srcdoc = html;
    }
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

    <!-- 正文按类型展示：消毒仅后端负责 -->
    <div class="mt-4 text-sm font-medium mb-2">{{ t('inAppTemplate.content') }}</div>
    <div
      v-if="contentType === 'TEXT'"
      class="border border-(--el-border-color) rounded p-3 whitespace-pre-wrap break-all text-left bg-(--el-fill-color-blank)"
    >
      {{ detail?.content ?? '' }}
    </div>
    <div v-else class="border border-(--el-border-color) overflow-auto rounded bg-(--el-fill-color-blank)">
      <iframe
        ref="previewFrameRef"
        class="w-full h-105 border-0 block"
        sandbox="allow-same-origin"
        title="in-app-template-content-preview"
      />
    </div>
  </div>
</template>
