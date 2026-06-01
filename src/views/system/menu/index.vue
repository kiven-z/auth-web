<script lang="ts" setup>
import AuthModuleTableTreeLayout from '@/components/business/AuthModuleTableTreeLayout';
import MenuElTreeView from '@/views/system/menu/components/MenuElTreeView.vue';
import MenuTableView from '@/views/system/menu/components/MenuTableView.vue';
import useMenuPageState from '@/views/system/menu/hooks/useMenuPageState';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemMenu',
});

const { t } = useI18n();

const segmentedOptions = computed(() => [
  { label: t('sysMenu.viewTableTitle'), value: 'table' as const },
  { label: t('sysMenu.viewTreeTitle'), value: 'tree' as const },
]);

const { viewMode } = useMenuPageState();
</script>

<template>
  <AuthModuleTableTreeLayout v-model="viewMode" :options="segmentedOptions">
    <template #table>
      <MenuTableView />
    </template>
    <template #tree>
      <MenuElTreeView />
    </template>
  </AuthModuleTableTreeLayout>
</template>
