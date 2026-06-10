import { DEPT_ROOT_PARENT_ID, moveDept, type SysDeptTreeNode } from '@/api/system/dept';
import { useElTreeMoveDrag } from '@/views/system/_shared/hooks/useElTreeMoveDrag';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** {@link useDeptTreeDrag} 配置 */
export interface UseDeptTreeDragOptions {
  treeData: Ref<SysDeptTreeNode[]>;
  onMoved: () => Promise<void>;
}

/**
 * 部门树拖拽移动（对接 PUT /dept/{id}/move，允许 parentId=0）
 */
export function useDeptTreeDrag(options: UseDeptTreeDragOptions) {
  const { t } = useI18n();
  const { treeData, onMoved } = options;

  return useElTreeMoveDrag<SysDeptTreeNode>({
    treeData,
    rootParentId: DEPT_ROOT_PARENT_ID,
    getNodeLabel: (node) => node.deptName,
    onMoved,
    moveNode: (id, parentId) => moveDept(id, { parentId }),
    messages: {
      confirmTitle: t('dept.moveConfirmTitle'),
      confirmInner: (dragged, dropTarget) =>
        t('dept.moveConfirmInner', { dept: dragged.deptName, parent: dropTarget.deptName }),
      confirmSibling: (dragged, dropTarget, parentLabel) =>
        t('dept.moveConfirmSibling', {
          dept: dragged.deptName,
          peer: dropTarget.deptName,
          parent: parentLabel,
        }),
      success: t('dept.moveSuccess'),
      failedI18nKey: 'dept.moveFailed',
      topLevelLabel: t('dept.parentTopLevel'),
    },
  });
}
