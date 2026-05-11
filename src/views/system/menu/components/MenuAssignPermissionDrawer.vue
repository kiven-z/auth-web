<script lang="ts" setup>
import { getMenuPermissions, putMenuPermissions } from '@/api/system/menu';
import { transformI18n } from '@/plugins/i18n';
import AssignManagePanel from '@/components/business/AssignManagePanel/index';
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
const assignRef = ref<InstanceType<typeof AssignManagePanel> | null>(null);

const { permissionDrawerDataColumns } = useMenuTableColumns();

const fetchAllPermissions = () => getMenuPermissions(props.menuId);

/**
 * 保存分配（由抽屉 footer 调用）
 */
const saveData = async (): Promise<boolean> => {
  saving.value = true;
  try {
    const permissionCodes = assignRef.value?.getSelectedKeys() ?? [];
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
    ref="assignRef"
    :columns="permissionDrawerDataColumns"
    :fetch-all-rows="fetchAllPermissions"
    :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
    :left-title="t('sysMenu.assignCurrentMenu')"
    :saving="saving"
    :search-placeholder="t('sysMenu.assignPermissionSearch')"
    mode="all"
    row-key="permissionCode"
  />
</template>
