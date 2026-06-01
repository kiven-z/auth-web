<script lang="ts" setup>
import type { SysRoleBoundPermissionItem } from '@/api/system/role';
import AuthDataTable from '@/components/ui/AuthDataTable';
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

    <section class="role-binding-permissions__section">
      <div class="role-binding-permissions__title">
        <!-- 已分配权限 -->
        <span>{{ t('roles.boundPermissionsTitle') }}</span>
        <el-badge :value="permissions.length" class="role-binding-permissions__badge" type="primary" />
      </div>

      <AuthDataTable
        v-if="permissions.length"
        :columns="columns"
        :data="permissions"
        border
        class="role-binding-permissions__table"
        max-height="220"
        row-key="permissionCode"
        size="small"
        stripe
      />
      <el-text v-else class="role-binding-permissions__empty" type="info">
        {{ t('roles.boundPermissionsEmpty') }}
      </el-text>
    </section>
  </div>
</template>

<style scoped>
.role-binding-permissions__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.role-binding-permissions__badge {
  margin-left: 4px;
}

.role-binding-permissions__table {
  width: 100%;
}

.role-binding-permissions__empty {
  display: block;
  padding: 8px 0;
}
</style>
