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
  /** 加载中 */
  loading: boolean;
}>();

const selectedRows = defineModel<string[]>('selectedRows', { required: true });

const emit = defineEmits<{
  'row-delete': [messageId: string];
  'row-mark-read': [messageId: string];
}>();

const { t } = useI18n();

/**
 * 勾选 / 取消勾选单行。
 * @param messageId 消息 ID
 * @param checked 是否选中
 */
function toggleRow(messageId: string, checked: boolean) {
  if (checked) {
    selectedRows.value.push(messageId);
    return;
  }
  selectedRows.value = selectedRows.value.filter((id) => id !== messageId);
}
</script>

<template>
  <div v-loading="loading" class="inbox-message-list">
    <el-empty v-if="!loading && rows.length === 0" :description="t('inAppInbox.empty')" />

    <div
      v-for="row in rows"
      :key="row.id"
      :class="{ 'inbox-message-list__row--unread': !row.isRead }"
      class="inbox-message-list__row"
    >
      <el-checkbox
        :model-value="selectedRows.includes(row.id!)"
        @change="(checked) => toggleRow(row.id!, Boolean(checked))"
      />

      <span class="inbox-message-list__biz-type">{{ row.bizType || '—' }}</span>
      <span class="inbox-message-list__title">{{ row.title }}</span>

      <div class="inbox-message-list__trailing">
        <div class="inbox-message-list__actions">
          <el-button link type="primary" @click="emit('row-mark-read', row.id!)">
            {{ t('inAppInbox.action.markRead') }}
          </el-button>
          <el-button link type="danger" @click="emit('row-delete', row.id!)">
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
  height: 550px;
  overflow-y: auto;
  padding: 4px 8px 24px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &__row {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(140px, 220px) 1fr auto;
    gap: 16px 24px;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    transition: all 0.18s ease;
    cursor: pointer;

    &:hover {
      background: var(--el-bg-color);
      box-shadow:
        0 6px 20px rgb(0 0 0 / 14%),
        0 2px 8px rgb(0 0 0 / 10%);
      z-index: 1;

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
