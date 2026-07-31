import type { TableActionDeps } from '@/api/common';
import type { SysPostPageRow } from '@/api/system/post/post';
import { getPostRoles, putPostRoles } from '@/api/system/post/post-role';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/services/feedback/message';
import OrgGrantRoleAssignDrawer from '@/views/system/_shared/components/OrgGrantRoleAssignDrawer.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 岗位「更多」操作依赖 */
export type PostMoreActionDeps = TableActionDeps;

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/**
 * 岗位「更多」操作（分配角色）
 * @param deps 操作依赖
 * @returns 更多操作方法
 */
function usePostMoreAction(deps: PostMoreActionDeps) {
  const { fetchTableData } = deps;
  const { t } = useI18n();

  /**
   * 打开分配角色抽屉
   */
  const openAssignRoleDrawer = (row: SysPostPageRow) => {
    const drawerRef = ref<AssignPanelExpose | null>(null);

    addDrawer({
      title: t('assign.role'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => (
        <OrgGrantRoleAssignDrawer
          ref={drawerRef}
          leftTitle={t('post.assign.current')}
          leftSubtitle={`${row.postName}（${row.postCode}）`}
          loadAssigned={async () => {
            const rows = await getPostRoles(row.id);
            return rows.map((roleRow) => ({
              key: roleRow.id,
              label: roleRow.roleName,
            }));
          }}
        />
      ),
      beforeSure: async (done) => {
        try {
          const roleIds = drawerRef.value?.getSelectedKeys() ?? [];
          await putPostRoles(row.id, { roleIds });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          await fetchTableData();
          done();
        } catch (error: unknown) {
          errorMessage(error);
        }
      },
    });
  };

  return {
    openAssignRoleDrawer,
  };
}

export default usePostMoreAction;
