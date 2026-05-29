<script lang="ts" setup>
import { getMenuPermissions } from '@/api/system/menu';
import { getPermissionPage } from '@/api/system/permission';
import type { AssignPageQuery } from '@/components/business/AssignManageTablePanel';
import AssignManageTablePanel, { useAssignDrawer } from '@/components/business/AssignManageTablePanel';
import { transformI18n } from '@/plugins/i18n';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useMenuTableColumns from '../hooks/useMenuTableColumns';

defineOptions({ name: 'MenuAssignPermissionDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const tableRef = ref<InstanceType<typeof AssignManageTablePanel> | null>(null);
const { permissionDrawerDataColumns } = useMenuTableColumns();

function fetchPermissionPage(query: AssignPageQuery) {
  return getPermissionPage({
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
    status: true,
    permissionType: 0,
    permissionName: query.keyword || undefined,
  });
}

const { loading, seed, fetchPage } = useAssignDrawer({
  loadSeed: async () => {
    const list = await getMenuPermissions(props.menuId);
    return list.map((row) => ({ key: row.permissionCode, label: row.permissionName }));
  },
  fetchPage: fetchPermissionPage,
});

function getRowLabel(row: Record<string, unknown>): string {
  return String(row.permissionName ?? '');
}

function getSelectedKeys(): string[] {
  return tableRef.value?.getSelectedKeys() ?? [];
}

defineExpose({ getSelectedKeys });
</script>

<template>
  <div v-loading="loading" class="flex min-h-0 w-full flex-1 flex-col">
    <AssignManageTablePanel
      v-if="!loading"
      ref="tableRef"
      :assigned-section-label="t('sysMenu.assignPermissionSectionLabel')"
      :columns="permissionDrawerDataColumns"
      :fetch-page="fetchPage"
      :get-row-label="getRowLabel"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :search-placeholder="t('sysMenu.assignPermissionSearch')"
      :seed="seed"
      row-key="permissionCode"
    />
  </div>
</template>
