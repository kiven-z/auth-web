<script lang="ts" setup>
import type { SysRoleBoundPermissionItem } from '@/api/system/role';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import useRoleBindingPermissionColumns from '@/views/system/role/hooks/useRoleBindingPermissionColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'RoleBindingPermissionsSection',
});

interface RoleBindingPermissionsSectionProps {
  boundPermissions: SysRoleBoundPermissionItem[];
}

const props = defineProps<RoleBindingPermissionsSectionProps>();

const { t } = useI18n();

const { columns } = useRoleBindingPermissionColumns();

const permissions = computed(() => props.boundPermissions ?? []);
</script>

<template>
  <div class="role-binding-permissions">
    <el-divider />

    <DetailRelationListSection
      :columns="columns"
      :empty-text="t('roles.boundPermissionsEmpty')"
      :items="permissions"
      :title="t('roles.boundPermissionsTitle')"
      row-key="permissionCode"
    />
  </div>
</template>
