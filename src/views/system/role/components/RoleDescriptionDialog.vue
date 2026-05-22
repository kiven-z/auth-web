<script lang="ts" setup>
import type { DetailDialog } from '@/api/common';
import type { SysRolePageRow } from '@/api/system/role';
import Description from '@/components/ui/Description';
import { ROLE_TYPE_FILTER_OPTIONS } from '@/views/system/role/constants/role-search-options';
import { ElTag } from 'element-plus';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'RoleDescriptionDialog',
});

type RoleDescriptionDialogProps = DetailDialog<SysRolePageRow>;

defineProps<RoleDescriptionDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  { label: t('roles.roleCode'), prop: 'roleCode', labelWidth: 120, copy: true },
  { label: t('roles.roleName'), prop: 'roleName', labelWidth: 120, copy: true },
  {
    label: t('roles.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) =>
      h(ElTag, { type: value ? 'success' : 'danger' }, () =>
        t(value ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')
      ),
  },
  {
    label: t('roles.roleType'),
    prop: 'roleType',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => {
      const option = ROLE_TYPE_FILTER_OPTIONS.find((item) => item.value === value);
      return h('span', option ? t(option.labelKey) : String(value ?? ''));
    },
  },
  { label: t('roles.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('roles.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
