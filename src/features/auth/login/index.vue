<script lang="ts" setup>
import { useRenderIcon } from '@/components/ui/Icon/src/hooks';
import { ApiBusinessError, ApiConflictError } from '@/infrastructure/http/apiError';
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';
import { useLayout } from '@/layout/hooks/useLayout';
import { useNav } from '@/layout/hooks/useNav';
import { useTranslationLang } from '@/layout/hooks/useTranslationLang';
import { $t, transformI18n } from '@/plugins/i18n';
import { getTopMenu, initRouter } from '@/router/utils';
import { message } from '@/shared/messaging/message';
import { useUserStoreHook } from '@/store/modules/user';
import { debounce } from '@pureadmin/utils';
import { useEventListener } from '@vueuse/core';
import type { FormInstance } from 'element-plus';
import { reactive, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Motion from './utils/motion';
import { loginRules } from './utils/rule';
import { avatar, bg, illustration } from './utils/static';

import darkIcon from '@/assets/svg/dark.svg?component';
import dayIcon from '@/assets/svg/day.svg?component';
import globalization from '@/assets/svg/globalization.svg?component';
import Check from '~icons/ep/check';
import Lock from '~icons/ri/lock-fill';
import User from '~icons/ri/user-3-fill';

defineOptions({
  name: 'Login',
});

const router = useRouter();
const loading = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { t } = useI18n();
const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translationCh, translationEn } = useTranslationLang();

const ruleForm = reactive({
  username: 'Administrator',
  password: 'admin123',
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password,
        })
        .then(() => {
          return initRouter().then(() => {
            disabled.value = true;
            router
              .push(getTopMenu(true)?.path ?? '/')
              .then(() => {
                message(t('login.pureLoginSuccess'), { type: 'success' });
              })
              .finally(() => (disabled.value = false));
          });
        })
        .catch((err: unknown) => {
          if (err instanceof ApiConflictError) {
            return;
          }
          const text = err instanceof ApiBusinessError ? err.message : t('login.pureLoginFail');
          message(text, { type: 'error' });
        })
        .finally(() => (loading.value = false));
    }
  });
};

const immediateDebounce: any = debounce((formRef) => onLogin(formRef), 1000, true);

useEventListener(document, 'keydown', ({ code }) => {
  if (['Enter', 'NumpadEnter'].includes(code) && !disabled.value && !loading.value)
    immediateDebounce(ruleFormRef.value);
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
              :class="['dark:text-white!', getDropdownItemClass(locale, 'zh')]"
              :style="getDropdownItemStyle(locale, 'zh')"
              @click="translationCh"
            >
              <IconifyIconOffline v-show="locale === 'zh'" :icon="Check" class="check-zh" />
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :class="['dark:text-white!', getDropdownItemClass(locale, 'en')]"
              :style="getDropdownItemStyle(locale, 'en')"
              @click="translationEn"
            >
              <span v-show="locale === 'en'" class="check-en">
                <IconifyIconOffline :icon="Check" />
              </span>
              English
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

          <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large">
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: transformI18n($t('login.pureUsernameReg')),
                    trigger: 'blur',
                  },
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  :placeholder="t('login.pureUsername')"
                  :prefix-icon="useRenderIcon(User)"
                  clearable
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  :placeholder="t('login.purePassword')"
                  :prefix-icon="useRenderIcon(Lock)"
                  clearable
                  show-password
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                :disabled="disabled"
                :loading="loading"
                class="w-full mt-4!"
                size="default"
                type="primary"
                @click="onLogin(ruleFormRef)"
              >
                {{ t('login.pureLogin') }}
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('@/style/login.css');
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
