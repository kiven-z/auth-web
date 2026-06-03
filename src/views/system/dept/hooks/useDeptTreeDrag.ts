import { moveDept, type SysDeptTreeNode } from '@/api/system/dept';
import { errorMessage, message } from '@/shared/messaging/message';
import {
  canDropDeptTreeNode,
  normalizeDeptParentId,
  resolveNewParentIdFromDrop,
  type DeptTreeDropType,
} from '@/views/system/dept/utils/dept-tree-drag';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** Element Plus 树节点（拖拽回调入参，仅使用 data） */
interface DeptElTreeDragNode {
  data?: SysDeptTreeNode;
}

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

  const allowDrag = () => true;

  /**
   * 是否允许拖拽
   * @param draggingNode 拖拽节点
   * @param dropNode 目标节点
   * @param type 拖拽类型
   * @returns 是否允许拖拽
   */
  const allowDrop = (
    draggingNode: DeptElTreeDragNode,
    dropNode: DeptElTreeDragNode,
    type: DeptTreeDropType
  ): boolean => {
    // 拖拽节点ID和目标节点ID
    const draggedId = String(draggingNode.data?.id ?? '');
    const dropTargetId = String(dropNode.data?.id ?? '');

    // 如果拖拽节点ID或目标节点ID为空，则不允许拖拽
    if (!draggedId || !dropTargetId) {
      return false;
    }
    // 如果不能拖拽到目标节点，则不允许拖拽
    if (!canDropDeptTreeNode(draggedId, dropTargetId, treeData.value)) {
      return false;
    }
    // 如果拖拽类型为内部拖拽，且拖拽节点ID和目标节点ID相同，则不允许拖拽
    if (type === 'inner' && draggedId === dropTargetId) {
      return false;
    }
    return true;
  };

  /**
   * 处理节点拖拽
   * @param draggingNode 拖拽节点
   * @param dropNode 目标节点
   * @param dropType 拖拽类型
   * @param _ev 拖拽事件
   */
  const handleNodeDrop = async (
    draggingNode: DeptElTreeDragNode,
    dropNode: DeptElTreeDragNode,
    dropType: DeptTreeDropType,
    _ev: DragEvent
  ) => {
    // 拖拽节点和目标节点
    const dragged = draggingNode.data as SysDeptTreeNode | undefined;
    const dropTarget = dropNode.data as SysDeptTreeNode | undefined;
    if (!dragged?.id || !dropTarget?.id) {
      return;
    }

    // 新父部门ID
    const newParentId = resolveNewParentIdFromDrop(dropTarget, dropType);
    const currentParentId = normalizeDeptParentId(dragged.parentId);
    if (newParentId === currentParentId) {
      return;
    }

    try {
      await moveDept(dragged.id, { parentId: newParentId });
      message(t('dept.moveSuccess'), { type: 'success' });
      await onMoved();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'dept.moveFailed' });
      await onMoved();
    }
  };

  return {
    allowDrag,
    allowDrop,
    handleNodeDrop,
  };
}
