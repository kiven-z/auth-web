<script lang="tsx" setup>
import type { MessageChannelCode, MessageTemplateDetailVO } from '@/api/message/message-template';
import { getMessageTemplateById } from '@/api/message/message-template';
import ReDescription from '@/components/ui/Description';
import type { ColumnProps } from '@/components/ui/Description/src/types';
import { errorMessage } from '@/services/feedback/message';
import MessageTemplateContentView from '@/views/message/_shared/components/MessageTemplateContentView.vue';
import type { MessageTemplateContentTypeCode } from '@/views/message/_shared/constants/content-type';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 跨渠道消息模板详情：一次拉详情，Tab 切换渲染结果与原文 */
interface MessageTemplateDetailViewProps {
  id: string;
  channel: MessageChannelCode;
  /** 渠道差异：描述列由父组件传入 */
  columns: ColumnProps[];
  /** 正文区块标题 */
  contentLabel: string;
}

const props = defineProps<MessageTemplateDetailViewProps>();

const { t } = useI18n();

const loading = ref(false);
const detail = ref<MessageTemplateDetailVO | null>(null);
const contentTab = ref<'preview' | 'source'>('preview');

/** 预览类型，缺省 TEXT */
const previewContentType = computed(() => {
  return (detail.value?.contentType ?? 'TEXT') as MessageTemplateContentTypeCode;
});

/**
 * 拉取详情
 */
const load = async () => {
  try {
    loading.value = true;
    detail.value = await getMessageTemplateById(props.id, props.channel);
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>

<template>
  <div v-loading="loading">
    <ReDescription :column="2" :columns="columns" :data="detail ?? {}" border />

    <!-- 正文：渲染结果 / 原文 -->
    <div class="mb-2 mt-4 text-sm font-medium">{{ contentLabel }}</div>

    <el-tabs v-model="contentTab">
      <!-- 按示例值渲染后的效果 -->
      <el-tab-pane :label="t('messageTemplate.previewTab')" lazy name="preview">
        <el-alert :closable="false" :title="t('messageTemplate.previewTips')" class="mb-3" type="info" />
        <h2 v-if="detail?.previewSubject" class="mb-3!">
          {{ detail.previewSubject }}
        </h2>
        <MessageTemplateContentView :content="detail?.previewContent ?? ''" :content-type="previewContentType" />
      </el-tab-pane>

      <!-- FreeMarker 原文，固定纯文本展示 -->
      <el-tab-pane :label="t('messageTemplate.sourceTab')" lazy name="source">
        <h2 v-if="detail?.subject" class="mb-3!">
          {{ detail.subject }}
        </h2>
        <MessageTemplateContentView :content="detail?.content ?? ''" content-type="TEXT" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
