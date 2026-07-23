<script lang="ts" setup>
import Segmented, { type OptionsType } from '@/components/ui/Segmented';
import { syncSystemThemeFromOs } from '@/core/preferences/system-theme';
import { useUiTheme } from '@/layout/hooks/theme/useUiTheme';
import { useDark } from '@pureadmin/utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import DarkIcon from '@/assets/svg/dark.svg?component';
import DayIcon from '@/assets/svg/day.svg?component';
import SystemIcon from '@/assets/svg/system.svg?component';
import Check from '~icons/ep/check';

const { t } = useI18n();
const { isDark } = useDark();
const { dataTheme, overallStyle, layoutTheme, themeColors, dataThemeChange, setLayoutThemeColor } = useUiTheme();

/** 浅色色板：选中勾用深色，并加描边以免融进背景 */
const LIGHT_THEME_SWATCHES = new Set(['light', 'amberYellow']);

const sectionTitleClass = ['mb-[12px]!', 'font-medium', 'text-sm', 'dark:text-white'];

/**
 * 当前整体风格下可见的主题色（暗色模式隐藏亮白）
 */
const visibleThemeColors = computed(() => {
  return themeColors.value.filter((item) => !(item.themeColor === 'light' && isDark.value));
});

/**
 * 是否为需要描边的浅色色板
 * @param themeColor 主题标识
 * @returns 是否浅色色板
 */
function isLightThemeSwatch(themeColor: string): boolean {
  return LIGHT_THEME_SWATCHES.has(themeColor);
}

/**
 * 主题色选中勾颜色（浅色板用深色勾，其余用白色勾）
 * @param current 主题标识
 * @returns 勾选图标颜色
 */
function getThemeCheckColor(current: string): string {
  if (current !== layoutTheme.value.theme) {
    return 'transparent';
  }
  return isLightThemeSwatch(current) ? '#1d2b45' : '#ffffff';
}

const themeOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.overallStyleLight'),
      icon: DayIcon,
      theme: 'light',
      tip: t('panel.overallStyleLightTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
    {
      label: t('panel.overallStyleDark'),
      icon: DarkIcon,
      theme: 'dark',
      tip: t('panel.overallStyleDarkTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
    {
      label: t('panel.overallStyleSystem'),
      icon: SystemIcon,
      theme: 'system',
      tip: t('panel.overallStyleSystemTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
  ];
});

/**
 * 切换浅色 / 深色 / 跟随系统
 * @param theme Segmented change 载荷
 */
function handleOverallStyleChange(theme: { index: number; option: { theme: string } }): void {
  if (theme.index === 2) {
    dataTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    overallStyle.value = theme.option.theme;
    dataThemeChange(theme.option.theme);
    syncSystemThemeFromOs();
    return;
  }
  dataTheme.value = theme.index === 1;
  overallStyle.value = theme.option.theme;
  dataThemeChange(theme.option.theme);
}
</script>

<template>
  <div>
    <p :class="sectionTitleClass">{{ t('panel.overallStyle') }}</p>
    <Segmented
      :modelValue="overallStyle === 'system' ? 2 : dataTheme ? 1 : 0"
      :options="themeOptions"
      class="select-none"
      resize
      @change="handleOverallStyleChange"
    />

    <p :class="['mt-5!', sectionTitleClass]">{{ t('panel.themeColor') }}</p>
    <ul class="theme-color">
      <li
        v-for="item in visibleThemeColors"
        :key="item.themeColor"
        :class="{ 'theme-color__swatch--light': isLightThemeSwatch(item.themeColor) }"
        :style="{ background: item.color }"
        class="theme-color__swatch"
        @click="setLayoutThemeColor(item.themeColor)"
      >
        <el-icon :color="getThemeCheckColor(item.themeColor)" :size="14" class="theme-color__check">
          <IconifyIconOffline :icon="Check" />
        </el-icon>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.theme-color {
  display: grid;
  grid-template-columns: repeat(auto-fill, 28px);
  gap: 10px;

  &__swatch {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-radius: 6px;
    box-sizing: border-box;
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.08);
    }

    &--light {
      border: 1px solid var(--el-border-color, #dcdfe6);
    }
  }
}
</style>
