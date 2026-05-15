<script lang="ts" setup>
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import type { FormInstance } from 'element-plus';
import { onUnmounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Motion from './Motion';
import type { LoginFormEmits, LoginFormProps } from '../utils/types';

import EmailIcon from '~icons/ri/mail-fill';
import CodeIcon from '~icons/ri/message-3-fill';

defineOptions({ name: 'EmailLoginForm' });

const props = defineProps<LoginFormProps>();
const emit = defineEmits<LoginFormEmits>();

const { t } = useI18n();
const formRef = ref<FormInstance>();

const formData = reactive({
  email: '',
  code: '',
});

// 发送验证码倒计时（秒），0 表示可发送
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const isCounting = () => countdown.value > 0;

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

const handleSendCode = () => {
  if (isCounting() || !formData.email) return;
  // TODO: 调用后端发送邮件验证码接口
  // await sendEmailCodeApi({ email: formData.email });
  startCountdown();
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('login', { ...formData });
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
  <el-form ref="formRef" :model="formData" size="large">
    <Motion :delay="100">
      <el-form-item
        :rules="[
          {
            required: true,
            message: t('login.authEmailReg'),
            trigger: 'blur',
          },
          {
            type: 'email',
            message: t('login.authEmailFormatReg'),
            trigger: 'blur',
          },
        ]"
        prop="email"
      >
        <el-input
          v-model="formData.email"
          :placeholder="t('login.authEmail')"
          :prefix-icon="useRenderIcon(EmailIcon)"
          clearable
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item
        :rules="[
          {
            required: true,
            message: t('login.authCodeReg'),
            trigger: 'blur',
          },
        ]"
        prop="code"
      >
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
      <el-button
        :disabled="props.disabled"
        :loading="props.loading"
        class="w-full mt-4!"
        size="default"
        type="primary"
        @click="handleSubmit"
      >
        {{ t('login.authLogin') }}
      </el-button>
    </Motion>
  </el-form>
</template>
