<script lang="ts" setup>
import type { SysPostPageRow } from '@/api/system/post';
import Description from '@/components/ui/Description/index.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  row: SysPostPageRow;
}>();

const { t } = useI18n();

const descriptionColumns = computed(() => [
  { label: t('post.postCode'), value: props.row.postCode },
  { label: t('post.postName'), value: props.row.postName },
  { label: t('post.deptName'), value: props.row.deptName },
  {
    label: t('post.status'),
    value: props.row.status === 1 ? t('post.statusNormal') : t('post.statusDisabled'),
  },
  { label: t('post.orderNum'), value: props.row.orderNum },
  { label: t('table.createTime'), value: props.row.createTime },
  { label: t('table.updateTime'), value: props.row.updateTime },
  { label: t('table.createUsername'), value: props.row.createUsername ?? '-' },
  { label: t('table.updateUsername'), value: props.row.updateUsername ?? '-' },
]);
</script>

<template>
  <div>
    <Description :columns="descriptionColumns" />
  </div>
</template>
