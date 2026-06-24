/**
 * 密码历史日志表格列定义
 */
import type { PasswordHistoryPageRow } from '@/api/log/password-history';
import { selectUserinfo } from '@/components/business/UserProfile';
import { ElButton } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表格列配置
 * @returns 表格列定义
 */
function usePasswordHistoryTableColumns() {
  const { t } = useI18n();

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
      label: t('passwordHistory.userId'),
      prop: 'username',
      minWidth: 130,
      formatter: (row: PasswordHistoryPageRow) => {
        const uid = row.userId;
        if (!uid) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(uid, row.username)}>
            {row.username ?? uid}
          </ElButton>
        );
      },
    },
    // 修改IP地址
    {
      label: t('passwordHistory.changeIp'),
      prop: 'changeIp',
      minWidth: 140,
    },
    // 修改时间
    {
      label: t('passwordHistory.changeTime'),
      prop: 'changeTime',
      sortable: true,
      minWidth: 160,
    },
    // 创建时间
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    // 创建人
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: PasswordHistoryPageRow) => {
        if (!row.createUser) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
            {row.createUsername ?? row.createUser}
          </ElButton>
        );
      },
    },
    // 更新人
    {
      label: t('table.updateUsername'),
      prop: 'updateUser',
      minWidth: 130,
      formatter: (row: PasswordHistoryPageRow) => {
        if (!row.updateUser) {
          return <span>—</span>;
        }
        return (
          <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
            {row.updateUsername ?? row.updateUser}
          </ElButton>
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

export default usePasswordHistoryTableColumns;
