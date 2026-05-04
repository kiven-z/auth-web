<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineOptions({
  name: 'Welcome',
});
</script>

<template>
  <div class="w-full">
    <h1 class="text-amber-700">Language： {{ t('menus.pureHome') }}</h1>
  </div>
</template>
