<script lang="ts" setup>
import { getUserRoles } from '@/api/system/user-role';
import OrgGrantRoleAssignDrawer from '@/views/system/_shared/components/OrgGrantRoleAssignDrawer.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'UserAssignRoleDrawer' });

const props = defineProps<{
  userId: string;
  username: string;
  nickname?: string | null;
}>();

const { t } = useI18n();
const innerRef = ref<InstanceType<typeof OrgGrantRoleAssignDrawer> | null>(null);

/**
 * 加载用户已分配直连角色
 */
const loadAssigned = async () => {
  const rows = await getUserRoles(props.userId);
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
    :left-subtitle="nickname || username"
    :left-title="t('users.assign.current')"
    :load-assigned="loadAssigned"
  />
</template>
