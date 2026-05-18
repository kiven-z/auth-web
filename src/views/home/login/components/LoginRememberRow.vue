<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'LoginRememberRow' });

const isRemembered = defineModel<boolean>('isRemembered', { required: true });

const { t } = useI18n();
</script>

<template>
  <div class="login-remember-row">
    <el-checkbox v-model="isRemembered">
      {{ t('login.authRememberMe') }}
    </el-checkbox>
  </div>
</template>

<style scoped>
.login-remember-row {
  display: flex;
  justify-content: flex-start;
  margin-top: 4px;
}
</style>
