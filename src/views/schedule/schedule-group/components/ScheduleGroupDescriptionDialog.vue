<script lang="ts" setup>
import { SysJobGroupPageRow } from '@/api/schedule/job-group';
import Description from '@/components/ui/Description/index.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'JobGroupDescriptionDialog',
});

const props = defineProps<{ data: SysJobGroupPageRow }>();
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

const view = computed(() => {
  const d: SysJobGroupPageRow = props.data || ({} as SysJobGroupPageRow);
  return {
    ...d,
    statusLabel: d.status ? t('scheduleGroup.statusEnabled') : t('scheduleGroup.statusDisabled'),
    isSystemLabel: d.isSystem ? 'Y' : 'N',
  };
});
</script>

<template>
  <Description :column="2" :columns="columns" :data="[view]" border class="overflow-x-auto" />
</template>
