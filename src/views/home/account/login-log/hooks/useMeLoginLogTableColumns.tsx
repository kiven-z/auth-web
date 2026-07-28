import { formatDateTime } from '@/shared/utils/date/dateTime';
import type { MeLoginLogPageRow } from '@/api/system/user-me';
import {
  LOGIN_LOG_TYPE_FILTER_OPTIONS,
  resolveLoginLogResultMeta,
} from '@/views/log/login-log/constants/login-log-enums';
import { ElTag } from 'element-plus';
import { useI18n } from 'vue-i18n';

/**
 * 个人中心登录日志表格列
 * @returns 表格列定义
 */
function useMeLoginLogTableColumns() {
  const { t } = useI18n();

  const loginTypeLabel = (type: string | null | undefined) => {
    if (!type) return '';
    const option = LOGIN_LOG_TYPE_FILTER_OPTIONS.find((item) => item.value === type);
    return option ? t(option.labelKey) : type;
  };

  const meLoginLogTableColumns = [
    {
      label: t('loginLog.field.loginTime'),
      prop: 'loginTime',
      sortable: true,
      minWidth: 170,
      formatter: (row: MeLoginLogPageRow) => formatDateTime(row.loginTime),
    },
    {
      label: t('loginLog.field.loginRegion'),
      prop: 'loginRegion',
      minWidth: 140,
    },
    {
      label: t('loginLog.field.loginResult'),
      prop: 'loginResult',
      minWidth: 140,
      formatter: (row: MeLoginLogPageRow) => {
        const code = row.loginResult;
        if (code === undefined || code === null) return <span>—</span>;
        const meta = resolveLoginLogResultMeta(code);
        if (!meta) return <span>{String(code)}</span>;

        return (
          <ElTag type={meta.tagType} effect="plain">
            {t(meta.labelKey)}
          </ElTag>
        );
      },
    },
    {
      label: t('loginLog.field.loginType'),
      prop: 'loginType',
      minWidth: 130,
      formatter: (row: MeLoginLogPageRow) => loginTypeLabel(row.loginType),
    },
  ];

  return { meLoginLogTableColumns };
}

export default useMeLoginLogTableColumns;
