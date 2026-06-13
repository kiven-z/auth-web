<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { LoginLogDetailRow } from '@/api/log/login-log';
import Description from '@/components/ui/Description';
import {
  LOGIN_LOG_TYPE_FILTER_OPTIONS,
  resolveLoginLogResultMeta,
} from '@/views/log/login-log/constants/login-log-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LoginLogDetailDialog',
});

type LoginLogDetailDialogProps = DetailDialog<LoginLogDetailRow>;

defineProps<LoginLogDetailDialogProps>();
const { t } = useI18n();

const columns = computed(() => [
  // 用户 ID
  {
    label: t('loginLog.field.userId'),
    prop: 'userId',
    labelWidth: 120,
    copy: true,
    cellRenderer: ({ value }) => <span>{value ?? '—'}</span>,
  },
  // 用户名
  { label: t('loginLog.field.username'), prop: 'username', labelWidth: 120, copy: true },
  // 登录结果
  {
    label: t('loginLog.field.loginResult'),
    prop: 'loginResult',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => {
      if (value === undefined || value === null) {
        return <span>—</span>;
      }
      const meta = resolveLoginLogResultMeta(value);
      if (!meta) {
        return <span>{String(value)}</span>;
      }

      return (
        <ElTag type={meta.tagType} effect="plain">
          {t(meta.labelKey)}
        </ElTag>
      );
    },
  },
  { label: t('loginLog.field.failureReason'), prop: 'failureReason', labelWidth: 120, copy: true },
  // 登录时间
  { label: t('loginLog.field.loginTime'), prop: 'loginTime', copy: true },
  // 登录 IP
  { label: t('loginLog.field.loginIp'), prop: 'loginIp', copy: true },
  // 登录区域
  { label: t('loginLog.field.loginRegion'), prop: 'loginRegion' },
  // 用户代理
  { label: t('loginLog.field.userAgent'), prop: 'userAgent' },
  // 设备类型
  { label: t('loginLog.field.deviceType'), prop: 'deviceType', labelWidth: 120 },
  // 操作系统类型
  { label: t('loginLog.field.osType'), prop: 'osType' },
  // 浏览器类型
  { label: t('loginLog.field.browserType'), prop: 'browserType' },
  {
    label: t('loginLog.field.loginType'),
    prop: 'loginType',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: string | null }) => {
      if (!value) return <span />;
      const option = LOGIN_LOG_TYPE_FILTER_OPTIONS.find((item) => item.value === value);
      return <span>{option ? t(option.labelKey) : value}</span>;
    },
  },
  { label: t('loginLog.field.sessionId'), prop: 'sessionId', copy: true },
  // 创建时间
  { label: t('table.createTime'), prop: 'createTime' },
  // 更新时间
  { label: t('table.updateTime'), prop: 'updateTime' },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
