<script lang="ts" setup>
import { getMenuPermissions, putMenuPermissions } from '@/api/system/menu';
import AssignManagePanel from '@/components/business/AssignManagePanel/index.vue';
import { transformI18n } from '@/plugins/i18n';
import { errorMessage, message } from '@/shared/messaging/message';
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
const saving = ref(false);
const panelRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);

const { permissionDrawerDataColumns } = useMenuTableColumns();

const fetchAllPermissions = () => getMenuPermissions(props.menuId);

/**
 * 保存分配（由抽屉 footer 调用）
 */
const saveData = async (): Promise<boolean> => {
  saving.value = true;
  try {
    const permissionCodes = panelRef.value?.getSelectedKeys() ?? [];
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

defineExpose({ saveData });
</script>

<template>
  <AssignManagePanel
    ref="panelRef"
    mode="all"
    class="h-full min-h-0 flex flex-col"
    :left-title="t('sysMenu.assignCurrentMenu')"
    :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
    :search-placeholder="t('sysMenu.assignPermissionSearch')"
    :columns="permissionDrawerDataColumns"
    row-key="permissionCode"
    :fetch-all-rows="fetchAllPermissions"
    :saving="saving"
  />
</template>
