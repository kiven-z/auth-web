<script lang="ts" setup>
import type { DetailDialog } from '@/api/common';
import type { SysJobGroupPageRow } from '@/api/schedule/job-group';
import Description from '@/components/ui/Description';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobGroupDescriptionDialog',
});

type ScheduleGroupDescriptionDialogProps = DetailDialog<SysJobGroupPageRow>;

const props = defineProps<ScheduleGroupDescriptionDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  // 分组编码
  { label: t('scheduleGroup.code'), prop: 'groupCode', labelWidth: 120, copy: true },
  // 分组名称
  { label: t('scheduleGroup.name'), prop: 'groupName', copy: true },
  // 分组描述
  { label: t('scheduleGroup.description'), prop: 'description', span: 2 },
  // 分组状态
  { label: t('scheduleGroup.status'), prop: 'statusLabel' },
  // 是否系统默认任务
  { label: t('scheduleGroup.isSystem'), prop: 'isSystemLabel' },
  // 排序号
  { label: t('scheduleGroup.orderNum'), prop: 'orderNum' },
]);

const displayRow = computed(() => {
  const row = props.data;
  if (!row) {
    return {};
  }
  return {
    ...row,
    statusLabel: row.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText'),
    isSystemLabel: row.isSystem ? 'Y' : 'N',
  };
});
</script>

<template>
  <Description :column="2" :columns="columns" :data="[displayRow]" />
</template>
