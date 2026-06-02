<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { SysPostPageRow } from '@/api/system/post';
import Description from '@/components/ui/Description';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PostDetailDialog',
});

type PostDetailDialogProps = DetailDialog<SysPostPageRow>;

defineProps<PostDetailDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  { label: t('post.postCode'), prop: 'postCode', labelWidth: 120 },
  { label: t('post.postName'), prop: 'postName', labelWidth: 120 },
  { label: t('post.deptName'), prop: 'deptName', labelWidth: 120 },
  {
    label: t('post.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => (
      <ElTag type={value ? 'success' : 'danger'} effect="plain">
        {t(value ? 'buttons.statusActiveText' : 'buttons.statusInactiveText')}
      </ElTag>
    ),
  },
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
