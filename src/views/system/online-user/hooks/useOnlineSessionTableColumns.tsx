import type { OnlineSessionPageRow } from '@/api/auth/online-session';
import { formatMillisTimestamp } from '@/infrastructure/session/sessionTime';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 在线用户表格列
 * @returns 表格列定义
 */
function useOnlineSessionTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    { label: t('users.field.username'), prop: 'username', minWidth: 120, showOverflowTooltip: true },
    { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('onlineUser.field.loginAt'),
      minWidth: 170,
      formatter: (row: OnlineSessionPageRow) => formatMillisTimestamp(row.loginAt),
    },
    { label: t('users.session.device'), prop: 'deviceType', minWidth: 90, showOverflowTooltip: true },
    { label: t('users.session.browser'), prop: 'browserType', minWidth: 100, showOverflowTooltip: true },
    { label: t('users.session.os'), prop: 'osType', minWidth: 100, showOverflowTooltip: true },
    { label: t('users.field.lastLoginIp'), prop: 'ipAddress', minWidth: 130, showOverflowTooltip: true },
    { label: t('users.field.lastLoginRegion'), prop: 'ipRegion', minWidth: 120, showOverflowTooltip: true },
    {
      label: t('users.session.rememberMe'),
      minWidth: 90,
      formatter: (row: OnlineSessionPageRow) => (row.rememberMe ? t('status.yes') : t('status.no')),
    },
    { label: t('table.actions'), fixed: 'right', minWidth: 90, slot: 'actions' },
  ]);

  return { columns };
}

export default useOnlineSessionTableColumns;
