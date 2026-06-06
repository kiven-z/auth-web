import { assignRolePermissions, type SysRolePageRow } from '@/api/system/role';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/ui/feedback/message';
import RoleAssignPermissionDrawer from '@/views/system/role/components/RoleAssignPermissionDrawer.vue';
import { h, ref } from 'vue';
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
      title: t('roles.assignPermissionTitle'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () =>
        h(RoleAssignPermissionDrawer, {
          ref: drawerRef,
          roleCode: row.roleCode,
          roleName: row.roleName,
        }),
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
