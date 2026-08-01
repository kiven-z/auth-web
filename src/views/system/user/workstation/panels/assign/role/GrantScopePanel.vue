<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserWorkstationGrantScopePanel' });

const { t } = useI18n();
</script>

<template>
  <div class="grant-scope-panel">
    <el-empty :description="t('users.workstation.nav.grantScope')" />
  </div>
</template>
