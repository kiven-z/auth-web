<!--
  仅编辑模板 HTML：Monaco + 实时预览（iframe 隔离与自适应高度）。
-->
<script lang="ts" setup>
import { renderEmailTemplate, type EmailTemplateFormModel } from '@/api/system/email-template';
import MonacoEditor, { type MonacoEditorReadyPayload } from '@/components/ui/MonacoEditor';
import { EMAIL_TEMPLATE_EDITOR_OPTIONS } from '@/views/system/email-template/config/monaco-config';
import { registerEmailTemplateMonaco } from '@/views/system/email-template/monaco/register-email-template-monaco';
import type { FormInstance, FormRules } from 'element-plus';
import debounce from 'lodash/debounce';
import { nextTick, onUnmounted, reactive, ref, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const defaultForm = (): EmailTemplateFormModel => ({
  id: undefined,
  templateCode: '',
  templateName: '',
  subject: '',
  description: '',
  status: true,
  priority: 5,
  content: '',
  requireFields: [],
});

const props = withDefaults(
  defineProps<{
    formInline?: Partial<EmailTemplateFormModel>;
  }>(),
  {
    formInline: () => ({}),
  }
);

const { t } = useI18n();

function cloneRequireFields(
  rows: EmailTemplateFormModel['requireFields'] | undefined
): EmailTemplateFormModel['requireFields'] {
  if (!rows?.length) return [];
  return rows.map((r) => ({
    key: r.key,
    description: r.description,
    exampleValue: toRaw(r.exampleValue),
  }));
}

const formRef = ref<FormInstance>();
const form = ref<EmailTemplateFormModel>({
  ...defaultForm(),
  ...props.formInline,
  requireFields: cloneRequireFields(props.formInline?.requireFields),
});

const rules = reactive<FormRules>({
  content: [{ required: true, message: t('emailTemplate.placeholder.content'), trigger: 'blur' }],
});

let refreshMonacoMarkers: (() => void) | null = null;
let disposeMonacoRegistration: (() => void) | null = null;

const renderedHtml = ref('');
const previewFrameRef = ref<HTMLIFrameElement | null>(null);
const previewHeight = ref(320);

const PREVIEW_MIN_HEIGHT = 220;
const PREVIEW_MAX_HEIGHT = 560;

const resizePreviewFrame = (frame: HTMLIFrameElement | null) => {
  if (!frame) return;
  const doc = frame.contentDocument;
  if (!doc) return;
  const nextHeight = Math.max(doc.body?.scrollHeight ?? 0, doc.documentElement?.scrollHeight ?? 0);
  previewHeight.value = Math.min(PREVIEW_MAX_HEIGHT, Math.max(PREVIEW_MIN_HEIGHT, nextHeight));
};

const scheduleRender = debounce(async () => {
  try {
    renderedHtml.value = await renderEmailTemplate({
      content: form.value.content ?? '',
      requireFields: form.value.requireFields ?? [],
    });
  } catch {
    renderedHtml.value = '';
  }
}, 400);

watch(
  () => form.value.content,
  () => {
    scheduleRender();
  }
);

watch(
  () => form.value.requireFields,
  () => {
    scheduleRender();
    refreshMonacoMarkers?.();
  },
  { deep: true }
);

watch(
  () => props.formInline,
  (v) => {
    if (v && Object.keys(v).length > 0) {
      form.value = {
        ...defaultForm(),
        ...v,
        requireFields: cloneRequireFields(v.requireFields),
      };
      scheduleRender();
    }
  },
  { deep: true, flush: 'post' }
);

watch(
  () => renderedHtml.value,
  async (html) => {
    await nextTick();
    const frame = previewFrameRef.value;
    if (!frame) return;
    frame.srcdoc = html;
    requestAnimationFrame(() => {
      resizePreviewFrame(frame);
    });
  },
  { immediate: true }
);

const onMonacoReady = ({ editor, monaco }: MonacoEditorReadyPayload) => {
  disposeMonacoRegistration?.();
  const reg = registerEmailTemplateMonaco(editor, monaco, () => form.value.requireFields ?? []);
  disposeMonacoRegistration = reg.dispose;
  refreshMonacoMarkers = reg.refreshMarkers;
};

onUnmounted(() => {
  disposeMonacoRegistration?.();
  disposeMonacoRegistration = null;
  refreshMonacoMarkers = null;
  scheduleRender.cancel();
});

scheduleRender();

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" class="monaco-only-form">
    <el-row :gutter="16" class="min-h-[62vh]">
      <el-col :lg="14" :md="14" :sm="24" :xs="24">
        <div class="text-sm font-medium mb-2">{{ t('emailTemplate.content') }}</div>
        <el-form-item class="mb-0!" prop="content">
          <MonacoEditor
            v-model="form.content"
            class="w-full monaco-only-editor border border-(--el-border-color) rounded overflow-hidden shadow-sm"
            height="min(62vh, 560px)"
            language="html"
            :options="EMAIL_TEMPLATE_EDITOR_OPTIONS"
            @ready="onMonacoReady"
          />
        </el-form-item>
      </el-col>

      <el-col :lg="10" :md="10" :sm="24" :xs="24">
        <div class="text-sm font-medium mb-2">{{ t('emailTemplate.liveRenderPreview') }}</div>
        <div
          class="monaco-only-preview border border-(--el-border-color) rounded p-3 overflow-auto bg-(--el-fill-color-blank)"
        >
          <iframe
            ref="previewFrameRef"
            class="w-full border-0 block"
            sandbox="allow-same-origin"
            title="email-template-monaco-preview"
            :style="{ height: `${previewHeight}px` }"
            @load="resizePreviewFrame(previewFrameRef)"
          />
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped>
.monaco-only-preview {
  height: min(62vh, 560px);
}

.monaco-only-form :deep(.el-form-item__content) {
  margin-left: 0 !important;
}
</style>
