<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/shared/composables/table/auditColumns';
import type { DetailDialog } from '@/shared/types/dialog';
import type { SysRoleDetail } from '@/api/system/role/role';
import DetailRelationListSection from '@/components/business/DetailRelationListSection/index.vue';
import Description from '@/components/ui/Description';
import useMenuColumns from '@/views/system/_shared/columns/useMenuColumns';
import usePermissionColumns from '@/views/system/_shared/columns/usePermissionColumns';
import { renderBooleanStatusTag } from '@/shared/composables/layout/renderBooleanStatusTag';
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

const descriptionColumns = computed(() => [
  { label: t('roles.field.roleCode'), prop: 'roleCode', labelWidth: 120, copy: true },
  { label: t('roles.field.roleName'), prop: 'roleName', labelWidth: 120, copy: true },
  {
    label: t('roles.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderBooleanStatusTag(value),
  },
  { label: t('roles.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('roles.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
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
  </div>
</template>
