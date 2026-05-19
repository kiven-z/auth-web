<script lang="ts" setup>
import { loginByUsernameApi } from '@/api/auth';
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { LoginFormEmits } from '@/views/home/login/constants/types';
import { usernamePasswordRules } from '@/views/home/login/rules/username-password.rules';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useLoginRemember } from '@/views/home/login/hooks/useLoginRemember';
import LoginRememberRow from './LoginRememberRow.vue';
import Motion from './Motion';

import { message } from '@/shared/messaging/message';
import Lock from '~icons/ri/lock-fill';
import User from '~icons/ri/user-3-fill';

defineOptions({ name: 'UsernamePasswordForm' });

const emit = defineEmits<LoginFormEmits>();

const { t } = useI18n();
const formRef = ref<FormInstance>();
const loading = ref(false);
const { isRemembered, loginAndEstablishSession } = useLoginRemember();

// 登录表单
const formData = reactive({
  username: 'Administrator',
  password: 'admin123',
});

/**
 * 提交登录
 */
const handleSubmit = async () => {
  // 表单未初始化
  if (!formRef.value) return;

  // 验证表单
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      await loginAndEstablishSession(() => loginByUsernameApi({ ...formData, rememberMe: isRemembered.value }));
      emit('login-success');
    } catch (e) {
      message(e.message, { type: 'error' });
    } finally {
      loading.value = false;
    }
  });
};

defineExpose({ handleSubmit });
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="usernamePasswordRules" size="large">
    <Motion :delay="100">
      <el-form-item prop="username">
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

    <Motion :delay="200">
      <LoginRememberRow v-model:is-remembered="isRemembered" />
    </Motion>

    <Motion :delay="250">
      <el-button :loading="loading" class="w-full mt-4!" size="default" type="primary" @click="handleSubmit">
        {{ t('login.authLogin') }}
      </el-button>
    </Motion>
  </el-form>
</template>
