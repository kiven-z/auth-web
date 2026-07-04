import { moveMenu, type SysMenuTreeNode } from '@/api/system/menu';
import { transformI18n } from '@/app/plugins/i18n';
import { useElTreeMoveDrag } from '@/views/system/_shared/hooks/useElTreeMoveDrag';
import { MENU_ROOT_PARENT_ID } from '@/views/system/menu/utils/menu-parent';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** {@link useMenuTreeDrag} 配置 */
export interface UseMenuTreeDragOptions {
  treeData: Ref<SysMenuTreeNode[]>;
  onMoved: () => Promise<void>;
}

/**
 * 菜单树拖拽移动（对接 PUT /menu/{id}/move，允许 parentId=0）
 */
export function useMenuTreeDrag(options: UseMenuTreeDragOptions) {
  const { t } = useI18n();
  const { treeData, onMoved } = options;

  const menuLabel = (node: SysMenuTreeNode) => transformI18n(node.title);

  return useElTreeMoveDrag<SysMenuTreeNode>({
    treeData,
    rootParentId: MENU_ROOT_PARENT_ID,
    getNodeLabel: menuLabel,
    onMoved,
    moveNode: (id, parentId) => moveMenu(id, { parentId }),
    messages: {
      confirmTitle: t('sysMenu.moveConfirmTitle'),
      confirmInner: (dragged, dropTarget) =>
        t('sysMenu.moveConfirmInner', { menu: menuLabel(dragged), parent: menuLabel(dropTarget) }),
      confirmSibling: (dragged, dropTarget, parentLabel) =>
        t('sysMenu.moveConfirmSibling', {
          menu: menuLabel(dragged),
          peer: menuLabel(dropTarget),
          parent: parentLabel,
        }),
      success: t('sysMenu.moveSuccess'),
      failedI18nKey: 'sysMenu.moveFailed',
      topLevelLabel: t('sysMenu.parentTopLevel'),
    },
  });
}
