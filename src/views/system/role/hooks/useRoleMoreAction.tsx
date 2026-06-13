import { assignRolePermissions, getRolePermissions, type SysRolePageRow } from '@/api/system/role';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/ui/feedback/message';
import PermissionAssignDrawer from '@/views/system/_shared/components/PermissionAssignDrawer.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/**
 * 角色表格「更多」操作：分配权限等抽屉
 * @returns 更多操作方法
 */
function useRoleMoreAction() {
  const { t } = useI18n();

  /**
   * 打开分配权限抽屉
   * @param row 表格行
   */
  const openAssignPermissionDrawer = (row: SysRolePageRow) => {
    const drawerRef = ref<AssignPanelExpose | null>(null);

    addDrawer({
      title: t('roles.assign.permission'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => (
        <PermissionAssignDrawer
          ref={drawerRef}
          leftTitle={t('roles.assign.current')}
          leftSubtitle={`${row.roleName} (${row.roleCode})`}
          loadAssigned={async () => {
            const rows = await getRolePermissions(row.roleCode);
            return rows.map((permissionRow) => ({
              key: permissionRow.permissionCode,
              label: permissionRow.permissionName,
            }));
          }}
          showPermissionTypeFilter
          tableTitle={t('roles.assign.permission')}
        />
      ),
      beforeSure: async (done) => {
        try {
          const permissionCodes = drawerRef.value?.getSelectedKeys() ?? [];
          await assignRolePermissions(row.roleCode, { permissionCodes });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'tips.assignSaveFailed' });
        }
      },
    });
  };

  return {
    openAssignPermissionDrawer,
  };
}

export default useRoleMoreAction;
