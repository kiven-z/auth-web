<script lang="ts" setup>
/**
 * 消息发送记录
 * - 各渠道（邮件 / 短信 / 钉钉等）发送记录分页查询
 * - 查看详情（收件人、模板、参数、失败原因等）
 * - 失败重试、撤回（视后端能力）
 * 依赖后端：消息发送记录 API（当前未建）
 */
defineOptions({
  name: 'MessageSendRecord',
});
</script>

<template>
  <div class="w-full">
    <h1 class="text-lg font-medium">消息发送记录（待开发）</h1>
    <p class="mt-2 text-sm text-gray-500">各渠道发送记录查询与失败重试</p>
  </div>
</template>
