<script lang="ts" setup>
/**
 * 通知中心（站内信）
 * - IN_APP 渠道消息列表（已读 / 未读）
 * - 消息详情与标记已读
 * - 管理端可扩展：全员通知下发（视产品需求）
 * 依赖后端：IN_APP 渠道 Sender 与通知 API（当前未建）
 */
defineOptions({
  name: 'MessageNotification',
});
</script>

<template>
  <div class="w-full">
    <h1 class="text-lg font-medium">通知中心（待开发）</h1>
    <p class="mt-2 text-sm text-gray-500">站内信 / IN_APP 通知展示与管理</p>
  </div>
</template>
