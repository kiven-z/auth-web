<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysRoleDetail } from '@/api/system/role';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/role-type-options';
import useRoleBindingPermissionColumns from '@/views/system/role/hooks/useRoleBindingPermissionColumns';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'RoleDescriptionDialog',
});

type RoleDescriptionDialogProps = DetailDialog<SysRoleDetail>;

const props = defineProps<RoleDescriptionDialogProps>();
const { t } = useI18n();

// 绑定权限表格列
const { columns: permissionBindingColumns } = useRoleBindingPermissionColumns();

// 绑定权限数据
const boundPermissions = computed(() => props.data.boundPermissions ?? []);

// 角色基础信息表格列
const descriptionColumns = computed(() => [
  { label: t('roles.field.roleCode'), prop: 'roleCode', labelWidth: 120, copy: true },
  { label: t('roles.field.roleName'), prop: 'roleName', labelWidth: 120, copy: true },
  {
    label: t('roles.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => (
      <ElTag type={value ? 'success' : 'danger'} effect="plain">
        {t(value ? 'roles.status.normal' : 'roles.status.disabled')}
      </ElTag>
    ),
  },
  {
    label: t('roles.field.roleType'),
    prop: 'roleType',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => {
      const option = ROLE_TYPE_FILTER_OPTIONS.find((item) => item.value === value);
      return (
        <ElTag type={option.tagType} effect="plain">
          {t(option.labelKey)}
        </ElTag>
      );
    },
  },
  { label: t('roles.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('roles.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <div>
    <!-- 角色基础信息 -->
    <Description :column="2" :columns="descriptionColumns" :data="[data]" />

    <!-- 已分配权限（sys_role_permission 正查） -->
    <el-divider />

    <DetailRelationListSection
      :columns="permissionBindingColumns"
      :empty-text="t('roles.bound.permissionsEmpty')"
      :items="boundPermissions"
      :title="t('roles.bound.permissionsTitle')"
      row-key="permissionCode"
    />
  </div>
</template>
