<script lang="ts" setup>
import { renderEmailTemplate, type EmailTemplateFormModel } from '@/api/system/email-template';
import { registerEmailTemplateMonaco } from '@/views/system/email-template/hooks/useEmailTemplateMonaco';
import type { FormInstance, FormRules } from 'element-plus';
import { debounce } from 'lodash';
import type { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import { CodeEditor } from 'monaco-editor-vue3';
import { onUnmounted, reactive, ref, toRaw, watch } from 'vue';
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

/** 与 props 断开引用，避免深层响应式对象与 Monaco / 子组件形成循环触发 */
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

const editorOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
};

const renderedHtml = ref('');
let disposeMonaco: (() => void) | null = null;
let refreshMonacoMarkers: (() => void) | null = null;

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
  },
  { deep: true }
);

const onEditorDidMount = (ed: editor.IStandaloneCodeEditor) => {
  if (disposeMonaco) {
    disposeMonaco();
    disposeMonaco = null;
    refreshMonacoMarkers = null;
  }
  const reg = registerEmailTemplateMonaco(ed, monaco, () => form.value.requireFields ?? []);
  disposeMonaco = reg.dispose;
  refreshMonacoMarkers = reg.refreshMarkers;
};

watch(
  () => form.value.requireFields,
  () => {
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

onUnmounted(() => {
  disposeMonaco?.();
  disposeMonaco = null;
  refreshMonacoMarkers = null;
  scheduleRender.cancel();
});

scheduleRender();

defineExpose({ formRef, form });
</script>

<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" class="monaco-only-form">
      <el-row :gutter="16" class="min-h-[62vh]">
        <el-col :lg="14" :md="14" :sm="24" :xs="24">
          <div class="text-sm font-medium mb-2">{{ t('emailTemplate.content') }}</div>
          <el-form-item class="!mb-0" prop="content">
            <div
              class="w-full monaco-only-editor border border-[var(--el-border-color)] rounded overflow-hidden shadow-sm"
            >
              <CodeEditor
                v-model:value="form.content"
                :options="editorOptions"
                language="html"
                @editor-did-mount="onEditorDidMount"
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col :lg="10" :md="10" :sm="24" :xs="24">
          <div class="text-sm font-medium mb-2">{{ t('emailTemplate.liveRenderPreview') }}</div>
          <div
            class="monaco-only-preview border border-[var(--el-border-color)] rounded p-3 overflow-auto bg-[var(--el-fill-color-blank)]"
          >
            <div v-html="renderedHtml" />
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
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
