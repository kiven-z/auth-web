<script lang="ts" setup>
import type { SysPermissionBoundMenuItem, SysPermissionBoundRoleItem } from '@/api/system/permission';
import AuthDataTable from '@/components/ui/AuthDataTable';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/permission/constants/permission-search-options';
import usePermissionBindingMenuColumns from '@/views/system/permission/hooks/usePermissionBindingMenuColumns';
import usePermissionBindingRoleColumns from '@/views/system/permission/hooks/usePermissionBindingRoleColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PermissionBindingRefsSection',
});

interface PermissionBindingRefsSectionProps {
  permissionType: number;
  boundRoles: SysPermissionBoundRoleItem[];
  boundMenus: SysPermissionBoundMenuItem[];
}

const props = defineProps<PermissionBindingRefsSectionProps>();

const { t } = useI18n();

const { columns: roleBindingColumns } = usePermissionBindingRoleColumns();
const { columns: menuBindingColumns } = usePermissionBindingMenuColumns();

const buttonPermissionType = PERMISSION_TYPE_FILTER_OPTIONS[0].value;

// 是否为按钮权限（仅按钮权限展示菜单绑定）
const isButtonPermission = computed(() => props.permissionType === buttonPermissionType);
</script>

<template>
  <div class="permission-binding-refs">
    <el-divider />

    <section class="permission-binding-refs__section">
      <div class="permission-binding-refs__title">
        <!-- 已绑定角色 -->
        <span>{{ t('permissions.boundRolesTitle') }}</span>
        <el-badge :value="boundRoles.length" class="permission-binding-refs__badge" type="primary" />
      </div>

      <AuthDataTable
        v-if="boundRoles.length"
        :columns="roleBindingColumns"
        :data="boundRoles"
        border
        class="permission-binding-refs__table"
        max-height="220"
        row-key="roleCode"
        size="small"
        stripe
      />
      <el-text v-else class="permission-binding-refs__empty" type="info">
        {{ t('permissions.boundRolesEmpty') }}
      </el-text>
    </section>

    <section class="permission-binding-refs__section">
      <div class="permission-binding-refs__title">
        <!-- 已绑定菜单 -->
        <span>{{ t('permissions.boundMenusTitle') }}</span>
        <el-badge
          v-if="isButtonPermission"
          :value="boundMenus.length"
          class="permission-binding-refs__badge"
          type="primary"
        />
      </div>

      <template v-if="isButtonPermission">
        <AuthDataTable
          v-if="boundMenus.length"
          :columns="menuBindingColumns"
          :data="boundMenus"
          border
          class="permission-binding-refs__table"
          max-height="220"
          row-key="id"
          size="small"
          stripe
        />
        <el-text v-else class="permission-binding-refs__empty" type="info">
          {{ t('permissions.boundMenusEmpty') }}
        </el-text>
      </template>
      <el-text v-else class="permission-binding-refs__empty" type="info">
        {{ t('permissions.boundMenusNotApplicable') }}
      </el-text>
    </section>
  </div>
</template>

<style scoped>
.permission-binding-refs__section + .permission-binding-refs__section {
  margin-top: 16px;
}

.permission-binding-refs__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.permission-binding-refs__badge {
  margin-left: 4px;
}

.permission-binding-refs__table {
  width: 100%;
}

.permission-binding-refs__empty {
  display: block;
  padding: 8px 0;
}
</style>
