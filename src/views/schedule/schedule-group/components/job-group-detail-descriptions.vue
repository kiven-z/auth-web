<!--
  分组详情：不包含 create/update 审计字段（按文档）
-->
<script lang="ts" setup>
import { transformI18n } from '@/plugins/i18n';
import { computed } from 'vue';
import ReDescription from '@/components/ReDescription';

const props = defineProps<{ data: Record<string, any> }>();

const columns = computed(() => [
  // 分组编码
  { label: transformI18n('schedule.group.code'), prop: 'groupCode', labelWidth: 120, copy: true },
  // 分组名称
  { label: transformI18n('schedule.group.name'), prop: 'groupName', copy: true },
  // 分组描述
  { label: transformI18n('schedule.group.description'), prop: 'description', span: 2 },
  // 分组状态
  { label: transformI18n('schedule.group.status'), prop: 'statusLabel' },
  // 是否系统默认任务
  { label: transformI18n('schedule.group.isSystem'), prop: 'isSystemLabel' },
  // 排序号
  { label: transformI18n('schedule.group.orderNum'), prop: 'orderNum' },
]);

const view = computed(() => {
  const data = props.data || {};
  return {
    ...data,
    statusLabel:
      data.status === 1 ? transformI18n('schedule.status.enabled') : transformI18n('schedule.status.disabled'),
    isSystemLabel: data.isSystem === 1 ? 'Y' : 'N',
  };
});
</script>

<template>
  <ReDescription :column="2" :columns="columns" :data="[view]" border class="overflow-x-auto" />
</template>
