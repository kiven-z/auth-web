<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysPermissionDetail } from '@/api/system/permission';
import Description from '@/components/ui/Description';
import PermissionBindingRefsSection from '@/views/system/permission/components/PermissionBindingRefsSection.vue';
import { PERMISSION_TYPE_FILTER_OPTIONS } from '@/views/system/permission/constants/permission-search-options';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PermissionDescriptionDialog',
});

type PermissionDescriptionDialogProps = DetailDialog<SysPermissionDetail>;

const props = defineProps<PermissionDescriptionDialogProps>();
const { t } = useI18n();

const boundRoles = computed(() => props.data.boundRoles ?? []);
const boundMenus = computed(() => props.data.boundMenus ?? []);

const columns = computed(() => [
  { label: t('permissions.permissionCode'), prop: 'permissionCode', labelWidth: 120, copy: true },
  { label: t('permissions.permissionName'), prop: 'permissionName', labelWidth: 120, copy: true },
  {
    label: t('permissions.permissionType'),
    prop: 'permissionType',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => {
      const option = PERMISSION_TYPE_FILTER_OPTIONS.find((item) => item.value === value);
      if (!option) {
        return <span>{String(value ?? '')}</span>;
      }
      return (
        <ElTag type={option.tagType} effect="plain" size="small">
          {t(option.labelKey)}
        </ElTag>
      );
    },
  },
  {
    label: t('permissions.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => (
      <ElTag type={value ? 'success' : 'danger'} effect="plain" size="small">
        {t(value ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
      </ElTag>
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
  <div>
    <Description :column="2" :columns="columns" :data="[data]" />
    <PermissionBindingRefsSection
      :bound-menus="boundMenus"
      :bound-roles="boundRoles"
      :permission-type="data.permissionType"
    />
  </div>
</template>
