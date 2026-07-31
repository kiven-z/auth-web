import type { TableActionDeps } from '@/api/common';
import type { SysDeptListVO } from '@/api/system/dept/dept';
import { getDeptRoles, putDeptRoles } from '@/api/system/dept/dept-role';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/services/feedback/message';
import OrgGrantRoleAssignDrawer from '@/views/system/_shared/components/OrgGrantRoleAssignDrawer.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 部门「更多」操作依赖 */
export interface DeptMoreActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/**
 * 部门「更多」操作（分配角色）
 * @param deps 操作依赖
 * @returns 更多操作方法
 */
function useDeptMoreAction(deps: DeptMoreActionDeps) {
  const { refresh } = deps;
  const { t } = useI18n();

  /**
   * 打开分配角色抽屉
   */
  const openAssignRoleDrawer = (row: SysDeptListVO) => {
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
          leftTitle={t('dept.assignRole.currentDept')}
          leftSubtitle={`${row.deptName}（${row.deptCode}）`}
          loadAssigned={async () => {
            const rows = await getDeptRoles(row.id);
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
          await putDeptRoles(row.id, { roleIds });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          await refresh();
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

export default useDeptMoreAction;
