<script lang="ts" setup>
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { $t, transformI18n } from '@/plugins/i18n';
import { useUserStoreHook } from '@/store/modules/user';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { loginRules } from '../utils/rule';
import { LoginFormEmits } from '@/views/home/login/constants/types';

import Motion from './Motion';

import Lock from '~icons/ri/lock-fill';
import User from '~icons/ri/user-3-fill';

defineOptions({ name: 'UsernamePasswordForm' });

const emit = defineEmits<LoginFormEmits>();

const { t } = useI18n();
const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = reactive({
  username: 'Administrator',
  password: 'admin123',
});

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      await useUserStoreHook().loginByUsername({ ...formData });
      emit('login-success');
    } catch {
      // 错误由 HTTP 拦截器或 Pinia action 处理
    } finally {
      loading.value = false;
    }
  });
};

defineExpose({ formRef, handleSubmit });
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="loginRules" size="large">
    <Motion :delay="100">
      <el-form-item
        :rules="[
          {
            required: true,
            message: transformI18n($t('login.authUsernameReg')),
            trigger: 'blur',
          },
        ]"
        prop="username"
      >
        <el-input
          v-model="formData.username"
          :placeholder="t('login.authUsername')"
          :prefix-icon="useRenderIcon(User)"
          clearable
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="password">
        <el-input
          v-model="formData.password"
          :placeholder="t('login.authPassword')"
          :prefix-icon="useRenderIcon(Lock)"
          clearable
          show-password
        />
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-button :loading="loading" class="w-full mt-4!" size="default" type="primary" @click="handleSubmit">
        {{ t('login.authLogin') }}
      </el-button>
    </Motion>
  </el-form>
</template>
