import type { TableActionDeps } from '@/api/common';
import { putPostRoles, type SysPostPageRow } from '@/api/system/post';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/shared/messaging/message';
import PostAssignRoleDrawer from '@/views/system/post/components/PostAssignRoleDrawer.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 岗位「更多」操作依赖 */
export interface PostMoreActionDeps extends TableActionDeps {
  refresh: () => Promise<void>;
}

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/**
 * 岗位「更多」操作（分配角色）
 * @param deps 操作依赖
 * @returns 更多操作方法
 */
function usePostMoreAction(deps: PostMoreActionDeps) {
  const { refresh } = deps;
  const { t } = useI18n();

  /**
   * 打开分配角色抽屉
   */
  const openAssignRoleDrawer = (row: SysPostPageRow) => {
    const drawerRef = ref<AssignPanelExpose | null>(null);

    addDrawer({
      title: t('post.assignRole'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () =>
        h(PostAssignRoleDrawer, {
          ref: drawerRef,
          postId: row.id,
          postName: row.postName,
          postCode: row.postCode,
        }),
      beforeSure: async (done) => {
        try {
          const roleCodes = drawerRef.value?.getSelectedKeys() ?? [];
          await putPostRoles(row.id, { roleCodes });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          await refresh();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'tips.assignSaveFailed' });
        }
      },
    });
  };

  return {
    openAssignRoleDrawer,
  };
}

export default usePostMoreAction;
