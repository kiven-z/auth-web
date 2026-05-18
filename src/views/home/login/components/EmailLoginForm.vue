<script lang="ts" setup>
import { loginByEmailApi, sendEmailCodeApi } from '@/api/auth';
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { establishSessionFromLogin } from '@/infrastructure/session';
import { message } from '@/shared/messaging/message';
import type { FormInstance } from 'element-plus';
import { onUnmounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { emailLoginRules } from '@/views/home/login/rules/email.rules';
import Motion from './Motion';

import { LoginFormEmits } from '@/views/home/login/constants/types';
import EmailIcon from '~icons/ri/mail-fill';
import CodeIcon from '~icons/ri/message-3-fill';

defineOptions({ name: 'EmailLoginForm' });

const emit = defineEmits<LoginFormEmits>();

const { t } = useI18n();
const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = reactive({
  email: '14x_hbt58i3x1a@dingtalk.com',
  code: '467738',
});

// 发送验证码倒计时（秒），0 表示可发送
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const isCounting = () => countdown.value > 0;

/**
 * 开始倒计时
 */
const startCountdown = () => {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }
  }, 1000);
};

/**
 * 发送验证码
 */
const handleSendCode = async () => {
  if (isCounting() || !formData.email) return;
  try {
    await sendEmailCodeApi({ email: formData.email });
    message(t('login.authSendCodeSuccess'), { type: 'success' });
    startCountdown();
  } catch {
    message(t('login.authSendCodeFail'), { type: 'error' });
  }
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      await establishSessionFromLogin(() => loginByEmailApi({ ...formData }));
      emit('login-success');
    } catch (e) {
      message(e.message, { type: 'error' });
    } finally {
      loading.value = false;
    }
  });
};

defineExpose({ formRef, handleSubmit });

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="emailLoginRules" size="large">
    <Motion :delay="100">
      <el-form-item prop="email">
        <el-input
          v-model="formData.email"
          :placeholder="t('login.authEmail')"
          :prefix-icon="useRenderIcon(EmailIcon)"
          clearable
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="code">
        <el-input
          v-model="formData.code"
          :placeholder="t('login.authCode')"
          :prefix-icon="useRenderIcon(CodeIcon)"
          clearable
        >
          <template #append>
            <el-button :disabled="isCounting() || !formData.email" class="w-[120px]" @click="handleSendCode">
              {{ isCounting() ? `${countdown}s` : t('login.authSendCode') }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-button :loading="loading" class="w-full mt-4!" size="default" type="primary" @click="handleSubmit">
        {{ t('login.authLogin') }}
      </el-button>
    </Motion>
  </el-form>
</template>
