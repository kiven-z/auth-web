<script lang="ts" setup>
import MenuElTreeView from '@/features/system/menu/components/MenuElTreeView.vue';
import MenuTableView from '@/features/system/menu/components/MenuTableView.vue';
import useMenuPageState from '@/features/system/menu/hooks/useMenuPageState';
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
  <div>
    <div class="flex justify-center -mt-5 pb-1">
      <el-segmented v-model="viewMode" :options="segmentedOptions" />
    </div>

    <MenuTableView v-if="viewMode === 'table'" />
    <MenuElTreeView v-else />
  </div>
</template>
