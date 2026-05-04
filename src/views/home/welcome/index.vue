<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import PureTable from '@pureadmin/table';

const { t } = useI18n();
defineOptions({
  name: 'Welcome',
});
</script>

<template>
  <div class="w-full">
    <h1 class="text-amber-700">Language： {{ t('menus.pureHome') }}</h1>

    <pure-table :columns="[{ title: 'Name', dataIndex: 'name' }]" :data="[{ name: 'xxx' }]" />
  </div>
</template>
