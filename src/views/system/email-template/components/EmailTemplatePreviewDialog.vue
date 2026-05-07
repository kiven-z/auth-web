<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  /** 已渲染 HTML */
  html: string;
}

const props = defineProps<Props>();
const { t } = useI18n();
const previewFrameRef = ref<HTMLIFrameElement | null>(null);

watch(
  () => props.html,
  async (html) => {
    await nextTick();
    const frame = previewFrameRef.value;
    if (!frame) return;
    frame.srcdoc = html;
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
        class="w-full h-[420px] border-0 block"
        sandbox="allow-same-origin"
        title="email-template-preview-dialog"
      />
    </div>
  </div>
</template>
