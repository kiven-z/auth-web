<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/shared/composables/table/auditColumns';
import type { DetailDialog } from '@/shared/types/dialog';
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
  ...createAuditDetailColumns(),
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

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
