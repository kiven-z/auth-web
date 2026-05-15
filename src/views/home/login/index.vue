<script lang="ts" setup>
import { ApiBusinessError, ApiConflictError } from '@/infrastructure/http-core';
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';
import { useLayout } from '@/layout/hooks/useLayout';
import { useNav } from '@/layout/hooks/useNav';
import { useTranslationLang } from '@/layout/hooks/useTranslationLang';
import { getTopMenu } from '@/router/utils/misc';
import { initRouter } from '@/router/utils/route-registry';
import { message } from '@/shared/messaging/message';
import { useUserStoreHook } from '@/store/modules/user';
import { debounce } from '@pureadmin/utils';
import { useEventListener } from '@vueuse/core';
import { type Component, computed, defineAsyncComponent, markRaw, reactive, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Motion from './components/Motion';
import { type LoginFormProps, LoginMode, type LoginModeMeta } from './utils/types';
import { avatar, bg, illustration } from './utils/static';

import darkIcon from '@/assets/svg/dark.svg?component';
import dayIcon from '@/assets/svg/day.svg?component';
import globalization from '@/assets/svg/globalization.svg?component';
import Check from '~icons/ep/check';

defineOptions({
  name: 'AuthLogin',
});

/** 登录方式 → 表单组件的懒加载映射 */
const formComponentMap: Record<LoginMode, Component> = {
  [LoginMode.UsernamePassword]: markRaw(defineAsyncComponent(() => import('./components/UsernamePasswordForm.vue'))),
  [LoginMode.Email]: markRaw(defineAsyncComponent(() => import('./components/EmailLoginForm.vue'))),
  // 未来： [LoginMode.Mobile]: () => import('./components/MobileLoginForm.vue'),
};

/** 登录方式切换按钮元数据 */
const loginModes: LoginModeMeta[] = [
  { mode: LoginMode.UsernamePassword, labelKey: 'login.authUsernamePasswordLogin' },
  { mode: LoginMode.Email, labelKey: 'login.authEmailLogin' },
  // 未来：
  // { mode: LoginMode.Mobile, labelKey: 'login.authMobileLogin' },
];

const router = useRouter();
const loading = ref(false);
const disabled = ref(false);
const currentMode = ref<LoginMode>(LoginMode.UsernamePassword);
/** 用于切换动画时触发 key 变化，让组件重新挂载获得入场动画 */
const formKey = ref(0);
const formRef = ref<{ handleSubmit: () => void } | null>(null);

const { t } = useI18n();
const { initStorage } = useLayout();
initStorage();
const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translation, localeOptions } = useTranslationLang();

// 当前激活的表单组件
const activeFormComponent = computed(() => formComponentMap[currentMode.value]);

// 注入给子表单的通用 props
const formProps = reactive<LoginFormProps>({
  get loading() {
    return loading.value;
  },
  get disabled() {
    return disabled.value;
  },
});

const switchMode = (mode: LoginMode) => {
  if (mode === currentMode.value) return;
  currentMode.value = mode;
  // 改变 key 让组件销毁重建，从而触发 Motion 入场动画
  formKey.value++;
};

const onLogin = (formData: Record<string, unknown>) => {
  loading.value = true;
  const store = useUserStoreHook();

  let loginPromise: Promise<unknown>;

  if (currentMode.value === LoginMode.UsernamePassword) {
    loginPromise = store.loginByUsername(formData as { username: string; password: string });
  } else if (currentMode.value === LoginMode.Email) {
    loginPromise = store.loginByEmail(formData as { email: string; code: string });
  } else {
    loginPromise = Promise.reject(new Error(`unsupported login mode: ${currentMode.value}`));
  }

  loginPromise
    .then(() => {
      return initRouter().then(() => {
        disabled.value = true;
        router
          .push(getTopMenu(true)?.path ?? '/')
          .then(() => {
            message(t('login.authLoginSuccess'), { type: 'success' });
          })
          .finally(() => (disabled.value = false));
      });
    })
    .catch((err: unknown) => {
      if (err instanceof ApiConflictError) {
        return;
      }
      const text = err instanceof ApiBusinessError ? err.message : t('login.authLoginFail');
      message(text, { type: 'error' });
    })
    .finally(() => (loading.value = false));
};

const loginButtonClick = () => {
  formRef.value?.handleSubmit();
};

const immediateDebounce: any = debounce(loginButtonClick, 1000, true);

useEventListener(document, 'keydown', ({ code }) => {
  if (['Enter', 'NumpadEnter'].includes(code) && !disabled.value && !loading.value) immediateDebounce();
});
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
          class="hover:text-primary hover:bg-[transparent]! w-[20px] h-[20px] ml-1.5 cursor-pointer outline-hidden duration-300"
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
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-hidden">{{ title }}</h2>
          </Motion>

          <!-- 动态切换表单组件，:key 变化时 Vue 销毁重建触发入场动画 -->
          <Motion :delay="50">
            <component :is="activeFormComponent" :key="formKey" ref="formRef" v-bind="formProps" @login="onLogin" />
          </Motion>

          <!-- 登录方式切换按钮 -->
          <Motion :delay="350">
            <el-button-group class="flex mt-2">
              <el-button
                v-for="item in loginModes"
                :key="item.mode"
                :type="currentMode === item.mode ? 'primary' : ''"
                class="flex-1"
                @click="switchMode(item.mode)"
              >
                {{ t(item.labelKey) }}
              </el-button>
            </el-button-group>
          </Motion>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('@/views/home/login/style/login.css');
</style>
