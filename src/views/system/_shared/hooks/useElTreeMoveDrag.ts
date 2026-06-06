import { multiConfirm } from '@/shared/messaging/dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import {
  canDropTreeNode,
  normalizeTreeParentId,
  resolveMoveTargetParentLabel,
  resolveNewParentIdFromDrop,
  type TreeDropType,
  type TreeMoveNode,
} from '@/views/system/_shared/utils/tree-drag';
import type { Ref } from 'vue';

/** Element Plus 树节点（拖拽回调入参，仅使用 data） */
interface ElTreeDragNode<T> {
  data?: T;
}

/** 树移动确认文案 */
export interface ElTreeMoveDragMessages<T> {
  confirmTitle: string;
  confirmInner: (dragged: T, dropTarget: T) => string;
  confirmSibling: (dragged: T, dropTarget: T, parentLabel: string) => string;
  success: string;
  failedI18nKey: string;
  topLevelLabel: string;
}

/** {@link useElTreeMoveDrag} 配置 */
export interface UseElTreeMoveDragOptions<T extends TreeMoveNode> {
  treeData: Ref<T[]>;
  rootParentId: string;
  getNodeLabel: (node: T) => string;
  onMoved: () => Promise<void>;
  moveNode: (id: string, parentId: string) => Promise<void>;
  messages: ElTreeMoveDragMessages<T>;
}

/**
 * 树节点拖拽移动（变更父节点）
 */
export function useElTreeMoveDrag<T extends TreeMoveNode>(options: UseElTreeMoveDragOptions<T>) {
  const { treeData, rootParentId, getNodeLabel, onMoved, moveNode, messages } = options;

  const allowDrag = () => true;

  /**
   * 是否允许放置：禁止自身/后代落点
   * @param draggingNode 被拖拽节点
   * @param dropNode 目标节点
   * @param type 落点类型
   * @returns 是否允许放置
   */
  const allowDrop = (draggingNode: ElTreeDragNode<T>, dropNode: ElTreeDragNode<T>, type: TreeDropType): boolean => {
    const draggedId = String(draggingNode.data?.id);
    const dropTargetId = String(dropNode.data?.id);

    if (!canDropTreeNode(draggedId, dropTargetId, treeData.value)) {
      return false;
    }
    return !(type === 'inner' && draggedId === dropTargetId);
  };

  /**
   * 处理节点放置
   * @param draggingNode 被拖拽节点
   * @param dropNode 目标节点
   * @param dropType 落点类型
   * @param _ev 事件
   */
  const handleNodeDrop = async (
    draggingNode: ElTreeDragNode<T>,
    dropNode: ElTreeDragNode<T>,
    dropType: TreeDropType,
    _ev: DragEvent
  ) => {
    const dragged = draggingNode.data;
    const dropTarget = dropNode.data;
    if (!dragged || !dropTarget) {
      return;
    }

    const newParentId = resolveNewParentIdFromDrop(dropTarget, dropType, rootParentId);
    const currentParentId = normalizeTreeParentId(dragged.parentId, rootParentId);
    if (newParentId === currentParentId) {
      await onMoved();
      return;
    }

    const parentLabel = resolveMoveTargetParentLabel(
      newParentId,
      treeData.value,
      rootParentId,
      messages.topLevelLabel,
      getNodeLabel
    );

    // 组装确认文案
    const confirmMessage =
      dropType === 'inner'
        ? messages.confirmInner(dragged, dropTarget)
        : messages.confirmSibling(dragged, dropTarget, parentLabel);

    const confirmed = await multiConfirm([{ title: messages.confirmTitle, message: confirmMessage }]);

    if (!confirmed) {
      await onMoved();
      return;
    }

    try {
      await moveNode(dragged.id, newParentId);
      message(messages.success, { type: 'success' });
      await onMoved();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: messages.failedI18nKey });
      await onMoved();
    }
  };

  return {
    allowDrag,
    allowDrop,
    handleNodeDrop,
  };
}
