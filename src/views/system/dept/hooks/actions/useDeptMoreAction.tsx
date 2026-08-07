import type { SysDeptListVO } from '@/api/system/dept/dept';
import { getDeptRoles, putDeptRoles } from '@/api/system/dept/dept-role';
import { openAssignDrawer } from '@/components/domain/assign/AssignPanel';
import type { TableActionDeps } from '@/shared/types/table-action';
import RoleAssignPanel from '@/views/system/_shared/assign/RoleAssignPanel.vue';
import useOpenDeptAuthorizationSurface from '@/views/system/dept/hooks/authorization/useOpenDeptAuthorizationSurface';
import { useI18n } from 'vue-i18n';

/** 部门「更多」操作依赖 */
export interface DeptMoreActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * 部门「更多」操作（授权面、分配角色）
 * @param deps 操作依赖
 * @returns 更多操作方法
 */
function useDeptMoreAction(deps: DeptMoreActionDeps) {
  const { refresh } = deps;
  const { t } = useI18n();
  const { openDeptAuthorizationSurface } = useOpenDeptAuthorizationSurface();

  /**
   * 打开分配角色抽屉
   * @param row 部门行
   */
  const openAssignRoleDrawer = (row: SysDeptListVO) => {
    const loadAssigned = async () => {
      const rows = await getDeptRoles(row.id);
      return rows.map((roleRow) => ({
        key: roleRow.id,
        label: roleRow.roleName,
      }));
    };

    openAssignDrawer({
      title: t('assign.role'),
      contentRenderer: (panelRef) => (
        <RoleAssignPanel
          ref={panelRef}
          leftTitle={t('dept.assignRole.currentDept')}
          leftSubtitle={`${row.deptName}（${row.deptCode}）`}
          loadAssigned={loadAssigned}
        />
      ),
      onSubmit: (roleIds) => putDeptRoles(row.id, { roleIds }),
      afterSave: refresh,
    });
  };

  return {
    openDeptAuthorizationSurface,
    openAssignRoleDrawer,
  };
}

export default useDeptMoreAction;
