<script lang="ts" setup>
import { getMenuRoles } from '@/api/system/menu';
import { getRolePage } from '@/api/system/role';
import AssignManagePanel from '@/components/business/AssignManagePanel/index';
import type { AuthAssignPageQuery, AuthAssignSeedItem } from '@/components/business/AssignManagePanel/src/types';
import { transformI18n } from '@/plugins/i18n';
import { errorMessage } from '@/shared/messaging/message';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useMenuTableColumns from '../hooks/useMenuTableColumns';

defineOptions({ name: 'MenuAssignRoleDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const seedLoading = ref(true);
const seedReady = ref(false);
const seed = ref<AuthAssignSeedItem[]>([]);
const assignRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);

const { roleDrawerDataColumns } = useMenuTableColumns();

/**
 * 角色分页：关键词按角色名称模糊查询
 */
async function fetchRolePage(query: AuthAssignPageQuery) {
  return getRolePage({
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
    status: true,
    roleType: 2,
    roleName: query.keyword || undefined,
  });
}

/**
 * 加载已分配角色种子数据
 */
const loadAssignedSeed = async () => {
  seedLoading.value = true;
  try {
    const list = await getMenuRoles(props.menuId);
    seed.value = list.map((row) => ({ key: row.roleCode, label: row.roleName }));
  } catch (error: unknown) {
    errorMessage(error, { defaultI18nKey: 'sysMenu.assignLoadFailed' });
  } finally {
    seedLoading.value = false;
    seedReady.value = true;
  }
};

/**
 * 供抽屉 beforeSure 读取当前勾选
 */
function getSelectedKeys(): string[] {
  return assignRef.value?.getSelectedKeys() ?? [];
}

onMounted(() => {
  void loadAssignedSeed();
});

defineExpose({ getSelectedKeys });
</script>

<template>
  <div v-loading="seedLoading" class="flex min-h-0 w-full flex-1 flex-col">
    <AssignManagePanel
      v-if="seedReady"
      ref="assignRef"
      :assigned-seed="seed"
      :columns="roleDrawerDataColumns"
      :fetch-page="fetchRolePage"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :search-placeholder="t('sysMenu.assignRoleSearch')"
      row-key="roleCode"
    />
  </div>
</template>
