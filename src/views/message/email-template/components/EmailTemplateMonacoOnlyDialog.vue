<script lang="ts" setup>
import type { FormDialog } from '@/api/common';
import { type EmailTemplateMonacoFormModel, renderEmailTemplate } from '@/api/system/email-template';
import { MONACO_COMMON_EDITOR_OPTIONS } from '@/views/message/email-template/config/monaco-config';
import { registerEmailTemplateMonaco } from '@/views/message/email-template/monaco/register-email-template-monaco';
import type { FormInstance, FormRules } from 'element-plus';
import debounce from 'lodash/debounce';
import type { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import { CodeEditor } from 'monaco-editor-vue3';
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'EmailTemplateMonacoOnlyDialog',
});

const props = withDefaults(defineProps<FormDialog<EmailTemplateMonacoFormModel>>(), {
  form: () => ({}) as EmailTemplateMonacoFormModel,
});

const { t } = useI18n();

const formRef = ref<FormInstance>();

const form = ref<EmailTemplateMonacoFormModel>({
  status: true,
  priority: 5,
  content: '',
  requireFields: [],
  ...props.form,
});

watch(
  () => props.form,
  (formPayload) => {
    form.value = {
      status: true,
      priority: 5,
      requireFields: [],
      ...formPayload,
    };
    scheduleRender();
  },
  { deep: true }
);

const rules = reactive<FormRules>({
  // 内容
  content: [{ required: true, message: t('emailTemplate.placeholder.content'), trigger: 'blur' }],
});

let refreshMonacoMarkers: (() => void) | null = null;
let disposeMonacoRegistration: (() => void) | null = null;

// 渲染后的 HTML
const renderedHtml = ref('');
// 预览 iframe 引用
const previewFrameRef = ref<HTMLIFrameElement | null>(null);
// 预览高度
const previewHeight = ref(320);
// 预览最小高度
const PREVIEW_MIN_HEIGHT = 360;
// 预览最大高度
const PREVIEW_MAX_HEIGHT = 560;

/**
 * 调整预览 iframe 高度
 * @param frame - 预览 iframe 元素
 */
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

/**
 * 监听表单数据变化
 */
watch(
  () => form.value.content,
  () => {
    scheduleRender();
  }
);

/**
 * 监听渲染后的 HTML 变化
 */
watch(
  () => renderedHtml.value,
  async (html) => {
    await nextTick();
    const frame = previewFrameRef.value;
    if (!frame) return;
    frame.srcdoc = html;

    // 调整预览框高度
    requestAnimationFrame(() => {
      resizePreviewFrame(frame);
    });
  },
  { immediate: true }
);

/**
 * 当 Monaco 编辑器准备就绪时调用
 * @param editor - Monaco 编辑器实例
 */
const onMonacoReady = (editor: editor.IStandaloneCodeEditor) => {
  disposeMonacoRegistration?.();
  const reg = registerEmailTemplateMonaco(editor, monaco, () => form.value.requireFields ?? []);
  disposeMonacoRegistration = reg.dispose;
  refreshMonacoMarkers = reg.refreshMarkers;
};

onMounted(() => {
  scheduleRender();
  refreshMonacoMarkers?.();
});

onUnmounted(() => {
  disposeMonacoRegistration?.();
  disposeMonacoRegistration = null;
  refreshMonacoMarkers = null;
  scheduleRender.cancel();
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules">
    <el-row :gutter="16">
      <el-col :lg="14" :md="14" :sm="24" :xs="24">
        <div class="mb-2">{{ t('emailTemplate.content') }}</div>
        <el-form-item prop="content">
          <CodeEditor
            v-model:value="form.content"
            :options="MONACO_COMMON_EDITOR_OPTIONS"
            class="min-h-[65vh] border"
            language="html"
            theme="vs"
            @editor-did-mount="onMonacoReady"
          />
        </el-form-item>
      </el-col>

      <el-col :lg="10" :md="10" :sm="24" :xs="24">
        <div class="font-medium mb-2">{{ t('emailTemplate.liveRenderPreview') }}</div>
        <div class="border p-3 overflow-auto">
          <iframe
            ref="previewFrameRef"
            class="w-full min-h-[62vh] border-0 block"
            sandbox="allow-scripts"
            title="email-template-monaco-preview"
            @load="resizePreviewFrame(previewFrameRef)"
          />
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>
