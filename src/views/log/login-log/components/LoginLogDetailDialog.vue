<script lang="ts" setup>
import type { LoginLogDetailRow } from '@/api/log/login-log';
import Description from '@/components/ui/Description/index.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LoginLogDetailDialog',
});

const props = defineProps<{ data: LoginLogDetailRow }>();
const { t } = useI18n();

const columns = computed(() => [
  { label: t('log.loginLog.userId'), prop: 'userId', labelWidth: 120, copy: true },
  { label: t('log.loginLog.username'), prop: 'username', labelWidth: 120, copy: true },
  { label: t('log.loginLog.loginResult'), prop: 'loginResultLabel', labelWidth: 120 },
  { label: t('log.loginLog.failureReason'), prop: 'failureReason', labelWidth: 120, copy: true },
  { label: t('log.loginLog.loginTime'), prop: 'loginTime', copy: true },
  { label: t('log.loginLog.loginIp'), prop: 'loginIp', copy: true },
  { label: t('log.loginLog.loginRegion'), prop: 'loginRegion' },
  { label: t('log.loginLog.userAgent'), prop: 'userAgent' },
  { label: t('log.loginLog.loginType'), prop: 'loginTypeLabel', labelWidth: 120 },
  { label: t('table.createTime'), prop: 'createTime' },
  { label: t('table.updateTime'), prop: 'updateTime' },
]);

const view = computed(() => {
  const d: LoginLogDetailRow = props.data || ({} as LoginLogDetailRow);
  const rc = d.loginResult;
  const resultKey = `log.loginLog.loginResultEnum.${rc}`;
  const rawResult = t(resultKey);
  const typeKey = d.loginType ? `log.loginLog.loginTypeEnum.${d.loginType}` : '';
  const rawType = typeKey ? t(typeKey) : '';
  return {
    ...d,
    loginResultLabel: rawResult === resultKey ? String(rc ?? '') : rawResult,
    loginTypeLabel: !d.loginType ? '' : rawType === typeKey ? d.loginType : rawType,
  };
});
</script>

<template>
  <Description :column="2" :columns="columns" :data="[view]" border class="overflow-x-auto" />
</template>
