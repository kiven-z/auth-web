<script lang="ts" setup>
import { useLayout } from '@/layout/hooks/layout/useLayout';
import { useTranslationLang } from '@/layout/hooks/locale/useTranslationLang';
import { useUiTheme } from '@/layout/hooks/theme/useUiTheme';
import { getAppTitle } from '@/layout/utils/brand';
import useLogin from './hooks/useLogin';

import avatar from '@/assets/login/avatar.svg?component';
import bg from '@/assets/login/bg.png';
import illustration from '@/assets/login/illustration.svg?component';
import darkIcon from '@/assets/svg/dark.svg?component';
import dayIcon from '@/assets/svg/day.svg?component';
import globalization from '@/assets/svg/globalization.svg?component';
import Check from '~icons/ep/check';

import Segmented from '@/components/ui/Segmented';
import { formComponentMap } from '@/views/home/login/constants/login-registry';
import { computed } from 'vue';
import Motion from './components/Motion';
import { useLoginModeOptions } from './hooks/useLoginModeOptions';

defineOptions({
  name: 'AuthLogin',
});

const { initStorage } = useLayout();

const { dataTheme, overallStyle, dataThemeChange } = useUiTheme();
const title = getAppTitle();
const { locale, translation, localeOptions, getDropdownItemStyle, getDropdownItemClass } = useTranslationLang();

const { currentMode, formKey, switchMode, onLoginSuccess } = useLogin();
const loginModeOptions = useLoginModeOptions();

const activeFormComponent = computed(() => formComponentMap[currentMode.value]);
const currentModeIndex = computed(() => loginModeOptions.value.findIndex((item) => item.value === currentMode.value));

initStorage();
dataThemeChange(overallStyle.value);
</script>

<template>
  <div class="select-none h-full">
    <img :src="bg" alt="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <el-switch
        v-model="dataTheme"
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        inline-prompt
        @change="dataThemeChange"
      />
      <el-dropdown trigger="click">
        <globalization
          class="hover:text-primary hover:bg-transparent! w-5 h-5 ml-1.5 cursor-pointer outline-hidden duration-300"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              v-for="item in localeOptions"
              :key="item.locale"
              :class="['dark:text-white!', getDropdownItemClass(locale, item.locale)]"
              :style="getDropdownItemStyle(locale, item.locale)"
              @click="translation(item.locale)"
            >
              <IconifyIconOffline v-show="locale === item.locale" :icon="Check" class="check-icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="login-container">
      <div class="img">
        <component :is="illustration" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="text-center outline-hidden">{{ title }}</h2>
          </Motion>

          <!-- 动态切换表单组件，:key 变化时 Vue 销毁重建触发入场动画 -->
          <Motion :delay="50">
            <component :is="activeFormComponent" :key="formKey" @login-success="onLoginSuccess" />
          </Motion>

          <Segmented
            :model-value="currentModeIndex"
            :options="loginModeOptions"
            block
            class="mt-2"
            size="default"
            @change="({ option }) => switchMode(option.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './styles/login';
</style>
