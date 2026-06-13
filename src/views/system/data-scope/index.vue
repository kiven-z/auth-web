<script lang="ts" setup>
/**
 * 数据权限配置
 * - role_scope：按角色配置数据范围（全部 / 本部门 / 本部门及下级 / 自定义等）
 * - user_scope：按用户覆盖角色默认数据范围
 * - 列表查询、新增、编辑、删除
 * 依赖后端：role_scope / user_scope 管理 API（当前未建）
 */
defineOptions({
  name: 'SystemDataScope',
});
</script>

<template>
  <div class="w-full">
    <h1 class="text-lg font-medium">数据权限配置（待开发）</h1>
    <p class="mt-2 text-sm text-gray-500">role_scope / user_scope 数据范围维护</p>
  </div>
</template>
