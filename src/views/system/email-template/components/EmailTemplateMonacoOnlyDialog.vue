<!--
  仅编辑模板 HTML：Monaco（动态加载）+ 实时预览；不使用 monaco-editor-vue3，避免 Vite 预构建整包失败。
-->
<script lang="ts" setup>
import { renderEmailTemplate, type EmailTemplateFormModel } from '@/api/system/email-template';
import { EMAIL_TEMPLATE_EDITOR_OPTIONS } from '@/views/system/email-template/config/monaco-config';
import type { FormInstance, FormRules } from 'element-plus';
import debounce from 'lodash/debounce';
import type { editor } from 'monaco-editor';
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

const editorHostRef = ref<HTMLElement | null>(null);
let standaloneEditor: editor.IStandaloneCodeEditor | null = null;
let editorContentDisposable: { dispose: () => void } | null = null;
let refreshMonacoMarkers: (() => void) | null = null;
let disposeMonacoRegistration: (() => void) | null = null;
let syncingFromEditor = false;

const renderedHtml = ref('');
const previewFrameRef = ref<HTMLIFrameElement | null>(null);

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
  (v) => {
    scheduleRender();
    if (!standaloneEditor || syncingFromEditor) return;
    const cur = standaloneEditor.getValue();
    if (cur !== (v ?? '')) {
      standaloneEditor.setValue(v ?? '');
    }
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
  },
  { immediate: true }
);

/**
 * 动态加载 monaco 并创建编辑器（仅本弹窗挂载时执行）
 */
async function mountMonacoEditor() {
  await nextTick();
  const host = editorHostRef.value;
  if (!host || standaloneEditor) return;

  /** 动态 import，避免静态引入 monaco 大包。 */
  const [{ loadMonacoEditor }, { registerEmailTemplateMonaco }] = await Promise.all([
    import('@/views/system/email-template/monaco/bootstrap'),
    import('@/views/system/email-template/monaco/register-email-template-monaco'),
  ]);

  const monacoApi = await loadMonacoEditor();
  standaloneEditor = monacoApi.editor.create(host, {
    ...EMAIL_TEMPLATE_EDITOR_OPTIONS,
    value: form.value.content ?? '',
  });

  const reg = registerEmailTemplateMonaco(standaloneEditor, monacoApi, () => form.value.requireFields ?? []);
  disposeMonacoRegistration = reg.dispose;
  refreshMonacoMarkers = reg.refreshMarkers;

  editorContentDisposable = standaloneEditor.onDidChangeModelContent(() => {
    syncingFromEditor = true;
    try {
      form.value.content = standaloneEditor!.getValue();
    } finally {
      queueMicrotask(() => {
        syncingFromEditor = false;
      });
    }
  });
}

onUnmounted(() => {
  disposeMonacoRegistration?.();
  disposeMonacoRegistration = null;
  refreshMonacoMarkers = null;
  editorContentDisposable?.dispose();
  editorContentDisposable = null;
  standaloneEditor?.dispose();
  standaloneEditor = null;
  scheduleRender.cancel();
});

void mountMonacoEditor();

scheduleRender();

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" class="monaco-only-form">
    <el-row :gutter="16" class="min-h-[62vh]">
      <el-col :lg="14" :md="14" :sm="24" :xs="24">
        <div class="text-sm font-medium mb-2">{{ t('emailTemplate.content') }}</div>
        <el-form-item class="mb-0!" prop="content">
          <div
            ref="editorHostRef"
            class="w-full monaco-only-editor border border-(--el-border-color) rounded overflow-hidden shadow-sm"
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
            class="w-full h-full border-0 block"
            sandbox="allow-same-origin"
            title="email-template-monaco-preview"
          />
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped>
.monaco-only-editor,
.monaco-only-preview {
  height: min(62vh, 560px);
}

.monaco-only-form :deep(.el-form-item__content) {
  margin-left: 0 !important;
}
</style>
