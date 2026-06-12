import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门闭包表健康检查列定义
 * @returns 部门闭包表健康检查列定义
 */
function useDeptClosureHealthColumns() {
  const { t } = useI18n();

  // 概览列
  const summaryColumns = computed(() => [
    {
      label: t('dept.closureHealthPassed'),
      prop: 'passed',
      labelWidth: 140,
      cellRenderer: ({ value }: { value: boolean }) => (
        <ElTag type={value ? 'success' : 'danger'} effect="plain">
          {value ? t('status.passedYes') : t('status.passedNo')}
        </ElTag>
      ),
    },
    { label: t('dept.closureHealthCheckedAt'), prop: 'checkedAt', labelWidth: 140 },
    { label: t('dept.closureHealthMissingParentLink'), prop: 'missingParentLinkCount', labelWidth: 140 },
    { label: t('dept.closureHealthDepthChain'), prop: 'depthChainAnomalyCount', labelWidth: 140 },
    {
      label: t('dept.closureHealthParentLinkTruncated'),
      prop: 'parentLinkSampleTruncated',
      labelWidth: 140,
      cellRenderer: ({ value }: { value: boolean }) => <span>{value ? t('status.yes') : t('status.no')}</span>,
    },
    {
      label: t('dept.closureHealthDepthChainTruncated'),
      prop: 'depthChainSampleTruncated',
      labelWidth: 140,
      cellRenderer: ({ value }: { value: boolean }) => <span>{value ? t('status.yes') : t('status.no')}</span>,
    },
  ]);

  // 健康度统计列
  const healthStatsColumns = computed(() => [
    { label: t('dept.closureHealthOnlySelf'), prop: 'onlySelf', labelWidth: 140 },
    { label: t('dept.closureHealthHasAncestors'), prop: 'hasAncestors', labelWidth: 140 },
    { label: t('dept.closureHealthZeroClosure'), prop: 'zeroClosure', labelWidth: 140 },
    { label: t('dept.closureHealthTotal'), prop: 'total', labelWidth: 140 },
  ]);

  // 父子直连异常样本列
  const parentLinkColumns = computed(() => [
    { label: t('dept.deptName'), prop: 'deptName', labelWidth: 120 },
    { label: 'ID', prop: 'id', labelWidth: 120, copy: true },
    { label: t('dept.parentDept'), prop: 'parentId', labelWidth: 120, copy: true },
    { label: t('dept.closureHealthLinkStatus'), prop: 'parentLinkStatus', labelWidth: 160 },
  ]);

  // 深度链条异常样本列
  const depthChainColumns = computed(() => [
    { label: t('dept.deptName'), prop: 'deptName', labelWidth: 120 },
    { label: 'ID', prop: 'id', labelWidth: 120, copy: true },
    { label: t('dept.parentDept'), prop: 'parentId', labelWidth: 120, copy: true },
    { label: t('dept.closureHealthChildCnt'), prop: 'childClosureCnt', labelWidth: 120 },
    { label: t('dept.closureHealthParentCnt'), prop: 'parentClosureCnt', labelWidth: 120 },
    { label: t('dept.closureHealthExpectedCnt'), prop: 'expectedChildCnt', labelWidth: 120 },
  ]);

  return {
    summaryColumns,
    healthStatsColumns,
    parentLinkColumns,
    depthChainColumns,
  };
}

export default useDeptClosureHealthColumns;
