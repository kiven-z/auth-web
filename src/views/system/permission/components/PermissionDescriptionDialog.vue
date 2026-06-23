<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysPermissionDetail } from '@/api/system/permission';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import useMenuColumns from '@/views/system/_shared/columns/useMenuColumns';
import useRoleColumns from '@/views/system/_shared/columns/useRoleColumns';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/permission-type-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PermissionDescriptionDialog',
});

type PermissionDescriptionDialogProps = DetailDialog<SysPermissionDetail>;

defineProps<PermissionDescriptionDialogProps>();
const { t } = useI18n();

const { roleColumns } = useRoleColumns();
const { menuColumns } = useMenuColumns();

const descriptionColumns = computed(() => [
  { label: t('permissions.field.permissionCode'), prop: 'permissionCode', labelWidth: 120, copy: true },
  { label: t('permissions.field.permissionName'), prop: 'permissionName', labelWidth: 120, copy: true },
  {
    label: t('permissions.field.permissionType'),
    prop: 'permissionType',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => {
      const option = PERMISSION_TYPE_FILTER_OPTIONS.find((item) => item.value === value);
      if (!option) {
        return <span>{value}</span>;
      }
      return (
        <ElTag type={option.tagType} effect="plain">
          {t(option.labelKey)}
        </ElTag>
      );
    },
  },
  {
    label: t('permissions.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => (
      <ElTag type={value ? 'success' : 'danger'} effect="plain">
        {t(value ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
      </ElTag>
    ),
  },
  { label: t('permissions.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('permissions.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <div>
    <!-- 权限基础信息 -->
    <Description :column="2" :columns="descriptionColumns" :data="[data]" />

    <!-- 关联引用：角色 / 菜单 -->
    <el-divider />

    <!-- 已绑定角色 -->
    <DetailRelationListSection
      :columns="roleColumns"
      :empty-text="t('permissions.bound.roles.empty')"
      :items="data.boundRoles"
      :title="t('permissions.bound.roles.title')"
      row-key="id"
    />

    <!-- 已绑定菜单 -->
    <DetailRelationListSection
      :columns="menuColumns"
      :empty-text="t('permissions.bound.menus.empty')"
      :items="data.boundMenus"
      :title="t('permissions.bound.menus.title')"
      class="mt-4"
      row-key="id"
    />
  </div>
</template>
