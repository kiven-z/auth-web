<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysPermissionDetail } from '@/api/system/permission';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/_shared/constants/permission-type-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useBindingColumns from '@/views/system/_shared/columns/useBindingColumns';
import usePermissionBindingColumns from '@/views/system/permission/hooks/usePermissionBindingColumns';

defineOptions({
  name: 'PermissionDescriptionDialog',
});

type PermissionDescriptionDialogProps = DetailDialog<SysPermissionDetail>;

const props = defineProps<PermissionDescriptionDialogProps>();
const { t } = useI18n();

// 绑定角色、菜单表格列
const { roleBindingColumns } = useBindingColumns();
const { menuBindingColumns } = usePermissionBindingColumns();

// 按钮权限类型
const buttonPermissionType = PERMISSION_TYPE_FILTER_OPTIONS[0].value;

// 绑定角色、菜单数据
const boundRoles = computed(() => props.data.boundRoles ?? []);
const boundMenus = computed(() => props.data.boundMenus ?? []);

// 按钮权限才展示菜单绑定；API 权限仅展示「不适用」提示
const isButtonPermission = computed(() => props.data.permissionType === buttonPermissionType);

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
      :columns="roleBindingColumns"
      :empty-text="t('permissions.bound.roles.empty')"
      :items="boundRoles"
      :title="t('permissions.bound.roles.title')"
      row-key="roleCode"
    />

    <!-- 已绑定菜单 -->
    <DetailRelationListSection
      :columns="menuBindingColumns"
      :empty-text="t('permissions.bound.menus.empty')"
      :items="boundMenus"
      :show-badge="isButtonPermission"
      :title="t('permissions.bound.menus.title')"
      class="mt-4"
      row-key="id"
    >
      <template v-if="!isButtonPermission" #body>
        <el-text class="block py-2" type="info">
          {{ t('permissions.bound.menus.notApplicable') }}
        </el-text>
      </template>
    </DetailRelationListSection>
  </div>
</template>
