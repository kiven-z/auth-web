<script lang="tsx" setup>
import { getMessageTemplateById, type MessageTemplateDetailVO } from '@/api/message/message-template';
import ReDescription from '@/components/ui/Description';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import { errorMessage } from '@/services/feedback/message';
import { IN_APP_TEMPLATE_CHANNEL } from '@/views/message/in-app-template/constants/channel';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 详情：仅主键，组件内按 IN_APP 渠道拉取接口 */
interface InAppTemplateDetailDialogProps {
  id: string;
}

const props = defineProps<InAppTemplateDetailDialogProps>();
const { t } = useI18n();

const loading = ref(false);
const detail = ref<MessageTemplateDetailVO | null>(null);

const columns = computed(() => [
  { label: t('inAppTemplate.templateCode'), prop: 'templateCode', labelWidth: 140, copy: true },
  { label: t('inAppTemplate.templateName'), prop: 'templateName', labelWidth: 140, copy: true },
  { label: t('inAppTemplate.subject'), prop: 'subject', labelWidth: 140, copy: true, span: 2 },
  { label: t('inAppTemplate.description'), prop: 'description', labelWidth: 140, copy: true, span: 2 },
  { label: t('inAppTemplate.priority'), prop: 'priority', labelWidth: 140, copy: true },
  {
    label: t('inAppTemplate.status'),
    prop: 'status',
    labelWidth: 140,
    cellRenderer: ({ value }: { value: boolean }) => renderBooleanStatusTag(value),
  },
  {
    label: t('inAppTemplate.content'),
    prop: 'content',
    labelWidth: 140,
    span: 2,
    cellRenderer: ({ value }: { value: unknown }) => (
      <span class="whitespace-pre-wrap break-all text-left">{String(value ?? '')}</span>
    ),
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
 * 加载站内信模板详情
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

onMounted(() => {
  onLoadData();
});
</script>

<template>
  <div v-loading="loading">
    <ReDescription :column="2" :columns="columns" :data="detail ? [detail] : []" border />
  </div>
</template>
