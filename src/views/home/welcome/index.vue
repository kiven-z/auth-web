<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'AuthWelcome',
});

const { t } = useI18n();
</script>

<template>
  <div class="w-full">
    <h1 class="text-amber-700">{{ t('menus.home') }}</h1>
  </div>
</template>
