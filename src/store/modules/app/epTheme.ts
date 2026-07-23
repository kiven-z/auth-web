import { getLayoutSnapshot, patchLayout } from '@/core/preferences/storage';
import { getConfig } from '@/auth/config';
import { defineStore } from 'pinia';

export const useEpThemeStore = defineStore('ep-theme', {
  state: () => {
    const layout = getLayoutSnapshot();
    return {
      epThemeColor: layout.epThemeColor ?? getConfig().EpThemeColor,
      epTheme: layout.theme ?? getConfig().Theme,
    };
  },
  getters: {
    getEpThemeColor(state) {
      return state.epThemeColor;
    },
    /** 用于mix导航模式下hamburger-svg的fill属性 */
    fill(state) {
      if (state.epTheme === 'light') {
        return '#409eff';
      }
      return '#fff';
    },
  },
  actions: {
    /**
     * 设置 Element 主色（经 preferences layout 网关持久化）
     * @param newColor 色值
     */
    setEpThemeColor(newColor: string): void {
      const layout = getLayoutSnapshot();
      this.epTheme = layout.theme ?? getConfig().Theme;
      this.epThemeColor = newColor;
      patchLayout({ ...layout, epThemeColor: newColor, theme: this.epTheme });
    },
  },
});
