<script lang="ts" setup>
import type { DetailDialog } from '@/api/common';
import { SysJobGroupPageRow } from '@/api/schedule/job-group';
import Description from '@/components/ui/Description';
import { useDescriptionDetailView } from '@/shared/hooks/useDescriptionDetailView';
import { resolveBooleanI18nLabel } from '@/shared/utils/i18n-display';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobGroupDescriptionDialog',
});

interface ScheduleGroupDescriptionDialogProps extends DetailDialog<SysJobGroupPageRow> {}

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

const view = useDescriptionDetailView(
  () => props.data,
  (d) => ({
    ...d,
    statusLabel: resolveBooleanI18nLabel(t, d.status, 'scheduleGroup.statusEnabled', 'scheduleGroup.statusDisabled'),
    isSystemLabel: d.isSystem ? 'Y' : 'N',
  })
);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[view]" />
</template>
