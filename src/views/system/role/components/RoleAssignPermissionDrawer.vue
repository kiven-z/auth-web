<script lang="ts" setup>
import { getRolePermissions } from '@/api/system/role';
import PermissionAssignDrawer from '@/views/system/_shared/components/PermissionAssignDrawer.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleAssignPermissionDrawer' });

const props = defineProps<{
  roleCode: string;
  roleName: string;
}>();

const { t } = useI18n();
const innerRef = ref<InstanceType<typeof PermissionAssignDrawer> | null>(null);

const loadAssigned = async () => {
  const rows = await getRolePermissions(props.roleCode);
  return rows.map((row) => ({ key: row.permissionCode, label: row.permissionName }));
};

defineExpose({
  getSelectedKeys: () => innerRef.value?.getSelectedKeys() ?? [],
});
</script>

<template>
  <PermissionAssignDrawer
    ref="innerRef"
    :left-subtitle="`${roleName} (${roleCode})`"
    :left-title="t('roles.assign.current')"
    :load-assigned="loadAssigned"
    :table-title="t('roles.assign.permission')"
    show-permission-type-filter
  />
</template>
