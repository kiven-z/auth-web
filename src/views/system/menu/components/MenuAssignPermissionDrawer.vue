<script lang="ts" setup>
import { getMenuPermissions, putMenuPermissions } from '@/api/system/menu';
import { getPermissionPage } from '@/api/system/permission';
import AssignManagePanel from '@/components/business/AssignManagePanel/index';
import type { AuthAssignPageQuery, AuthAssignSeedItem } from '@/components/business/AssignManagePanel/src/types';
import { transformI18n } from '@/plugins/i18n';
import { errorMessage, message } from '@/shared/messaging/message';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useMenuTableColumns from '../hooks/useMenuTableColumns';

defineOptions({ name: 'MenuAssignPermissionDrawer' });

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

const { permissionDrawerDataColumns } = useMenuTableColumns();

/**
 * 权限分页：关键词按权限名称模糊查询
 * @param query 分页查询参数
 * @returns 权限分页数据
 */
async function fetchPermissionPage(query: AuthAssignPageQuery) {
  // FIXME 可以移除
  return getPermissionPage({
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
    status: true,
    permissionType: 0,
    permissionName: query.keyword || undefined,
  });
}

/**
 * 获取权限列表
 */
const fetchTableData = async () => {
  seedLoading.value = true;
  try {
    // 获取菜单权限列表
    const list = await getMenuPermissions(props.menuId);
    // 转换为 AssignManagePanel 组件所需的格式
    seed.value = list.map((r) => ({ key: r.permissionCode, label: r.permissionName }));
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
    // 当前分配的权限
    const permissionCodes = assignRef.value?.getSelectedKeys() ?? [];
    // 保存分配的权限
    await putMenuPermissions(props.menuId, { permissionCodes });
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
    <AssignManagePanel
      v-if="seedReady"
      ref="assignRef"
      :assigned-seed="seed"
      :columns="permissionDrawerDataColumns"
      :fetch-page="fetchPermissionPage"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :saving="saving"
      :search-placeholder="t('sysMenu.assignPermissionSearch')"
      mode="page"
      row-key="permissionCode"
    />
  </div>
</template>
