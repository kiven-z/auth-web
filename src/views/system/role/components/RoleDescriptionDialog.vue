<script lang="tsx" setup>
import { formatDateTime } from '@/shared/utils/date/dateTime';
import type { DetailDialog } from '@/api/common';
import type { SysRoleDetail } from '@/api/system/role';
import useUserProfileColumns from '@/components/business/UserProfile/src/useUserProfileColumns';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import useDeptColumns from '@/views/system/_shared/columns/useDeptColumns';
import useMenuColumns from '@/views/system/_shared/columns/useMenuColumns';
import usePermissionColumns from '@/views/system/_shared/columns/usePermissionColumns';
import usePostColumns from '@/views/system/_shared/columns/usePostColumns';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'RoleDescriptionDialog',
});

type RoleDescriptionDialogProps = DetailDialog<SysRoleDetail>;

defineProps<RoleDescriptionDialogProps>();
const { t } = useI18n();

const { permissionColumns } = usePermissionColumns();
const { menuColumns } = useMenuColumns();
const { userBindingColumns } = useUserProfileColumns();
const { deptColumns } = useDeptColumns();
const { postColumns } = usePostColumns();

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
  { label: t('roles.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('roles.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  {
    label: t('table.createTime'),
    prop: 'createTime',
    labelWidth: 120,
    cellRenderer: ({ value }) => formatDateTime(value),
  },

  {
    label: t('table.updateTime'),
    prop: 'updateTime',
    labelWidth: 120,
    cellRenderer: ({ value }) => formatDateTime(value),
  },

  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <el-divider />

    <DetailRelationListSection
      :columns="permissionColumns"
      :empty-text="t('roles.bound.permissionsEmpty')"
      :items="data.boundPermissions"
      :title="t('roles.bound.permissionsTitle')"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="menuColumns"
      :empty-text="t('roles.bound.menus.empty')"
      :items="data.boundMenus"
      :title="t('roles.bound.menus.title')"
      class="mt-4"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="userBindingColumns"
      :empty-text="t('roles.bound.users.empty')"
      :items="data.boundUsers"
      :title="t('roles.bound.users.title')"
      class="mt-4"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="deptColumns"
      :empty-text="t('roles.bound.depts.empty')"
      :items="data.boundDepts"
      :title="t('roles.bound.depts.title')"
      class="mt-4"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="postColumns"
      :empty-text="t('roles.bound.posts.empty')"
      :items="data.boundPosts"
      :title="t('roles.bound.posts.title')"
      class="mt-4"
      row-key="id"
    />
  </div>
</template>
