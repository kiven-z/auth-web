import { formatDateTime } from '@/shared/utils/date/dateTime';
import {
  LOGIN_LOG_TYPE_FILTER_OPTIONS,
  resolveLoginLogResultMeta,
} from '@/views/log/login-log/constants/login-log-enums';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 登录日志详情描述列
 * @returns 详情列配置
 */
function useLoginLogDetailColumns() {
  const { t } = useI18n();

  const detailColumns = computed(() => [
    {
      label: t('loginLog.field.userId'),
      prop: 'userId',
      labelWidth: 120,
      copy: true,
      cellRenderer: ({ value }) => <span>{value ?? '—'}</span>,
    },
    { label: t('loginLog.field.username'), prop: 'username', labelWidth: 120, copy: true },
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
    {
      label: t('loginLog.field.loginTime'),
      prop: 'loginTime',
      copy: true,
      cellRenderer: ({ value }) => formatDateTime(value),
    },

    { label: t('loginLog.field.loginIp'), prop: 'loginIp', copy: true },
    { label: t('loginLog.field.loginRegion'), prop: 'loginRegion' },
    { label: t('loginLog.field.userAgent'), prop: 'userAgent' },
    { label: t('loginLog.field.deviceType'), prop: 'deviceType', labelWidth: 120 },
    { label: t('loginLog.field.osType'), prop: 'osType' },
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
    {
      label: t('table.createdAt'),
      prop: 'createdAt',
      cellRenderer: ({ value }) => formatDateTime(value),
    },

    {
      label: t('table.updatedAt'),
      prop: 'updatedAt',
      cellRenderer: ({ value }) => formatDateTime(value),
    },
  ]);

  return { detailColumns };
}

export default useLoginLogDetailColumns;
