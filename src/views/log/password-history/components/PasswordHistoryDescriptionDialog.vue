<script lang="ts" setup>
import type { PasswordHistoryDetailRow } from '@/api/log/password-history';
import Description from '@/components/ui/Description';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PasswordHistoryDescriptionDialog',
});

const props = defineProps<{ data: PasswordHistoryDetailRow }>();
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

const view = computed(() => {
  const d: PasswordHistoryDetailRow = props.data || ({} as PasswordHistoryDetailRow);
  return {
    ...d,
  };
});
</script>

<template>
  <Description :column="2" :columns="columns" :data="[view]" />
</template>
