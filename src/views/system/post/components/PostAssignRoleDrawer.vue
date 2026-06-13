<script lang="ts" setup>
import { getPostRoles } from '@/api/system/post';
import OrgGrantRoleAssignDrawer from '@/views/system/_shared/components/OrgGrantRoleAssignDrawer.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'PostAssignRoleDrawer' });

const props = defineProps<{
  postId: string;
  postName: string;
  postCode: string;
}>();

const { t } = useI18n();
const innerRef = ref<InstanceType<typeof OrgGrantRoleAssignDrawer> | null>(null);

/**
 * 加载岗位已分配角色
 * @returns 已分配角色
 */
const loadAssigned = async () => {
  const rows = await getPostRoles(props.postId);
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
    :left-subtitle="`${postName}（${postCode}）`"
    :left-title="t('post.assign.current')"
    :load-assigned="loadAssigned"
  />
</template>
