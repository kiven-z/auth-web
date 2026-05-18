import { readSessionPreferences } from '@/infrastructure/session';
import { useUserStoreHook } from '@/store/modules/user';
import { ref } from 'vue';

/** 记住登录默认天数（与历史 store 默认一致） */
const DEFAULT_REMEMBER_LOGIN_DAYS = 7;

/**
 * 登录页「记住登录」状态：提交前写入 session 偏好，供 setToken 设置多标签 Cookie 过期策略。
 */
export function useLoginRemember() {
  const preferences = readSessionPreferences();
  const isRemembered = ref(preferences.isRemembered);

  /**
   * 在 establishSessionFromLogin 之前调用，将勾选结果同步到 session 与 Pinia。
   */
  function applyLoginRememberPreference(): void {
    useUserStoreHook().SET_LOGIN_PREFERENCES(isRemembered.value, DEFAULT_REMEMBER_LOGIN_DAYS);
  }

  return {
    isRemembered,
    applyLoginRememberPreference,
  };
}
