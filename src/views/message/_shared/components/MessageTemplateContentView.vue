<script lang="ts" setup>
import { useEditorTheme } from '@/shared/composables/editor/useEditorTheme';
import type { MessageTemplateContentTypeCode } from '@/views/message/_shared/constants/content-type';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { nextTick, ref, watch } from 'vue';

defineOptions({
  name: 'MessageTemplateContentView',
});

/** 按正文类型展示正文 */
interface MessageTemplateContentViewProps {
  /** 模板正文原文 */
  content?: string | null;
  /** 正文类型 */
  contentType: MessageTemplateContentTypeCode;
  /** HTML iframe 无障碍标题 */
  frameTitle?: string;
}

const props = withDefaults(defineProps<MessageTemplateContentViewProps>(), {
  content: '',
  frameTitle: 'message-template-content',
});

const { mdEditorTheme } = useEditorTheme();
const htmlFrameRef = ref<HTMLIFrameElement | null>(null);

watch(
  () => [props.contentType, props.content] as const,
  async ([contentType, content]) => {
    if (contentType !== 'HTML') {
      return;
    }
    await nextTick();
    if (htmlFrameRef.value) {
      htmlFrameRef.value.srcdoc = content ?? '';
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- TEXT：原样纯文本，超高滚动 -->
  <div
    v-if="contentType === 'TEXT'"
    class="max-h-105 overflow-auto whitespace-pre-wrap break-all rounded border border-(--el-border-color) bg-(--el-fill-color-blank) p-3 text-left"
  >
    {{ content ?? '' }}
  </div>

  <!-- MARKDOWN：md-editor-v3 预览，超高滚动 -->
  <div v-else-if="contentType === 'MARKDOWN'" class="max-h-105 overflow-auto rounded border border-(--el-border-color)">
    <MdPreview :model-value="content ?? ''" :theme="mdEditorTheme" preview-theme="default" />
  </div>

  <!-- HTML：iframe 隔离展示原文（消毒由后端负责） -->
  <div
    v-else-if="contentType === 'HTML'"
    class="overflow-auto rounded border border-(--el-border-color) bg-(--el-fill-color-blank)"
  >
    <iframe ref="htmlFrameRef" :title="frameTitle" class="block h-105 w-full border-0" sandbox="allow-same-origin" />
  </div>
</template>
