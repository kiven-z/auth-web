<script lang="ts" setup>
import { getMenuPermissions } from '@/api/system/menu';
import PermissionAssignDrawer from '@/views/system/_shared/components/PermissionAssignDrawer.vue';
import { transformI18n } from '@/plugins/i18n';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'MenuAssignPermissionDrawer' });

const props = defineProps<{
  menuId: string;
  menuTitle: string;
  menuName: string;
}>();

const { t } = useI18n();
const innerRef = ref<InstanceType<typeof PermissionAssignDrawer> | null>(null);

/**
 * 加载菜单已分配权限
 * @returns 已分配权限
 */
const loadAssigned = async () => {
  const list = await getMenuPermissions(props.menuId);
  return list
    .filter((row) => row.assigned)
    .map((row) => ({
      key: row.permissionCode,
      label: row.permissionName,
    }));
};

defineExpose({
  getSelectedKeys: () => innerRef.value?.getSelectedKeys() ?? [],
});
</script>

<template>
  <PermissionAssignDrawer
    ref="innerRef"
    :fixed-permission-type="0"
    :left-subtitle="`${transformI18n(menuTitle)} (${menuName})`"
    :left-title="t('sysMenu.assignCurrentMenu')"
    :load-assigned="loadAssigned"
    :table-title="t('sysMenu.assignPermissionTitle')"
  />
</template>
