<script lang="ts" setup>
/**
 * ARBAC 策略管理
 * - policy_definition：策略定义 CRUD（策略码、表达式、描述等）
 * - role_policy：角色与策略绑定维护
 * - 策略启用/停用
 * 依赖后端：policy_definition / role_policy 表及管理 API（当前未建）
 */
defineOptions({
  name: 'SystemPolicy',
});
</script>

<template>
  <div class="w-full">
    <h1 class="text-lg font-medium">策略管理（待开发）</h1>
    <p class="mt-2 text-sm text-gray-500">ARBAC 策略定义与角色策略绑定</p>
  </div>
</template>
