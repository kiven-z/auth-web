import type { UserSessionIndex } from '@/api/auth/session';
import dayjs from 'dayjs';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 格式化 Refresh Token 过期时间
 * @param value 毫秒时间戳
 * @returns 展示文案
 */
function formatExpiresAt(value: number | null | undefined): string {
  if (value == null || value <= 0) {
    return '—';
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 用户活跃会话表格列
 * @returns 表格列定义
 */
function useUserSessionTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { label: t('users.session.device'), prop: 'deviceType', minWidth: 90, showOverflowTooltip: true },
    { label: t('users.session.browser'), prop: 'browserType', minWidth: 100, showOverflowTooltip: true },
    { label: t('users.session.os'), prop: 'osType', minWidth: 100, showOverflowTooltip: true },
    { label: t('users.field.lastLoginIp'), prop: 'ipAddress', minWidth: 120, showOverflowTooltip: true },
    { label: t('users.field.lastLoginRegion'), prop: 'ipRegion', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('users.session.rememberMe'),
      minWidth: 80,
      formatter: (row: UserSessionIndex) => (row.rememberMe ? t('status.yes') : t('status.no')),
    },
    {
      label: t('users.session.expiresAt'),
      minWidth: 160,
      formatter: (row: UserSessionIndex) => formatExpiresAt(row.refreshTokenExpiresAt),
    },
    { label: t('table.actions'), fixed: 'right', minWidth: 90, slot: 'actions' },
  ]);

  return { columns };
}

export default useUserSessionTableColumns;
