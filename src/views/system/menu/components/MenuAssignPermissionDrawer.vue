<script lang="ts" setup>
import { getMenuPermissions } from '@/api/system/menu';
import { getPermissionPage } from '@/api/system/permission';
import AssignManagePanel from '@/components/business/AssignManagePanel/index';
import type { AuthAssignPageQuery, AuthAssignSeedItem } from '@/components/business/AssignManagePanel/src/types';
import { transformI18n } from '@/plugins/i18n';
import { errorMessage } from '@/shared/messaging/message';
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
const seedLoading = ref(true);
const seedReady = ref(false);
const seed = ref<AuthAssignSeedItem[]>([]);
const assignRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);

const { permissionDrawerDataColumns } = useMenuTableColumns();

/**
 * 权限分页：关键词按权限名称模糊查询
 */
async function fetchPermissionPage(query: AuthAssignPageQuery) {
  return getPermissionPage({
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
    status: true,
    permissionType: 0,
    permissionName: query.keyword || undefined,
  });
}

/**
 * 加载已分配权限种子数据
 */
const loadAssignedSeed = async () => {
  seedLoading.value = true;
  try {
    const list = await getMenuPermissions(props.menuId);
    seed.value = list.map((row) => ({ key: row.permissionCode, label: row.permissionName }));
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
      :columns="permissionDrawerDataColumns"
      :fetch-page="fetchPermissionPage"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :search-placeholder="t('sysMenu.assignPermissionSearch')"
      row-key="permissionCode"
    />
  </div>
</template>
