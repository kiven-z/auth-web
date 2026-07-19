<script lang="ts" setup>
import type { InAppInboxPageRow } from '@/api/message/in-app-inbox';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InboxMessageList',
});

defineProps<{
  /** 列表数据 */
  rows: InAppInboxPageRow[];
  /** 选中的消息 ID */
  selectedIds: string[];
  /** 加载中 */
  loading: boolean;
}>();

const emit = defineEmits<{
  'toggle-row': [messageId: string, checked: boolean];
  'row-delete': [messageId: string];
  'row-mark-read': [messageId: string];
}>();

const { t } = useI18n();
</script>

<template>
  <div v-loading="loading" class="inbox-message-list">
    <el-empty v-if="!loading && rows.length === 0" :description="t('inAppInbox.empty')" />

    <div
      v-for="row in rows"
      :key="row.id"
      class="inbox-message-list__row"
      :class="{ 'inbox-message-list__row--unread': !row.isRead }"
    >
      <el-checkbox
        :model-value="selectedIds.includes(row.id)"
        @change="(checked) => emit('toggle-row', row.id, Boolean(checked))"
      />

      <span class="inbox-message-list__biz-type">{{ row.bizType || '—' }}</span>
      <span class="inbox-message-list__title">{{ row.title }}</span>

      <div class="inbox-message-list__trailing">
        <div class="inbox-message-list__actions">
          <el-button link type="primary" @click="emit('row-mark-read', row.id)">
            {{ t('inAppInbox.action.markRead') }}
          </el-button>
          <el-button link type="danger" @click="emit('row-delete', row.id)">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </div>
        <div class="inbox-message-list__time">{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inbox-message-list {
  min-height: 240px;

  &__row {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(140px, 220px) 1fr auto;
    gap: 16px 24px;
    align-items: center;
    padding: 14px 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      background-color 0.18s ease;

    &:hover {
      z-index: 1;
      background: var(--el-bg-color);
      box-shadow:
        0 6px 20px rgb(0 0 0 / 14%),
        0 2px 8px rgb(0 0 0 / 10%);
      transform: scale(1.015);

      .inbox-message-list__actions {
        opacity: 1;
        pointer-events: auto;
      }

      .inbox-message-list__time {
        opacity: 0;
      }
    }

    &--unread {
      .inbox-message-list__title {
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  &__biz-type,
  &__title {
    overflow: hidden;
    min-width: 0;
    color: var(--el-text-color-regular);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__trailing {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 120px;
    min-height: 24px;
  }

  &__actions {
    position: absolute;
    inset: 0;
    display: flex;
    gap: 4px;
    justify-content: flex-end;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &__time {
    color: var(--el-text-color-secondary);
    font-size: 13px;
    white-space: nowrap;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }
}
</style>
