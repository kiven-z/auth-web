<script lang="ts" setup>
/**
 * 在线用户管理
 * - 展示当前全局在线会话列表（用户、终端、登录时间、IP 等）
 * - 支持按用户/关键字筛选
 * - 支持强制下线（单条 / 批量）
 * 依赖后端：全局在线用户列表 API（当前仅有按 userId 查会话）
 */
defineOptions({
  name: 'SystemOnlineUser',
});
</script>

<template>
  <div class="w-full">
    <h1 class="text-lg font-medium">在线用户管理（待开发）</h1>
    <p class="mt-2 text-sm text-gray-500">全局在线会话列表与强制下线</p>
  </div>
</template>
