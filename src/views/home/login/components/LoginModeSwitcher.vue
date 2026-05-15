<script lang="ts" setup>
import Motion from './Motion';

import { useI18n } from 'vue-i18n';
import { LoginMode } from '@/views/home/login/constants/types';
import { loginModes } from '@/views/home/login/constants/login-config';

defineOptions({ name: 'LoginModeSwitcher' });

defineProps<{
  currentMode: LoginMode;
}>();

const emit = defineEmits<{
  (e: 'switch', mode: LoginMode): void;
}>();

const { t } = useI18n();
</script>

<template>
  <Motion :delay="350">
    <el-button-group class="mt-2">
      <el-button
        v-for="item in loginModes"
        :key="item.mode"
        :type="currentMode === item.mode ? 'primary' : ''"
        class="flex-1"
        @click="emit('switch', item.mode)"
      >
        {{ t(item.labelKey) }}
      </el-button>
    </el-button-group>
  </Motion>
</template>
