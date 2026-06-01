<script lang="ts" setup>
import type { DetailDialog } from '@/api/common';
import type { SysPermissionDetail } from '@/api/system/permission';
import Description from '@/components/ui/Description';
import { PERMISSION_TYPE_TAG_MAP } from '@/views/system/permission/constants/permission-search-options';
import { ElTag } from 'element-plus';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PermissionDescriptionDialog',
});

type PermissionDescriptionDialogProps = DetailDialog<SysPermissionDetail>;

defineProps<PermissionDescriptionDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  { label: t('permissions.permissionCode'), prop: 'permissionCode', labelWidth: 120, copy: true },
  { label: t('permissions.permissionName'), prop: 'permissionName', labelWidth: 120, copy: true },
  {
    label: t('permissions.permissionType'),
    prop: 'permissionType',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => {
      const cfg = PERMISSION_TYPE_TAG_MAP[value];
      if (!cfg) {
        return h('span', String(value ?? ''));
      }
      return h(ElTag, { type: cfg.type, effect: 'plain', size: 'small' }, () => t(cfg.labelKey));
    },
  },
  {
    label: t('permissions.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) =>
      h(ElTag, { type: value ? 'success' : 'danger', effect: 'plain', size: 'small' }, () =>
        t(value ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')
      ),
  },
  { label: t('permissions.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('permissions.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
