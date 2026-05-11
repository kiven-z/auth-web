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
  // 用户 ID
  { label: t('loginLog.userId'), prop: 'userId', labelWidth: 120, copy: true },
  // 用户名
  { label: t('loginLog.username'), prop: 'username', labelWidth: 120, copy: true },
  // 登录结果
  { label: t('loginLog.loginResult'), prop: 'loginResultLabel', labelWidth: 120 },
  // 失败原因
  { label: t('loginLog.failureReason'), prop: 'failureReason', labelWidth: 120, copy: true },
  // 登录时间
  { label: t('loginLog.loginTime'), prop: 'loginTime', copy: true },
  // 登录 IP
  { label: t('loginLog.loginIp'), prop: 'loginIp', copy: true },
  // 登录区域
  { label: t('loginLog.loginRegion'), prop: 'loginRegion' },
  // 用户代理
  { label: t('loginLog.userAgent'), prop: 'userAgent' },
  // 设备类型
  { label: t('loginLog.deviceType'), prop: 'deviceTypeLabel', labelWidth: 120 },
  // 操作系统类型
  { label: t('loginLog.osType'), prop: 'osType' },
  // 浏览器类型
  { label: t('loginLog.browserType'), prop: 'browserType' },
  // 登录类型
  { label: t('loginLog.loginType'), prop: 'loginTypeLabel', labelWidth: 120 },
  // 会话 ID
  { label: t('loginLog.sessionId'), prop: 'sessionId', copy: true },
  // 创建时间
  { label: t('table.createTime'), prop: 'createTime' },
  // 更新时间
  { label: t('table.updateTime'), prop: 'updateTime' },
]);

/**
 * 格式化枚举标签
 * @param key 枚举键
 * @param value 枚举值
 * @returns 格式化后的枚举标签
 */
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
