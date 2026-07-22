<script lang="ts" setup>
import { getInAppInboxDetail, type InAppInboxDetail } from '@/api/message/in-app-inbox';
import type { TypedContentTypeCode } from '@/components/business/TypedContentView';
import TypedContentView from '@/components/business/TypedContentView';
import { errorMessage } from '@/services/feedback/message';
import { DISPLAY_DATETIME_FORMAT } from '@/shared/utils/date/dateTime';
import { useInAppInboxStore } from '@/store/modules/message/inAppInbox';
import HomePageToolbar from '@/views/home/_shared/components/HomePageToolbar.vue';
import dayjs from 'dayjs';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'HomeInboxDetail',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const inboxStore = useInAppInboxStore();

const loading = ref(false);
const detail = ref<InAppInboxDetail | null>(null);

/** 路由上的站内信 ID（雪花字符串） */
const messageId = computed(() => String(route.params.id ?? ''));

/** 正文类型，缺省 TEXT */
const contentType = computed(() => {
  return (detail.value?.contentType ?? 'TEXT') as TypedContentTypeCode;
});

const displayCreateTime = computed(() => {
  const createTime = detail.value?.createTime;
  if (!createTime) {
    return '';
  }
  return dayjs(createTime).format(DISPLAY_DATETIME_FORMAT);
});

/**
 * 拉取详情（后端打开即标已读），并刷新未读角标
 */
async function loadDetail(): Promise<void> {
  if (!messageId.value) {
    detail.value = null;
    return;
  }
  try {
    loading.value = true;
    detail.value = await getInAppInboxDetail(messageId.value);
    void inboxStore.refreshUnreadCount();
  } catch (error: unknown) {
    errorMessage(error);
    detail.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDetail();
});
</script>

<template>
  <div v-loading="loading" class="inbox-message-detail">
    <div class="inbox-message-detail__header">
      <HomePageToolbar @back="router.back()" />
    </div>

    <div v-if="detail" class="inbox-message-detail__body">
      <div class="inbox-message-detail__meta">
        <h2 class="inbox-message-detail__title">{{ detail.title }}</h2>
        <div class="inbox-message-detail__sub">
          <span v-if="displayCreateTime">{{ displayCreateTime }}</span>
          <span v-if="detail.categoryName">{{ detail.categoryName }}</span>
        </div>
        <!-- 业务跳转链接 -->
        <a
          v-if="detail.linkUrl"
          :href="detail.linkUrl"
          class="inbox-message-detail__link"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ t('inAppInbox.field.linkUrl') }}
        </a>
      </div>

      <TypedContentView :content="detail.content" :content-type="contentType" />
    </div>

    <el-empty v-else-if="!loading" :description="t('inAppInbox.empty')" />
  </div>
</template>

<style lang="scss" scoped>
.inbox-message-detail {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--el-bg-color);
  }

  &__body {
    max-width: 880px;
    margin: 0 auto;
  }

  &__meta {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
  }

  &__sub {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  &__link {
    display: inline-block;
    margin-top: 8px;
    color: var(--el-color-primary);
    font-size: 13px;
  }
}
</style>
