<script lang="ts" setup>
import type { DetailDialog } from '@/api/common';
import type { PasswordHistoryDetailRow } from '@/api/log/password-history';
import Description from '@/components/ui/Description';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PasswordHistoryDescriptionDialog',
});

interface PasswordHistoryDescriptionDialogProps extends DetailDialog<PasswordHistoryDetailRow> {}

defineProps<PasswordHistoryDescriptionDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  // 用户
  { label: t('passwordHistory.userId'), prop: 'username', labelWidth: 120, copy: true },
  // 修改时间
  { label: t('passwordHistory.changeTime'), prop: 'changeTime', copy: true },
  // 修改IP地址
  { label: t('passwordHistory.changeIp'), prop: 'changeIp' },
  // 创建时间
  { label: t('table.createTime'), prop: 'createTime' },
  // 更新时间
  { label: t('table.updateTime'), prop: 'updateTime' },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
