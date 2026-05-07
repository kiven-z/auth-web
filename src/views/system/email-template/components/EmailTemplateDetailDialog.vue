<script lang="tsx" setup>
import {
  getEmailTemplateById,
  getEmailTemplatePreviewHtml,
  type EmailTemplateDetailVO,
} from '@/api/system/email-template';
import ReDescription from '@/components/ui/Description/index';
import { ElTag } from 'element-plus';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  /** 模板 ID */
  id: string;
}

const props = defineProps<Props>();
const { t } = useI18n();

const loading = ref(false);
const previewFrameRef = ref<HTMLIFrameElement | null>(null);
const detail = ref<EmailTemplateDetailVO[]>([]);
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
    cellRenderer: ({ value }: { value: number }) =>
      value === 1 ? (
        <ElTag type="success">{t('emailTemplate.statusEnabled')}</ElTag>
      ) : (
        <ElTag type="danger">{t('emailTemplate.statusDisabled')}</ElTag>
      ),
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

const onLoadData = async () => {
  loading.value = true;
  try {
    const response = await getEmailTemplateById(props.id);
    detail.value = [response];
    renderedHtml.value = await getEmailTemplatePreviewHtml(props.id);
  } finally {
    loading.value = false;
  }
};

watch(
  () => renderedHtml.value,
  async (html) => {
    await nextTick();
    applyPreviewToIframe(html);
  },
  { immediate: true }
);

function applyPreviewToIframe(html: string) {
  const el = previewFrameRef.value;
  if (!el) return;
  el.srcdoc = html;
}

onMounted(() => {
  onLoadData();
});
</script>

<template>
  <div v-loading="loading">
    <ReDescription :column="2" :columns="columns" :data="detail" border />
    <div class="text-sm font-medium mb-2">{{ t('emailTemplate.renderedEffect') }}</div>
    <div class="border border-(--el-border-color) overflow-auto rounded bg-(--el-fill-color-blank)">
      <iframe
        ref="previewFrameRef"
        class="w-full h-[420px] border-0 block"
        title="email-template-preview"
        sandbox="allow-same-origin"
      />
    </div>
  </div>
</template>
