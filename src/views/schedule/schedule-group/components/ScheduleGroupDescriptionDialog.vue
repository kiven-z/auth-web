<script lang="ts" setup>
import Description from '@/components/ui/Description/index.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SysJobGroupPageRow } from '@/api/schedule/job-group';

defineOptions({
  name: 'JobGroupDescriptionDialog',
});

const props = defineProps<{ data: SysJobGroupPageRow }>();
const { t } = useI18n();

const columns = computed(() => [
  // 分组编码
  { label: t('schedule.group.code'), prop: 'groupCode', labelWidth: 120, copy: true },
  // 分组名称
  { label: t('schedule.group.name'), prop: 'groupName', copy: true },
  // 分组描述
  { label: t('schedule.group.description'), prop: 'description', span: 2 },
  // 分组状态
  { label: t('schedule.group.status'), prop: 'statusLabel' },
  // 是否系统默认任务
  { label: t('schedule.group.isSystem'), prop: 'isSystemLabel' },
  // 排序号
  { label: t('schedule.group.orderNum'), prop: 'orderNum' },
]);

const view = computed(() => {
  const d: SysJobGroupPageRow = props.data || ({} as SysJobGroupPageRow);
  return {
    ...d,
    statusLabel: d.status === 1 ? t('schedule.status.enabled') : t('schedule.status.disabled'),
    isSystemLabel: d.isSystem === 1 ? 'Y' : 'N',
  };
});
</script>

<template>
  <Description :column="2" :columns="columns" :data="[view]" border class="overflow-x-auto" />
</template>
