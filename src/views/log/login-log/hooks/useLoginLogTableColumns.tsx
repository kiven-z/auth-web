/**
 * 登录日志表格列
 */
import type { LoginLogPageRow } from '@/api/log/login-log';
import { selectUserinfo } from '@/components/business/UserProfile';
import { resolveLoginLogResultMeta } from '@/views/log/login-log/constants/login-log-enums';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function useLoginLogTableColumns() {
  const { t } = useI18n();

  const loginTypeLabel = (type: string | null | undefined) => {
    if (!type) return '';
    const key = `loginLog.loginTypeEnum.${type}` as const;
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
      label: t('loginLog.user'),
      prop: 'username',
      minWidth: 130,
      formatter: (row: LoginLogPageRow) => {
        const uid = row.userId;
        const displayName = row.username?.trim() || '—';
        if (!uid) {
          return <span>{displayName}</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(uid, row.username ?? '')}>
            {displayName}
          </ElButton>
        );
      },
    },
    // 登录结果
    {
      label: t('loginLog.loginResult'),
      prop: 'loginResult',
      minWidth: 140,
      formatter: (row: LoginLogPageRow) => {
        const code = row.loginResult;
        if (code === undefined || code === null) return <span>—</span>;
        const meta = resolveLoginLogResultMeta(code);
        const key = `loginLog.loginResultEnum.${code}` as const;
        const label = t(key);

        return (
          <ElTag type={meta.tagType} effect="plain">
            {label === key ? String(code) : label}
          </ElTag>
        );
      },
    },
    // 登录时间
    {
      label: t('loginLog.loginTime'),
      prop: 'loginTime',
      sortable: true,
      minWidth: 170,
    },
    // 登录地区
    {
      label: t('loginLog.loginRegion'),
      prop: 'loginRegion',
      minWidth: 140,
    },
    // 登录类型
    {
      label: t('loginLog.loginType'),
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
        if (!row.createUser) {
          return <span>—</span>;
        }
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
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 120,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useLoginLogTableColumns;
