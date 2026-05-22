<script lang="ts" setup>
import { getMenuRoles, putMenuRoles } from '@/api/system/menu';
import { getRolePage } from '@/api/system/role';
import AssignManagePanel from '@/components/business/AssignManagePanel/index';
import type { AuthAssignPageQuery, AuthAssignSeedItem } from '@/components/business/AssignManagePanel/src/types';
import { transformI18n } from '@/plugins/i18n';
import { errorMessage, message } from '@/shared/messaging/message';
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
const saving = ref(false);
const seedLoading = ref(true);
const seedReady = ref(false);
const seed = ref<AuthAssignSeedItem[]>([]);
const assignRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);

const { roleDrawerDataColumns } = useMenuTableColumns();

/**
 * 角色分页：关键词按角色名称模糊查询
 * @param query 分页查询参数
 * @returns 角色分页数据
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
 * 获取角色列表
 */
const fetchTableData = async () => {
  seedLoading.value = true;
  try {
    const list = await getMenuRoles(props.menuId);
    seed.value = list.map((r) => ({ key: r.roleCode, label: r.roleName }));
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'sysMenu.assignLoadFailed' });
  } finally {
    seedLoading.value = false;
    seedReady.value = true;
  }
};

/**
 * 保存分配（由抽屉 footer 调用）
 */
const saveData = async (): Promise<boolean> => {
  saving.value = true;
  try {
    const roleCodes = assignRef.value?.getSelectedKeys() ?? [];
    await putMenuRoles(props.menuId, { roleCodes });
    message(t('sysMenu.assignSaveSuccess'), { type: 'success' });
    return true;
  } catch (e: unknown) {
    errorMessage(e, { defaultI18nKey: 'sysMenu.assignSaveFailed' });
    return false;
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchTableData();
});

defineExpose({ saveData });
</script>

<template>
  <div v-loading="seedLoading" class="flex min-h-0 w-full flex-1 flex-col">
    <!-- FIXME 可以删除 mode没有这个传参 -->
    <AssignManagePanel
      v-if="seedReady"
      ref="assignRef"
      :assigned-seed="seed"
      :columns="roleDrawerDataColumns"
      :fetch-page="fetchRolePage"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :saving="saving"
      :search-placeholder="t('sysMenu.assignRoleSearch')"
      mode="page"
      row-key="roleCode"
    />
  </div>
</template>
