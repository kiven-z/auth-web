<script lang="ts" setup>
import type { ChangePasswordDialogPanelProps } from './types';
import { useChangePasswordRules } from './hooks/useChangePasswordRules';
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
    <el-form-item v-if="mode === 'self-change'" :label="t('users.password.old')" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        :placeholder="t('users.password.old')"
        autocomplete="current-password"
        show-password
        type="password"
      />
    </el-form-item>
    <el-form-item :label="t('users.password.new')" prop="newPassword">
      <el-input
        v-model="form.newPassword"
        :placeholder="t('users.password.new')"
        autocomplete="new-password"
        show-password
        type="password"
      />
    </el-form-item>
    <el-form-item :label="t('users.password.confirm')" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        :placeholder="t('users.password.confirm')"
        autocomplete="new-password"
        show-password
        type="password"
      />
    </el-form-item>
  </el-form>
</template>
