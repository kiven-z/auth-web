<script lang="ts" setup>
import { hasAuth } from '@/shared/permission';
</script>

<template>
  <div>
    <h1>{{ $t('routes.userManagement') }}</h1>

    <el-button-group>
      <el-button v-if="hasAuth(['sys:user:add'])" type="primary">system 用户</el-button>
      <el-button>没有权限按钮</el-button>

      <el-button v-if="hasAuth(['sys:menu:add'])">admin 用户</el-button>
    </el-button-group>
  </div>
</template>

<style lang="scss" scoped></style>
