import { LoginMode, type LoginModeMeta } from '@/views/home/login/constants/types';
import { defineAsyncComponent, markRaw, type Component } from 'vue';

/**
 * 登录方式注册表（切换按钮 + 表单组件）
 * 新增登录方式时：先在 types 中扩展 {@link LoginMode}，再在此处追加一条。
 */
export const loginModeRegistry: LoginModeMeta[] = [
  {
    mode: LoginMode.UsernamePassword,
    labelKey: 'login.authUsernamePasswordLogin',
    component: () => import('../components/UsernamePasswordForm.vue'),
  },
  {
    mode: LoginMode.Email,
    labelKey: 'login.authEmailLogin',
    component: () => import('../components/EmailLoginForm.vue'),
  },
  // 未来：
  // { mode: LoginMode.Mobile, labelKey: 'login.authMobileLogin', component: () => import('...') },
];

/** 默认登录方式（注册表第一项） */
export const defaultLoginMode = loginModeRegistry[0]!.mode;

/** 供切换按钮 `v-for` 使用（与注册表同源） */
export const loginModes = loginModeRegistry;

/**
 * 由注册表生成的登录方式 → 表单组件映射。
 */
export const formComponentMap: Record<LoginMode, Component> = loginModeRegistry.reduce(
  (map, item) => {
    map[item.mode] = markRaw(defineAsyncComponent(item.component));
    return map;
  },
  {} as Record<LoginMode, Component>
);
