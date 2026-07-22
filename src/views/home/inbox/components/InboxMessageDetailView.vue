<script lang="ts" setup>
import { DISPLAY_DATETIME_FORMAT } from '@/shared/utils/date/dateTime';
import { useHomePageNavigation } from '@/shared/composables/layout/useHomePageNavigation';
import HomePageToolbar from '@/views/home/_shared/components/HomePageToolbar.vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'HomeInboxDetail',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { backWithReturn } = useHomePageNavigation();

/**
 * 示例数据：后端详情接口就绪后改为接口返回。
 * 标题 / 时间 / 正文均为占位文案。
 */
const sampleTitle = '阿里云产品动态(6月刊)';
const sampleCreateTime = dayjs('2026-07-03 17:28:59').format(DISPLAY_DATETIME_FORMAT);
const sampleContent =
  '请您查收。\n\n本页为收件箱消息详情示例布局（标题居中 + 时间 + 正文）。后端详情接口就绪后，将按路由 id 加载真实内容。';

/** 优先回到列表来源，否则回收件箱 */
const handleBack = () => {
  const from = history.state?.HomeInboxDetail;
  if (typeof from === 'string' && from.startsWith('/')) {
    backWithReturn('HomeInboxDetail');
    return;
  }
  void router.push({ name: 'HomeInbox' });
};
</script>

<template>
  <div class="inbox-message-detail">
    <div class="inbox-message-detail__header">
      <HomePageToolbar @back="handleBack" />
    </div>

    <div class="inbox-message-detail__body">
      <div class="inbox-message-detail__letter-header">
        <h2>{{ sampleTitle }}</h2>
        <div>{{ sampleCreateTime }}</div>
      </div>

      <!-- 占位正文：后端就绪后替换为动态 content -->
      <div class="inbox-message-detail__content">{{ sampleContent }}</div>

      <p class="inbox-message-detail__hint">{{ t('inAppInbox.detail.noContentHint') }}（id: {{ route.params.id }}）</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inbox-message-detail {
  min-height: 100%;

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--el-bg-color);
  }

  &__body {
    max-width: 880px;
    margin: 0 auto;
    padding: 16px 50px 48px;
  }

  &__letter-header {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    text-align: center;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    div {
      margin-top: 8px;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  &__content {
    max-height: 420px;
    overflow: auto;
    padding: 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
  }

  &__hint {
    margin-top: 12px;
    color: var(--el-text-color-placeholder);
    font-size: 12px;
  }
}
</style>
