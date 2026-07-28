<script lang="tsx" setup>
import { formatDateTime } from '@/shared/utils/date/dateTime';
import type { DetailDialog } from '@/api/common';
import type { SysPermissionDetail } from '@/api/system/permission';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
import useRoleColumns from '@/views/system/_shared/columns/useRoleColumns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PermissionDescriptionDialog',
});

type PermissionDescriptionDialogProps = DetailDialog<SysPermissionDetail>;

defineProps<PermissionDescriptionDialogProps>();
const { t } = useI18n();

const { roleColumns } = useRoleColumns();

const descriptionColumns = computed(() => [
  { label: t('permissions.field.permissionCode'), prop: 'permissionCode', labelWidth: 120, copy: true },
  { label: t('permissions.field.permissionName'), prop: 'permissionName', labelWidth: 120, copy: true },
  {
    label: t('permissions.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderBooleanStatusTag(value),
  },
  { label: t('permissions.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('permissions.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
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
    <!-- 权限基础信息 -->
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <!-- 已绑定角色 -->
    <el-divider />
    <DetailRelationListSection
      :columns="roleColumns"
      :empty-text="t('permissions.bound.roles.empty')"
      :items="data.boundRoles"
      :title="t('permissions.bound.roles.title')"
      row-key="id"
    />
  </div>
</template>
