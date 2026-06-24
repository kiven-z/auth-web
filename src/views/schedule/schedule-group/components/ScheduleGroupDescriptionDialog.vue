<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysJobGroupDetailRow } from '@/api/schedule/job-group';
import Description from '@/components/ui/Description';
import { renderBooleanStatusTag } from '@/composables/layout/renderBooleanStatusTag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobGroupDescriptionDialog',
});

type ScheduleGroupDescriptionDialogProps = DetailDialog<SysJobGroupDetailRow>;

defineProps<ScheduleGroupDescriptionDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  { label: t('scheduleGroup.code'), prop: 'groupCode', labelWidth: 120, copy: true },
  { label: t('scheduleGroup.name'), prop: 'groupName', copy: true },
  { label: t('scheduleGroup.description'), prop: 'description', span: 2 },
  {
    label: t('scheduleGroup.status'),
    prop: 'status',
    cellRenderer: ({ value }: { value: boolean }) => renderBooleanStatusTag(value),
  },
  {
    label: t('scheduleGroup.isSystem'),
    prop: 'isSystem',
    cellRenderer: ({ value }: { value: boolean }) => (
      <span>{value ? t('buttons.permitText') : t('buttons.forbidText')}</span>
    ),
  },
  { label: t('scheduleGroup.orderNum'), prop: 'orderNum' },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
