<script lang="ts" setup>
import { useChangePasswordAction } from '@/components/business/ChangePasswordDialog';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ProfileSecurityCard',
});

const { t } = useI18n();
const { openSelfChangePasswordDialog } = useChangePasswordAction();
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div class="font-medium">{{ t('users.password.reset') }}</div>
      <el-text class="mt-1!" type="info">{{ t('users.password.old') }} / {{ t('users.password.new') }}</el-text>
    </div>

    <el-button type="primary" @click="openSelfChangePasswordDialog">
      {{ t('users.password.reset') }}
    </el-button>
  </div>
</template>
