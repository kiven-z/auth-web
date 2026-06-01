<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysJobGroupPageRow } from '@/api/schedule/job-group';
import Description from '@/components/ui/Description';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobGroupDescriptionDialog',
});

type ScheduleGroupDescriptionDialogProps = DetailDialog<SysJobGroupPageRow>;

defineProps<ScheduleGroupDescriptionDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  // 分组编码
  { label: t('scheduleGroup.code'), prop: 'groupCode', labelWidth: 120, copy: true },
  // 分组名称
  { label: t('scheduleGroup.name'), prop: 'groupName', copy: true },
  // 分组描述
  { label: t('scheduleGroup.description'), prop: 'description', span: 2 },
  {
    label: t('scheduleGroup.status'),
    prop: 'status',
    cellRenderer: ({ value }: { value: boolean }) => (
      <ElTag type={value ? 'success' : 'danger'} effect="plain" size="small">
        {t(value ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
      </ElTag>
    ),
  },
  {
    label: t('scheduleGroup.isSystem'),
    prop: 'isSystem',
    cellRenderer: ({ value }: { value: boolean }) => (
      <span>{value ? t('buttons.permitText') : t('buttons.forbidText')}</span>
    ),
  },
  { label: t('scheduleGroup.orderNum'), prop: 'orderNum' },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
