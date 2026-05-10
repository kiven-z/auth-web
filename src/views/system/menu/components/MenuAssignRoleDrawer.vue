<script lang="ts" setup>
import { getMenuRoles, putMenuRoles } from '@/api/system/menu';
import { getRolePage } from '@/api/system/role';
import AssignManagePanel from '@/components/business/AssignManagePanel/index.vue';
import type { AssignManagePageQuery, AssignManageSeedItem } from '@/components/business/AssignManagePanel/types';
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
const seed = ref<AssignManageSeedItem[]>([]);
const panelRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);

const { roleDrawerDataColumns } = useMenuTableColumns();

/**
 * 角色分页：关键词按角色名称模糊查询（与列表页条件一致；编码搜索需后端 keyword 能力后再扩展）。
 */
async function fetchRolePage(query: AssignManagePageQuery) {
  return getRolePage({
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
    roleName: query.keyword || undefined,
  });
}

onMounted(async () => {
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
});

/**
 * 保存分配（由抽屉 footer 调用）
 */
const saveData = async (): Promise<boolean> => {
  saving.value = true;
  try {
    const roleCodes = panelRef.value?.getSelectedKeys() ?? [];
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

defineExpose({ saveData });
</script>

<template>
  <div v-loading="seedLoading" class="h-full min-h-0 flex flex-col">
    <AssignManagePanel
      v-if="seedReady"
      ref="panelRef"
      mode="page"
      class="min-h-0 flex-1"
      :left-title="t('sysMenu.assignCurrentMenu')"
      :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
      :search-placeholder="t('sysMenu.assignRoleSearch')"
      :columns="roleDrawerDataColumns"
      row-key="roleCode"
      :assigned-seed="seed"
      :fetch-page="fetchRolePage"
      :saving="saving"
    />
  </div>
</template>
