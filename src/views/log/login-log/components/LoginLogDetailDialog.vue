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
  { label: t('loginLog.userId'), prop: 'userId', labelWidth: 120, copy: true },
  { label: t('loginLog.username'), prop: 'username', labelWidth: 120, copy: true },
  { label: t('loginLog.loginResult'), prop: 'loginResultLabel', labelWidth: 120 },
  { label: t('loginLog.failureReason'), prop: 'failureReason', labelWidth: 120, copy: true },
  { label: t('loginLog.loginTime'), prop: 'loginTime', copy: true },
  { label: t('loginLog.loginIp'), prop: 'loginIp', copy: true },
  { label: t('loginLog.loginRegion'), prop: 'loginRegion' },
  { label: t('loginLog.userAgent'), prop: 'userAgent' },
  { label: t('loginLog.deviceType'), prop: 'deviceTypeLabel', labelWidth: 120 },
  { label: t('loginLog.osType'), prop: 'osType' },
  { label: t('loginLog.browserType'), prop: 'browserType' },
  { label: t('loginLog.loginType'), prop: 'loginTypeLabel', labelWidth: 120 },
  { label: t('loginLog.sessionId'), prop: 'sessionId', copy: true },
  { label: t('table.createTime'), prop: 'createTime' },
  { label: t('table.updateTime'), prop: 'updateTime' },
]);

const formatEnumLabel = (key: string, value: string | null | undefined): string => {
  if (!value) return '';
  const label = t(key);
  return label === key ? value : label;
};

const view = computed(() => {
  const d: LoginLogDetailRow = props.data || ({} as LoginLogDetailRow);
  const rc = d.loginResult;
  const resultKey = `loginLog.loginResultEnum.${rc}`;
  const rawResult = t(resultKey);
  const typeKey = d.loginType ? `loginLog.loginTypeEnum.${d.loginType}` : '';
  return {
    ...d,
    loginResultLabel: rawResult === resultKey ? String(rc ?? '') : rawResult,
    loginTypeLabel: formatEnumLabel(typeKey, d.loginType),
    deviceTypeLabel: d.deviceType ?? '',
    osType: d.osType ?? '',
    browserType: d.browserType ?? '',
  };
});
</script>

<template>
  <Description :column="2" :columns="columns" :data="[view]" border class="overflow-x-auto" />
</template>
