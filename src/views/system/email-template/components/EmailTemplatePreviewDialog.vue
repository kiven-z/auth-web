<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

interface Props {
  /** 已渲染 HTML */
  html: string;
}

defineProps<Props>();
const { t } = useI18n();
</script>

<template>
  <div class="w-full">
    <el-alert :closable="false" :title="t('emailTemplate.previewTips')" class="mb-3" type="info" />
    <div class="border border-(--el-border-color) rounded p-4 overflow-auto" style="max-height: 70vh">
      <div v-html="html" />
    </div>
  </div>
</template>
