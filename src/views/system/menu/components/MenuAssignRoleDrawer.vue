<script lang="ts" setup>
import { getMenuRoles } from '@/api/system/menu';
import { getRolePage } from '@/api/system/role';
import type { AssignPageQuery } from '@/components/business/AssignManageTablePanel';
import AssignManageTablePanel, { useAssignDrawer } from '@/components/business/AssignManageTablePanel';
import { transformI18n } from '@/plugins/i18n';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useMenuTableColumns from '../hooks/useMenuTableColumns';

defineOptions({ name: 'MenuAssignRoleDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const tableRef = ref<InstanceType<typeof AssignManageTablePanel> | null>(null);
const { roleDrawerDataColumns } = useMenuTableColumns();

function fetchRolePage(query: AssignPageQuery) {
  return getRolePage({
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
    status: true,
    roleType: 2,
    roleName: query.keyword || undefined,
  });
}

const { loading, seed, fetchPage } = useAssignDrawer({
  loadSeed: async () => {
    const list = await getMenuRoles(props.menuId);
    return list.map((row) => ({ key: row.roleCode, label: row.roleName }));
  },
  fetchPage: fetchRolePage,
});

function getRowLabel(row: Record<string, unknown>): string {
  return String(row.roleName ?? '');
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
      :assigned-section-label="t('sysMenu.assignRoleSectionLabel')"
      :columns="roleDrawerDataColumns"
      :fetch-page="fetchPage"
      :get-row-label="getRowLabel"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :search-placeholder="t('sysMenu.assignRoleSearch')"
      :seed="seed"
      row-key="roleCode"
    />
  </div>
</template>
