<script lang="ts" setup>
import { getDeptRoles } from '@/api/system/dept';
import OrgGrantRoleAssignDrawer from '@/views/system/_shared/components/OrgGrantRoleAssignDrawer.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DeptAssignRoleDrawer' });

const props = defineProps<{
  deptId: string;
  deptName: string;
  deptCode: string;
}>();

const { t } = useI18n();
const innerRef = ref<InstanceType<typeof OrgGrantRoleAssignDrawer> | null>(null);

const loadAssigned = async () => {
  const rows = await getDeptRoles(props.deptId);
  return rows.map((row) => ({
    key: row.roleCode,
    label: row.roleName,
  }));
};

defineExpose({
  getSelectedKeys: () => innerRef.value?.getSelectedKeys() ?? [],
});
</script>

<template>
  <OrgGrantRoleAssignDrawer
    ref="innerRef"
    :left-subtitle="`${deptName}（${deptCode}）`"
    :left-title="t('dept.assignRole.currentDept')"
    :load-assigned="loadAssigned"
  />
</template>
