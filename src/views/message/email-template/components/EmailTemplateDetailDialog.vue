<script lang="tsx" setup>
import { getMessageTemplateById, type MessageTemplateDetailVO } from '@/api/message/message-template';
import ReDescription from '@/components/ui/Description';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { errorMessage } from '@/services/feedback/message';
import MessageTemplateContentView from '@/views/message/_shared/components/MessageTemplateContentView.vue';
import type { MessageTemplateContentTypeCode } from '@/views/message/_shared/constants/content-type';
import { EMAIL_TEMPLATE_CHANNEL } from '@/views/message/email-template/constants/channel';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 详情：元信息 + 按示例值渲染后的正文 */
interface EmailTemplateDetailDialogProps {
  id: string;
}

const props = defineProps<EmailTemplateDetailDialogProps>();
const { t } = useI18n();

const loading = ref(false);
const detail = ref<MessageTemplateDetailVO | null>(null);

/** 空或未知按 TEXT */
const renderedContentType = computed<MessageTemplateContentTypeCode>(() => {
  const normalized = (detail.value?.contentType ?? '').trim().toUpperCase();
  if (normalized === 'MARKDOWN' || normalized === 'HTML') {
    return normalized;
  }
  return 'TEXT';
});

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
    label: t('messageTemplate.requireFieldsJson'),
    prop: 'requireFields',
    labelWidth: 120,
    span: 2,
    cellRenderer: ({ value }: { value: unknown }) => (
      <span class="whitespace-pre-wrap break-all text-left">{JSON.stringify(value ?? [])}</span>
    ),
  },
]);

/**
 * 加载详情（含示例值渲染预览）
 */
const onLoadData = async () => {
  loading.value = true;
  try {
    detail.value = await getMessageTemplateById(props.id, EMAIL_TEMPLATE_CHANNEL);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'emailTemplate.loadFailed' });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  onLoadData();
});
</script>

<template>
  <div v-loading="loading">
    <ReDescription :column="2" :columns="columns" :data="detail ? [detail] : []" border />

    <!-- 正文：按示例值 FreeMarker 渲染后展示 -->
    <div class="mb-2 mt-4 text-sm font-medium">{{ t('emailTemplate.content') }}</div>
    <el-alert :closable="false" :title="t('messageTemplate.previewTips')" class="mb-3" type="info" />
    <MessageTemplateContentView
      :content="detail?.previewContent"
      :content-type="renderedContentType"
      frame-title="email-template-rendered-content"
    />
  </div>
</template>
