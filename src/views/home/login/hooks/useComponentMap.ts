import { type Component, defineAsyncComponent, markRaw } from 'vue';
import { LoginMode } from '@/views/home/login/constants/types';

function useComponentMap() {
  // 登录方式 → 表单组件的懒加载映射（登录组件路径与该视图耦合，保持本地引用）
  const formComponentMap: Record<LoginMode, Component> = {
    [LoginMode.UsernamePassword]: markRaw(defineAsyncComponent(() => import('../components/UsernamePasswordForm.vue'))),
    [LoginMode.Email]: markRaw(defineAsyncComponent(() => import('../components/EmailLoginForm.vue'))),
    // 未来： [LoginMode.Mobile]: () => import('./components/MobileLoginForm.vue'),
  };

  return { formComponentMap };
}

export default useComponentMap;
