<script lang="ts" setup>
import type { ChangePasswordDialogPanelProps } from '@/components/business/ChangePasswordDialog/src/types';
import { useChangePasswordRules } from '@/components/business/ChangePasswordDialog/src/useChangePasswordRules';
import type { FormInstance } from 'element-plus';
import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'ChangePasswordDialogPanel' });

const props = defineProps<ChangePasswordDialogPanelProps>();

const { t } = useI18n();
const formRef = ref<FormInstance>();
const modeRef = toRef(props, 'mode');

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const newPasswordRef = computed({
  get: () => form.value.newPassword,
  set: (value: string) => {
    form.value.newPassword = value;
  },
});

const confirmPasswordRef = computed({
  get: () => form.value.confirmPassword,
  set: (value: string) => {
    form.value.confirmPassword = value;
  },
});

const { rules } = useChangePasswordRules(modeRef, newPasswordRef, confirmPasswordRef);

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
    <!-- 旧密码 -->
    <el-form-item v-if="mode === 'self-change'" :label="t('users.oldPassword')" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        :placeholder="t('users.oldPassword')"
        autocomplete="current-password"
        show-password
        type="password"
      />
    </el-form-item>
    <!-- 新密码 -->
    <el-form-item :label="t('users.newPassword')" prop="newPassword">
      <el-input
        v-model="form.newPassword"
        :placeholder="t('users.newPassword')"
        autocomplete="new-password"
        show-password
        type="password"
      />
    </el-form-item>
    <!-- 确认密码 -->
    <el-form-item :label="t('users.passwordConfirm')" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        :placeholder="t('users.passwordConfirm')"
        autocomplete="new-password"
        show-password
        type="password"
      />
    </el-form-item>
  </el-form>
</template>
