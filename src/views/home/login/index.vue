<script lang="ts" setup>
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';
import { useLayout } from '@/layout/hooks/useLayout';
import { useNav } from '@/layout/hooks/useNav';
import { useTranslationLang } from '@/layout/hooks/useTranslationLang';
import useLogin from './hooks/useLogin';

import avatar from '@/assets/login/avatar.svg?component';
import bg from '@/assets/login/bg.png';
import illustration from '@/assets/login/illustration.svg?component';
import darkIcon from '@/assets/svg/dark.svg?component';
import dayIcon from '@/assets/svg/day.svg?component';
import globalization from '@/assets/svg/globalization.svg?component';
import Check from '~icons/ep/check';

import Segmented from '@/components/ui/Segmented';
import { formComponentMap, loginModes } from '@/views/home/login/constants/login-registry';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Motion from './components/Motion';

defineOptions({
  name: 'AuthLogin',
});

const { t } = useI18n();

const { initStorage } = useLayout();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translation, localeOptions } = useTranslationLang();

const { currentMode, formKey, switchMode, onLoginSuccess } = useLogin();

const activeFormComponent = computed(() => formComponentMap[currentMode.value]);

initStorage();
dataThemeChange(overallStyle.value);
</script>

<template>
  <div class="select-none">
    <img :src="bg" alt="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        inline-prompt
        @change="dataThemeChange"
      />
      <!-- 国际化 -->
      <el-dropdown trigger="click">
        <globalization
          class="hover:text-primary hover:bg-transparent! w-[20px] h-[20px] ml-1.5 cursor-pointer outline-hidden duration-300"
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
            <h2 class="outline-hidden">{{ title }}</h2>
          </Motion>

          <!-- 动态切换表单组件，:key 变化时 Vue 销毁重建触发入场动画 -->
          <Motion :delay="50">
            <component :is="activeFormComponent" :key="formKey" @login-success="onLoginSuccess" />
          </Motion>

          <!-- 登录方式切换 — Segmented 分段控制器 -->
          <Segmented
            :model-value="loginModes.findIndex((item) => item.mode === currentMode)"
            :options="loginModes.map((item) => ({ label: t(item.labelKey), value: item.mode }))"
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
