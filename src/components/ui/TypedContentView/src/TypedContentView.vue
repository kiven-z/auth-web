<script lang="ts" setup>
import { useEditorTheme } from '@/shared/composables/editor/useEditorTheme';
import { MD_PREVIEW_THEME } from '@/shared/constants/mdPreview';
import { MdPreview, type ExposePreviewParam } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { nextTick, ref, useId, watch } from 'vue';
import type { TypedContentViewProps } from './types';

defineOptions({
  name: 'TypedContentView',
});

const props = withDefaults(defineProps<TypedContentViewProps>(), {
  content: '',
  fluid: false,
});

const { mdEditorTheme } = useEditorTheme();
const htmlFrameRef = ref<HTMLIFrameElement | null>(null);
const markdownPreviewRef = ref<ExposePreviewParam>();
const markdownPreviewId = useId();

/** Mermaid 等异步扩展在用户侧预览挂载后需二次渲染 */
async function rerenderMarkdownPreview(): Promise<void> {
  await nextTick();
  markdownPreviewRef.value?.rerender();
}

watch(
  () => [props.contentType, props.content] as const,
  async ([contentType, content]) => {
    if (contentType === 'HTML') {
      await nextTick();
      if (htmlFrameRef.value) {
        htmlFrameRef.value.srcdoc = content ?? '';
      }
      return;
    }
    if (contentType === 'MARKDOWN') {
      await rerenderMarkdownPreview();
    }
  },
  { immediate: true }
);

watch(mdEditorTheme, () => {
  if (props.contentType === 'MARKDOWN') {
    void rerenderMarkdownPreview();
  }
});
</script>

<template>
  <div :class="fluid ? 'typed-content-view--fluid' : 'p-2'">
    <!-- TEXT：原样纯文本 -->
    <div v-if="contentType === 'TEXT'" class="whitespace-pre-wrap break-all rounded text-left">
      {{ content ?? '' }}
    </div>

    <!-- MARKDOWN：md-editor-v3 预览 -->
    <div v-else-if="contentType === 'MARKDOWN'" class="typed-content-view__markdown">
      <MdPreview
        :id="markdownPreviewId"
        ref="markdownPreviewRef"
        :model-value="content ?? ''"
        :preview-theme="MD_PREVIEW_THEME"
        :theme="mdEditorTheme"
      />
    </div>

    <!-- HTML：iframe 沙箱展示（高度由调用方容器控制时仍需 iframe 自身高度） -->
    <div v-else-if="contentType === 'HTML'" class="bg-(--el-fill-color-blank)">
      <iframe
        ref="htmlFrameRef"
        class="block h-105 w-full border-0"
        sandbox="allow-same-origin"
        title="typed-content"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 预览跟页面背景走，不单独铺编辑器画布底色 */
:deep(.md-editor) {
  --md-bk-color: transparent;
  --md-color: var(--el-text-color-primary);
  --md-border-color: transparent;

  width: 100%;
  background-color: transparent;
  border: none;
}

.typed-content-view--fluid {
  width: 100%;
}

.typed-content-view__markdown {
  width: 100%;

  :deep(.md-editor-previewOnly .md-editor-preview) {
    padding: 0;
  }

  :deep(.md-editor-mermaid) {
    overflow-x: auto;
  }
}
</style>
