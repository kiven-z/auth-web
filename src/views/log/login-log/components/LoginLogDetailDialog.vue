<script lang="tsx" setup>
import type { DetailDialog } from '@/api/common';
import type { LoginLogDetailRow } from '@/api/log/login-log';
import Description from '@/components/ui/Description';
import { getLoginLogResultTagType } from '@/views/log/login-log/constants/login-log-enums';
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
    label: t('loginLog.userId'),
    prop: 'userId',
    labelWidth: 120,
    copy: true,
    cellRenderer: ({ value }) => <span>{value ?? '—'}</span>,
  },
  // 用户名
  { label: t('loginLog.username'), prop: 'username', labelWidth: 120, copy: true },
  // 登录结果
  {
    label: t('loginLog.loginResult'),
    prop: 'loginResult',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => {
      if (value === undefined || value === null) {
        return <span>—</span>;
      }
      const key = `loginLog.loginResultEnum.${value}`;
      const label = t(key);

      return (
        <ElTag type={getLoginLogResultTagType(value)} effect="plain">
          {label === key ? String(value) : label}
        </ElTag>
      );
    },
  },
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
  { label: t('loginLog.deviceType'), prop: 'deviceType', labelWidth: 120 },
  // 操作系统类型
  { label: t('loginLog.osType'), prop: 'osType' },
  // 浏览器类型
  { label: t('loginLog.browserType'), prop: 'browserType' },
  {
    label: t('loginLog.loginType'),
    prop: 'loginType',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: string | null }) => {
      if (!value) return <span />;
      const key = `loginLog.loginTypeEnum.${value}`;
      const label = t(key);
      return <span>{label === key ? value : label}</span>;
    },
  },
  { label: t('loginLog.sessionId'), prop: 'sessionId', copy: true },
  // 创建时间
  { label: t('table.createTime'), prop: 'createTime' },
  // 更新时间
  { label: t('table.updateTime'), prop: 'updateTime' },
]);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[data]" />
</template>
