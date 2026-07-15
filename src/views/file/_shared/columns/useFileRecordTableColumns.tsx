import type { FileRecordPageRow } from '@/api/file/file-record';
import { selectUserinfo } from '@/components/business/UserProfile';
import { formatFileSize } from '@/shared/utils/file/fileSize';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 文件记录表格列配置。
 * @returns 表格列定义
 */
function useFileRecordTableColumns() {
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
      width: 70,
    },
    // 文件名称
    {
      label: t('fileRecord.fields.originalName'),
      prop: 'originalName',
      minWidth: 220,
    },
    // 存储平台
    {
      label: t('fileRecord.fields.storagePlatform'),
      prop: 'storagePlatform',
      minWidth: 120,
    },
    // 上传模式
    {
      label: t('fileRecord.fields.uploadMode'),
      prop: 'uploadMode',
      minWidth: 110,
    },
    // 文件大小
    {
      label: t('fileRecord.fields.size'),
      prop: 'size',
      minWidth: 120,
      formatter: (row: FileRecordPageRow) => formatFileSize(row.size),
    },
    // 文件类型
    {
      label: t('fileRecord.fields.contentType'),
      prop: 'contentType',
      minWidth: 180,
    },
    // 是否私有文件
    {
      label: t('fileRecord.fields.isPrivate'),
      prop: 'isPrivate',
      minWidth: 110,
      formatter: (row: FileRecordPageRow) => {
        return (
          <ElTag type={row.isPrivate ? 'warning' : 'success'} effect="plain">
            {row.isPrivate ? t('status.yes') : t('status.no')}
          </ElTag>
        );
      },
    },
    // 业务类型
    {
      label: t('fileRecord.fields.bizType'),
      prop: 'bizType',
      minWidth: 130,
    },
    // 业务 ID
    {
      label: t('fileRecord.fields.bizId'),
      prop: 'bizId',
      minWidth: 150,
    },
    // 创建时间
    {
      label: t('table.createTime'),
      prop: 'createTime',
      sortable: true,
      minWidth: 170,
    },
    // 更新时间
    {
      label: t('table.updateTime'),
      prop: 'updateTime',
      sortable: true,
      minWidth: 170,
    },
    // 创建人
    {
      label: t('table.createUsername'),
      prop: 'createUser',
      minWidth: 130,
      formatter: (row: FileRecordPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    // 更新人
    {
      label: t('table.updateUsername'),
      prop: 'updateUser',
      minWidth: 130,
      formatter: (row: FileRecordPageRow) => {
        return (
          row.updateUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.updateUser, row.updateUsername)}>
              {row.updateUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.actions'),
      fixed: 'right' as const,
      width: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default useFileRecordTableColumns;
