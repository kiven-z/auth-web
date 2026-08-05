<script lang="ts" setup>
import { useEditorTheme } from '@/shared/composables/editor/useEditorTheme';
import type { TypedContentViewProps } from './types';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { nextTick, ref, watch } from 'vue';

defineOptions({
  name: 'TypedContentView',
});

const props = withDefaults(defineProps<TypedContentViewProps>(), {
  content: '',
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
  <div class="p-2">
    <!-- TEXT：原样纯文本 -->
    <div v-if="contentType === 'TEXT'" class="whitespace-pre-wrap break-all rounded text-left">
      {{ content ?? '' }}
    </div>

    <!-- MARKDOWN：md-editor-v3 预览 -->
    <div v-else-if="contentType === 'MARKDOWN'">
      <MdPreview :model-value="content ?? ''" :theme="mdEditorTheme" preview-theme="default" />
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
