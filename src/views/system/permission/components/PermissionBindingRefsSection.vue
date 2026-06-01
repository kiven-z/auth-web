<script lang="ts" setup>
import type { SysPermissionBoundMenuItem, SysPermissionBoundRoleItem } from '@/api/system/permission';
import { menuTypeFilterOptions } from '@/views/system/menu/constants/menu-search-options';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/permission/constants/permission-search-options';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/role/constants/role-search-options';
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

const buttonPermissionType = PERMISSION_TYPE_FILTER_OPTIONS[0].value;

/** 是否为按钮权限（仅按钮权限展示菜单绑定） */
const isButtonPermission = computed(() => props.permissionType === buttonPermissionType);

/**
 * 解析角色类型标签配置
 * @param roleType 角色类型
 */
const resolveRoleTypeOption = (roleType: number) =>
  ROLE_TYPE_FILTER_OPTIONS.find((option) => option.value === roleType);

/**
 * 解析菜单类型文案键
 * @param menuType 菜单类型
 */
const resolveMenuTypeLabelKey = (menuType: number) =>
  menuTypeFilterOptions.find((option) => option.value === menuType)?.labelKey;
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

      <el-table
        v-if="boundRoles.length"
        :data="boundRoles"
        border
        class="permission-binding-refs__table"
        max-height="220"
        size="small"
        stripe
      >
        <!-- 角色编码 -->
        <el-table-column :label="t('roles.roleCode')" min-width="120" prop="roleCode" show-overflow-tooltip />
        <!-- 角色名称 -->
        <el-table-column :label="t('roles.roleName')" min-width="120" prop="roleName" show-overflow-tooltip />
        <!-- 状态 -->
        <el-table-column :label="t('roles.status')" min-width="90" prop="status">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" effect="plain" size="small">
              {{ t(row.status ? 'roles.statusNormal' : 'roles.statusDisabled') }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 角色类型 -->
        <el-table-column :label="t('roles.roleType')" min-width="110" prop="roleType">
          <template #default="{ row }">
            <el-tag
              v-if="resolveRoleTypeOption(row.roleType)"
              :type="resolveRoleTypeOption(row.roleType)!.tagType"
              effect="plain"
              size="small"
            >
              {{ t(resolveRoleTypeOption(row.roleType)!.labelKey) }}
            </el-tag>
            <span v-else>{{ row.roleType }}</span>
          </template>
        </el-table-column>
      </el-table>
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
        <el-table
          v-if="boundMenus.length"
          :data="boundMenus"
          border
          class="permission-binding-refs__table"
          max-height="220"
          row-key="id"
          size="small"
          stripe
        >
          <!-- 菜单标题 -->
          <el-table-column :label="t('sysMenu.menuTitle')" min-width="120" prop="title" show-overflow-tooltip />
          <!-- 路由路径 -->
          <el-table-column :label="t('sysMenu.path')" min-width="140" prop="path" show-overflow-tooltip />
          <!-- 菜单类型 -->
          <el-table-column :label="t('sysMenu.menuType')" min-width="100" prop="menuType">
            <template #default="{ row }">
              <span v-if="resolveMenuTypeLabelKey(row.menuType)">{{ t(resolveMenuTypeLabelKey(row.menuType)!) }}</span>
              <span v-else>{{ row.menuType }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column :label="t('permissions.status')" min-width="90" prop="status">
            <template #default="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'" effect="plain" size="small">
                {{ t(row.status ? 'buttons.statusActiveText' : 'buttons.statusInactiveText') }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
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
