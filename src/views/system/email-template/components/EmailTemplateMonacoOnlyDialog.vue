<script lang="ts" setup>
import { type EmailTemplateFormModel, renderEmailTemplate } from '@/api/system/email-template';
import type { FormInstance, FormRules } from 'element-plus';
import debounce from 'lodash/debounce';
import { nextTick, onUnmounted, reactive, ref, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { CodeEditor } from 'monaco-editor-vue3';
import { MONACO_COMMON_EDITOR_OPTIONS } from '@/views/system/email-template/config/monaco-config';
import { registerEmailTemplateMonaco } from '@/views/system/email-template/monaco/register-email-template-monaco';
import * as monaco from 'monaco-editor';

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
const form = ref<EmailTemplateFormModel>(props.formInline as EmailTemplateFormModel);

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

// 调整预览 iframe 高度
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

// watch(
//   () => props.formInline,
//   (value) => {
//     // if (v && Object.keys(v).length > 0) {
//     //   form.value = {
//     //     ...defaultForm(),
//     //     ...v,
//     //     requireFields: cloneRequireFields(v.requireFields),
//     //   };
//     // }
//
//     // scheduleRender();
//     console.log(value);
//   },
//   { deep: true, flush: 'post' }
// );

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

const onMonacoReady = (editor) => {
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
