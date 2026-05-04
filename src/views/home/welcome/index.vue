<script lang="ts" setup>
import AuthDataTable from '@/components/ui/AuthDataTable';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineOptions({
  name: 'Welcome',
});

const demoColumns = computed<TableColumnList>(() => [
  { label: t('menus.pureTableDemoName'), prop: 'name', minWidth: 120 },
]);
const demoData = [{ name: 'xxx' }];
</script>

<template>
  <div class="w-full">
    <h1 class="text-amber-700">Language： {{ t('menus.pureHome') }}</h1>

    <AuthDataTable :columns="demoColumns" :data="demoData" />
  </div>
</template>
