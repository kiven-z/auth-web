<script lang="tsx" setup>
import { getMessageTemplateById, type MessageTemplateDetailVO } from '@/api/message/message-template';
import ReDescription from '@/components/ui/Description';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { errorMessage } from '@/services/feedback/message';
import MessageTemplateContentView from '@/views/message/_shared/components/MessageTemplateContentView.vue';
import type { MessageTemplateContentTypeCode } from '@/views/message/_shared/constants/content-type';
import { SMS_TEMPLATE_CHANNEL } from '@/views/message/sms-template/constants/channel';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 详情：元信息 + 按示例值渲染后的正文 */
interface SmsTemplateDetailDialogProps {
  id: string;
}

const props = defineProps<SmsTemplateDetailDialogProps>();
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
  { label: t('smsTemplate.templateCode'), prop: 'templateCode', labelWidth: 140, copy: true },
  { label: t('smsTemplate.templateName'), prop: 'templateName', labelWidth: 140, copy: true },
  {
    label: t('smsTemplate.providerTemplateCode'),
    prop: 'providerTemplateCode',
    labelWidth: 140,
    copy: true,
    span: 2,
  },
  { label: t('smsTemplate.description'), prop: 'description', labelWidth: 140, copy: true, span: 2 },
  { label: t('smsTemplate.priority'), prop: 'priority', labelWidth: 140, copy: true },
  {
    label: t('smsTemplate.status'),
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

/**
 * 加载详情
 */
const onLoadData = async () => {
  loading.value = true;
  try {
    detail.value = await getMessageTemplateById(props.id, SMS_TEMPLATE_CHANNEL);
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'smsTemplate.loadFailed' });
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

    <!-- 正文：按示例值渲染后的纯文本 -->
    <div class="mt-4 mb-2 text-sm font-medium">{{ t('smsTemplate.content') }}</div>
    <el-alert :closable="false" :title="t('messageTemplate.previewTips')" class="mb-3" type="info" />
    <MessageTemplateContentView :content="detail?.previewContent" :content-type="renderedContentType" />
  </div>
</template>
