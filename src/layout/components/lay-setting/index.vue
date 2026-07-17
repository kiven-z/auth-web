<script lang="ts" setup>
import Segmented, { type OptionsType } from '@/components/ui/Segmented';
import { applyThemePreferences, syncSystemThemeFromOs } from '@/core/preferences';
import { useUiConfigure } from '@/layout/hooks/configure/useUiConfigure';
import { useUiLayout } from '@/layout/hooks/layout/useUiLayout';
import { useNav } from '@/layout/hooks/navigation/useNav';
import { useUiTheme } from '@/layout/hooks/theme/useUiTheme';
import { useAppStoreHook } from '@/store/modules/app';
import { debounce, isNumber, toggleClass, useDark, useGlobal } from '@pureadmin/utils';
import { computed, nextTick, onBeforeMount, reactive, ref, unref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import LayPanel from '../lay-panel/index.vue';

import DarkIcon from '@/assets/svg/dark.svg?component';
import DayIcon from '@/assets/svg/day.svg?component';
import SystemIcon from '@/assets/svg/system.svg?component';
import Check from '~icons/ep/check';
import LeftArrow from '~icons/ri/arrow-left-s-line?width=20&height=20';
import RightArrow from '~icons/ri/arrow-right-s-line?width=20&height=20';

const { t } = useI18n();
const { device } = useNav();
const { isDark } = useDark();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const mixRef = ref();
const verticalRef = ref();
const horizontalRef = ref();

const { patchConfigureField } = useUiConfigure();
const { setLayoutMode } = useUiLayout();

const { dataTheme, overallStyle, layoutTheme, themeColors, dataThemeChange, setLayoutThemeColor } = useUiTheme();

/* 初始化布局与主题：主题必须走 apply，避免 theme/themeColor 分叉时写错 data-theme */
if (unref(layoutTheme)) {
  setLayoutMode(unref(layoutTheme).layout);
  applyThemePreferences();
}

/** 默认灵动模式 */
const markValue = ref($storage.configure?.showModel ?? 'smart');

const logoVal = ref($storage.configure?.showLogo ?? true);

const settings = reactive({
  greyVal: $storage.configure.grey,
  weakVal: $storage.configure.weak,
  tabsVal: $storage.configure.hideTabs,
  showLogo: $storage.configure.showLogo,
  showModel: $storage.configure.showModel,
  hideFooter: $storage.configure.hideFooter,
  multiTagsCache: $storage.configure.multiTagsCache,
  stretch: $storage.configure.stretch,
});

/** 浅色色板：选中勾用深色，并加描边以免融进背景 */
const LIGHT_THEME_SWATCHES = new Set(['light', 'amberYellow']);

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

/** 灰色模式设置 */
const greyChange = (value): void => {
  patchConfigureField({ grey: value });
};

/** 色弱模式设置 */
const weekChange = (value): void => {
  patchConfigureField({ weak: value });
};

/** 隐藏标签页设置 */
const tagsChange = () => {
  patchConfigureField({ hideTabs: settings.tabsVal });
};

/** 隐藏页脚设置 */
const hideFooterChange = () => {
  patchConfigureField({ hideFooter: settings.hideFooter });
};

/** 标签页持久化设置 */
const multiTagsCacheChange = () => {
  patchConfigureField({ multiTagsCache: settings.multiTagsCache });
};

function onChange({ option }) {
  const { value } = option;
  markValue.value = value;
  patchConfigureField({ showModel: value });
}

/** 侧边栏Logo */
function logoChange() {
  patchConfigureField({ showLogo: unref(logoVal) });
}

function setFalse(Doms): any {
  Doms.forEach((v) => {
    toggleClass(false, 'is-select', unref(v));
  });
}

/** 页宽 */
const stretchTypeOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.pureStretchFixed'),
      tip: t('panel.pureStretchFixedTip'),
      value: 'fixed',
    },
    {
      label: t('panel.pureStretchCustom'),
      tip: t('panel.pureStretchCustomTip'),
      value: 'custom',
    },
  ];
});

const setStretch = (value) => {
  settings.stretch = value;
  patchConfigureField({ stretch: value }, { emitEvents: false });
};

const stretchTypeChange = ({ option }) => {
  const { value } = option;
  value === 'custom' ? setStretch(1440) : setStretch(false);
};

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

const pClass = computed(() => {
  return ['mb-[12px]!', 'font-medium', 'text-sm', 'dark:text-white'];
});

const themeOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.pureOverallStyleLight'),
      icon: DayIcon,
      theme: 'light',
      tip: t('panel.pureOverallStyleLightTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
    {
      label: t('panel.pureOverallStyleDark'),
      icon: DarkIcon,
      theme: 'dark',
      tip: t('panel.pureOverallStyleDarkTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
    {
      label: t('panel.pureOverallStyleSystem'),
      icon: SystemIcon,
      theme: 'system',
      tip: t('panel.pureOverallStyleSystemTip'),
      iconAttrs: { fill: isDark.value ? '#fff' : '#000' },
    },
  ];
});

const markOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: t('panel.pureTagsStyleSmart'),
      tip: t('panel.pureTagsStyleSmartTip'),
      value: 'smart',
    },
    {
      label: t('panel.pureTagsStyleCard'),
      tip: t('panel.pureTagsStyleCardTip'),
      value: 'card',
    },
    {
      label: t('panel.pureTagsStyleChrome'),
      tip: t('panel.pureTagsStyleChromeTip'),
      value: 'chrome',
    },
  ];
});

/** 设置导航模式 */
function setLayoutModel(layout: string) {
  setLayoutMode(layout);
}

watch($storage, ({ layout }) => {
  switch (layout['layout']) {
    case 'vertical':
      toggleClass(true, 'is-select', unref(verticalRef));
      debounce(setFalse([horizontalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case 'horizontal':
      toggleClass(true, 'is-select', unref(horizontalRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case 'mix':
      toggleClass(true, 'is-select', unref(mixRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([horizontalRef]), 50);
      break;
  }
});

onBeforeMount(() => {
  /* 初始化系统配置 */
  nextTick(() => {
    settings.greyVal && document.querySelector('html')?.classList.add('html-grey');
    settings.weakVal && document.querySelector('html')?.classList.add('html-weakness');
    settings.tabsVal && tagsChange();
    settings.hideFooter && hideFooterChange();
  });
});

/** 切换浅色 / 深色 / 跟随系统 */
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
  <LayPanel>
    <div class="p-5">
      <p :class="pClass">{{ t('panel.pureOverallStyle') }}</p>
      <Segmented
        :modelValue="overallStyle === 'system' ? 2 : dataTheme ? 1 : 0"
        :options="themeOptions"
        class="select-none"
        resize
        @change="handleOverallStyleChange"
      />

      <p :class="['mt-5!', pClass]">{{ t('panel.pureThemeColor') }}</p>
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

      <p :class="['mt-5!', pClass]">{{ t('panel.pureLayoutModel') }}</p>
      <ul class="pure-theme">
        <li
          ref="verticalRef"
          v-tippy="{
            content: t('panel.pureVerticalTip'),
            zIndex: 41000,
          }"
          :class="layoutTheme.layout === 'vertical' ? 'is-select' : ''"
          @click="setLayoutModel('vertical')"
        >
          <div />
          <div />
        </li>
        <li
          v-if="device !== 'mobile'"
          ref="horizontalRef"
          v-tippy="{
            content: t('panel.pureHorizontalTip'),
            zIndex: 41000,
          }"
          :class="layoutTheme.layout === 'horizontal' ? 'is-select' : ''"
          @click="setLayoutModel('horizontal')"
        >
          <div />
          <div />
        </li>
        <li
          v-if="device !== 'mobile'"
          ref="mixRef"
          v-tippy="{
            content: t('panel.pureMixTip'),
            zIndex: 41000,
          }"
          :class="layoutTheme.layout === 'mix' ? 'is-select' : ''"
          @click="setLayoutModel('mix')"
        >
          <div />
          <div />
        </li>
      </ul>

      <span v-if="useAppStoreHook().getViewportWidth > 1280">
        <p :class="['mt-5!', pClass]">{{ t('panel.pureStretch') }}</p>
        <Segmented
          :modelValue="isNumber(settings.stretch) ? 1 : 0"
          :options="stretchTypeOptions"
          class="mb-2 select-none"
          resize
          @change="stretchTypeChange"
        />
        <el-input-number
          v-if="isNumber(settings.stretch)"
          v-model="settings.stretch as number"
          :max="1600"
          :min="1280"
          controls-position="right"
          @change="(value) => setStretch(value)"
        />
        <button
          v-else
          v-ripple="{ class: 'text-gray-300' }"
          class="bg-transparent flex-c w-full h-20 rounded-md border border-(--pure-border-color)"
          @click="setStretch(!settings.stretch)"
        >
          <div
            :class="[settings.stretch ? 'w-[24%]' : 'w-[50%]']"
            class="flex-bc transition-all duration-300"
            style="color: var(--el-color-primary)"
          >
            <IconifyIconOffline :icon="settings.stretch ? RightArrow : LeftArrow" />
            <div class="grow border-0 border-b border-dashed" style="border-color: var(--el-color-primary)" />
            <IconifyIconOffline :icon="settings.stretch ? LeftArrow : RightArrow" />
          </div>
        </button>
      </span>

      <p :class="['mt-4!', pClass]">{{ t('panel.pureTagsStyle') }}</p>
      <Segmented
        :modelValue="markValue === 'smart' ? 0 : markValue === 'card' ? 1 : 2"
        :options="markOptions"
        class="select-none"
        resize
        @change="onChange"
      />

      <p class="mt-5! font-medium text-sm dark:text-white">
        {{ t('panel.pureInterfaceDisplay') }}
      </p>
      <ul class="setting">
        <li>
          <span class="dark:text-white">{{ t('panel.pureGreyModel') }}</span>
          <el-switch
            v-model="settings.greyVal"
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            inline-prompt
            @change="greyChange"
          />
        </li>
        <li>
          <span class="dark:text-white">{{ t('panel.pureWeakModel') }}</span>
          <el-switch
            v-model="settings.weakVal"
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            inline-prompt
            @change="weekChange"
          />
        </li>
        <li>
          <span class="dark:text-white">{{ t('panel.pureHiddenTags') }}</span>
          <el-switch
            v-model="settings.tabsVal"
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            inline-prompt
            @change="tagsChange"
          />
        </li>
        <li>
          <span class="dark:text-white">{{ t('panel.pureHiddenFooter') }}</span>
          <el-switch
            v-model="settings.hideFooter"
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            inline-prompt
            @change="hideFooterChange"
          />
        </li>
        <li>
          <span class="dark:text-white">Logo</span>
          <el-switch
            v-model="logoVal"
            :active-text="t('buttons.pureOpenText')"
            :active-value="true"
            :inactive-text="t('buttons.pureCloseText')"
            :inactive-value="false"
            inline-prompt
            @change="logoChange"
          />
        </li>
        <li>
          <span class="dark:text-white">
            {{ t('panel.pureMultiTagsCache') }}
          </span>
          <el-switch
            v-model="settings.multiTagsCache"
            :active-text="t('buttons.pureOpenText')"
            :inactive-text="t('buttons.pureCloseText')"
            inline-prompt
            @change="multiTagsCacheChange"
          />
        </li>
      </ul>
    </div>
  </LayPanel>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}

:deep(.el-switch__core) {
  --el-switch-off-color: var(--pure-switch-off-color);

  min-width: 36px;
  height: 18px;
}

:deep(.el-switch__core .el-switch__action) {
  height: 14px;
}

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

.pure-theme {
  display: flex;
  gap: 12px;

  li {
    position: relative;
    width: 46px;
    height: 36px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30%;
          height: 70%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}

.is-select {
  border: 2px solid var(--el-color-primary);
}

.setting {
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 14px;
  }
}
</style>
