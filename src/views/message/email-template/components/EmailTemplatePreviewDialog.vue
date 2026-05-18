<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  // 已渲染 HTML
  html: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
const previewFrameRef = ref<HTMLIFrameElement | null>(null);
// 预览框高度
const previewHeight = ref(320);

// 预览框最小高度
const PREVIEW_MIN_HEIGHT = 220;
// 预览框最大高度
const PREVIEW_MAX_HEIGHT = 640;

/**
 * 调整预览框高度
 * @param frame 预览框
 * @returns 调整预览框高度后，更新预览框高度
 */
const resizePreviewFrame = (frame: HTMLIFrameElement | null) => {
  if (!frame) return;
  const doc = frame.contentDocument;
  if (!doc) return;
  const nextHeight = Math.max(doc.body?.scrollHeight ?? 0, doc.documentElement?.scrollHeight ?? 0);
  previewHeight.value = Math.min(PREVIEW_MAX_HEIGHT, Math.max(PREVIEW_MIN_HEIGHT, nextHeight));
};

/**
 * 监听已渲染 HTML 变化，更新 iframe 的 srcdoc
 * @param html 已渲染 HTML
 */
watch(
  () => props.html,
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
</script>

<template>
  <div class="w-full">
    <el-alert :closable="false" :title="t('emailTemplate.previewTips')" class="mb-3" type="info" />
    <div class="border border-(--el-border-color) rounded p-4 overflow-auto" style="max-height: 70vh">
      <iframe
        ref="previewFrameRef"
        class="w-full border-0 block"
        sandbox="allow-same-origin"
        title="email-template-preview-dialog"
        :style="{ height: `${previewHeight}px` }"
        @load="resizePreviewFrame(previewFrameRef)"
      />
    </div>
  </div>
</template>
