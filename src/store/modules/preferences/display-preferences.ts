import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import { schedulePreferenceSync } from '@/core/preferences/persistence/sync';
import { defineStore } from 'pinia';

/** 界面显示开关偏好状态 */
interface DisplayPreferencesState {
  /** 色弱模式 */
  weak: boolean;
  /** 隐藏底部 */
  hideFooter: boolean;
}

/**
 * 界面显示开关偏好 Store（ui.display）
 *
 * 管理色弱模式与隐藏页脚。
 */
export const useDisplayPreferencesStore = defineStore('display-preferences', {
  state: (): DisplayPreferencesState => ({
    weak: false,
    hideFooter: true,
  }),

  actions: {
    /** 设置色弱模式 */
    setWeak(value: boolean): void {
      this.weak = value;
      document.documentElement.classList.toggle('html-weakness', value);
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 设置隐藏底部 */
    setHideFooter(value: boolean): void {
      this.hideFooter = value;
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 应用界面开关到 DOM（色弱） */
    $applyToDom(): void {
      document.documentElement.classList.toggle('html-weakness', this.weak);
    },
  },
});
