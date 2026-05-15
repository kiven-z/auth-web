import { ApiBusinessError, ApiConflictError } from '@/infrastructure/http-core';
import { getTopMenu } from '@/router/utils/misc';
import { initRouter } from '@/router/utils/route-registry';
import { message } from '@/shared/messaging/message';
import { debounce } from '@pureadmin/utils';
import { useEventListener } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { LoginMode } from '@/views/home/login/constants/types';

function useLogin() {
  const router = useRouter();
  const { t } = useI18n();

  const loading = ref(false);
  const disabled = ref(false);
  const currentMode = ref<LoginMode>(LoginMode.UsernamePassword);

  // 用于切换动画时触发 key 变化，让组件重新挂载获得入场动画
  const formKey = ref(0);

  const switchMode = (mode: LoginMode) => {
    if (mode === currentMode.value) return;
    currentMode.value = mode;
    formKey.value++;
  };

  /**
   * 表单组件内部登录成功后调用的回调。
   * 统一处理：加载路由、跳转首页。
   */
  const onLoginSuccess = async () => {
    disabled.value = true;
    try {
      await initRouter();
      await router.push(getTopMenu(true)?.path ?? '/');
      message(t('login.authLoginSuccess'), { type: 'success' });
    } catch (err: unknown) {
      if (err instanceof ApiConflictError) {
        return;
      }
      const text = err instanceof ApiBusinessError ? err.message : t('login.authLoginFail');
      message(text, { type: 'error' });
    } finally {
      disabled.value = false;
    }
  };

  /**
   * 表单组件内部登录失败时调用的回调。
   */
  const onLoginError = (err: unknown) => {
    if (err instanceof ApiConflictError) {
      return;
    }
    const text = err instanceof ApiBusinessError ? err.message : t('login.authLoginFail');
    message(text, { type: 'error' });
  };

  /**
   * 支持父级从外部触发表单提交（Enter 键统一处理）
   */
  const formRef = ref<{ handleSubmit: () => void } | null>(null);

  const triggerFormSubmit = () => {
    formRef.value?.handleSubmit();
  };

  const immediateDebounce = debounce(triggerFormSubmit, 1000, true);

  useEventListener(document, 'keydown', ({ code }) => {
    if (['Enter', 'NumpadEnter'].includes(code) && !disabled.value && !loading.value) {
      immediateDebounce();
    }
  });

  return {
    loading,
    disabled,
    currentMode,
    formKey,
    formRef,
    switchMode,
    onLoginSuccess,
    onLoginError,
  };
}

export default useLogin;
