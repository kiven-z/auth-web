<script lang="ts" setup>
import type { DetailDialog } from '@/api/common';
import type { SysPostPageRow } from '@/api/system/post';
import Description from '@/components/ui/Description';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PostDetailDialog',
});

type PostDetailDialogProps = DetailDialog<SysPostPageRow>;

const { data } = defineProps<PostDetailDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  { label: t('post.postCode'), prop: 'postCode', labelWidth: 120 },
  { label: t('post.postName'), prop: 'postName', labelWidth: 120 },
  { label: t('post.deptName'), prop: 'deptName', labelWidth: 120 },
  { label: t('post.status'), prop: 'status', labelWidth: 120 },
  { label: t('post.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('table.createTime'), prop: 'createTime', labelWidth: 120 },
  { label: t('table.updateTime'), prop: 'updateTime', labelWidth: 120 },
  { label: t('table.createUsername'), prop: 'createUsername', labelWidth: 120 },
  { label: t('table.updateUsername'), prop: 'updateUsername', labelWidth: 120 },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
