import type { SysPostPageRow } from '@/api/system/post';
import { selectUserinfo } from '@/components/business/UserProfile';
import { ElButton, ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 岗位表格列
 * @returns 表格列定义
 */
function usePostTableColumns() {
  const { t } = useI18n();

  const columns = computed<TableColumnList>(() => [
    { type: 'selection', align: 'left' },
    { type: 'index', index: (index: number) => index + 1, label: t('table.idx'), minWidth: 60 },
    // 岗位编码
    { label: t('post.field.postCode'), prop: 'postCode', minWidth: 130 },
    // 岗位名称
    { label: t('post.field.postName'), prop: 'postName', minWidth: 140 },
    // 所属部门
    { label: t('post.field.deptName'), prop: 'deptName', minWidth: 140 },
    // 状态
    {
      label: t('post.field.status'),
      prop: 'status',
      minWidth: 100,
      formatter: (row: SysPostPageRow) => {
        const isNormal = row.status === true;
        return (
          <ElTag type={isNormal ? 'success' : 'danger'} effect="plain">
            {isNormal ? t('post.enums.status.normal') : t('post.enums.status.disabled')}
          </ElTag>
        );
      },
    },
    // 排序号
    { label: t('post.field.orderNum'), prop: 'orderNum', width: 100 },
    { label: t('table.createTime'), prop: 'createTime', minWidth: 170 },
    { label: t('table.updateTime'), prop: 'updateTime', minWidth: 170 },
    {
      label: t('table.createUsername'),
      prop: 'createUsername',
      minWidth: 120,
      formatter: (row: SysPostPageRow) => {
        return (
          row.createUser && (
            <ElButton link type="primary" onClick={() => selectUserinfo(row.createUser, row.createUsername)}>
              {row.createUsername}
            </ElButton>
          )
        );
      },
    },
    {
      label: t('table.updateUsername'),
      prop: 'updateUsername',
      minWidth: 120,
      formatter: (row: SysPostPageRow) => {
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
      minWidth: 220,
      slot: 'actions',
    },
  ]);

  return { columns };
}

export default usePostTableColumns;
