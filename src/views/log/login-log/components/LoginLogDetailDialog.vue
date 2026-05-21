<script lang="ts" setup>
import type { DetailDialog } from '@/api/common';
import type { LoginLogDetailRow } from '@/api/log/login-log';
import Description from '@/components/ui/Description';
import { useDescriptionDetailView } from '@/shared/hooks/useDescriptionDetailView';
import { resolveI18nEnumLabel } from '@/shared/utils/i18n-display';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'LoginLogDetailDialog',
});

interface LoginLogDetailDialogProps extends DetailDialog<LoginLogDetailRow> {}

const props = defineProps<LoginLogDetailDialogProps>();
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
 * 详情视图
 */
const view = useDescriptionDetailView(
  () => props.data,
  (d) => ({
    ...d,
    // TODO 待修改，优化枚举显示
    loginResultLabel: resolveI18nEnumLabel(t, 'loginLog.loginResultEnum', d.loginResult),
    loginTypeLabel: resolveI18nEnumLabel(t, 'loginLog.loginTypeEnum', d.loginType),
  })
);
</script>

<template>
  <Description :column="2" :columns="columns" :data="[view]" />
</template>
