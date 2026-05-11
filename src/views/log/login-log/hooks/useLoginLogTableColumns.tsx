/**
 * 登录日志表格列
 */
import type { LoginLogPageRow } from '@/api/log/login-log';
import { selectUserinfo } from '@/components/user/UserProfile';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

function useLoginLogTableColumns() {
  const { t } = useI18n();

  const loginResultLabel = (code: number | undefined) => {
    if (code === undefined || code === null) return '';
    const key = `log.loginLog.loginResultEnum.${code}` as const;
    const label = t(key);
    return label === key ? String(code) : label;
  };

  const loginTypeLabel = (type: string | null | undefined) => {
    if (!type) return '';
    const key = `log.loginLog.loginTypeEnum.${type}` as const;
    const label = t(key);
    return label === key ? type : label;
  };

  const columns = computed<TableColumnList>(() => [
    {
      type: 'selection',
      width: 50,
    },
    {
      type: 'index',
      index: (index: number) => index + 1,
      label: t('table.idx'),
      minWidth: 60,
    },
    // 用户
    {
      label: t('log.loginLog.user'),
      prop: 'username',
      minWidth: 130,
      formatter: (row: LoginLogPageRow) => {
        const uid = row.userId;
        if (!uid) {
          return <span>{row.username ?? '—'}</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(uid, row.username ?? '')}>
            {row.username ?? uid}
          </ElButton>
        );
      },
    },
    // 登录结果
    {
      label: t('log.loginLog.loginResult'),
      prop: 'loginResult',
      minWidth: 140,
      formatter: (row: LoginLogPageRow) => loginResultLabel(row.loginResult),
    },
    // 登录时间
    {
      label: t('log.loginLog.loginTime'),
      prop: 'loginTime',
      sortable: true,
      minWidth: 170,
    },
    // 登录地区
    {
      label: t('log.loginLog.loginRegion'),
      prop: 'loginRegion',
      minWidth: 140,
    },
    // 登录类型
    {
      label: t('log.loginLog.loginType'),
      prop: 'loginType',
      minWidth: 130,
      formatter: (row: LoginLogPageRow) => loginTypeLabel(row.loginType),
    },
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: LoginLogPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser!, row.createUsername ?? '')}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUser',
      minWidth: 130,
      formatter: (row: LoginLogPageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser!, row.updateUsername ?? '')}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useLoginLogTableColumns;
