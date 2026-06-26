<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysUserDetail } from '@/api/system/user-base';
import useUserProfileColumns from '@/components/business/UserProfile/src/useUserProfileColumns';
import useUserProfileDisplay from '@/components/business/UserProfile/src/hooks/useUserProfileDisplay';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import usePermissionColumns from '@/views/system/_shared/columns/usePermissionColumns';
import useRoleColumns from '@/views/system/_shared/columns/useRoleColumns';
import { ElAvatar } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'UserDescriptionDialog',
});

type UserDescriptionDialogProps = DetailDialog<SysUserDetail>;

defineProps<UserDescriptionDialogProps>();
const { t } = useI18n();
const { renderUserAccountStatus, renderUserGender } = useUserProfileDisplay();

const { userDeptBindingColumns, userPostBindingColumns } = useUserProfileColumns();
const { roleColumns } = useRoleColumns();
const { permissionColumns } = usePermissionColumns();

const descriptionColumns = computed(() => [
  { label: t('users.field.username'), prop: 'username', labelWidth: 120, copy: true },
  { label: t('users.field.nickname'), prop: 'nickname', labelWidth: 120, copy: true },
  { label: t('users.field.email'), prop: 'email', labelWidth: 120, copy: true },
  { label: t('users.field.phone'), prop: 'phone', labelWidth: 120, copy: true },
  { label: t('relation.employeeNo'), prop: 'employeeNo', labelWidth: 120, copy: true },
  {
    label: t('users.field.avatarURL'),
    prop: 'avatar',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: string }) => <ElAvatar src={value} size={40} />,
  },
  {
    label: t('users.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => renderUserAccountStatus(value),
  },
  {
    label: t('users.field.gender'),
    prop: 'gender',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => renderUserGender(value),
  },
  { label: t('users.field.birthday'), prop: 'birthday', labelWidth: 120 },
  { label: t('users.field.introduction'), prop: 'introduction', labelWidth: 120, span: 2 },
  { label: t('users.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="[data]" />

    <el-divider />

    <DetailRelationListSection
      :columns="userDeptBindingColumns"
      :empty-text="t('users.bound.depts.empty')"
      :items="data.deptList"
      :title="t('users.bound.depts.title')"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="userPostBindingColumns"
      :empty-text="t('users.bound.posts.empty')"
      :items="data.postList"
      :title="t('users.bound.posts.title')"
      class="mt-4"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="roleColumns"
      :empty-text="t('users.effective.roles.empty')"
      :items="data.effectiveRoles"
      :title="t('users.effective.roles.title')"
      class="mt-4"
      row-key="id"
    />

    <DetailRelationListSection
      :columns="permissionColumns"
      :empty-text="t('users.effective.permissions.empty')"
      :items="data.effectivePermissions"
      :title="t('users.effective.permissions.title')"
      class="mt-4"
      row-key="id"
    />
  </div>
</template>
