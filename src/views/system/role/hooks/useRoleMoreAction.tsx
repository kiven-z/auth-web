import { assignRolePermissions, getRolePermissions, type SysRolePageRow } from '@/api/system/role';
import { type SysRoleScopeForm, upsertRoleScope } from '@/api/system/role-scope';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/services/feedback/message';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/shared/composables/table/useFormOverlaySubmit';
import PermissionAssignDrawer from '@/views/system/_shared/components/PermissionAssignDrawer.vue';
import RoleDataScopeDialog from '@/views/system/role/components/RoleDataScopeDialog.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/**
 * 角色表格「更多」操作：分配权限、数据范围等
 * @returns 更多操作方法
 */
function useRoleMoreAction() {
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

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
            const rows = await getRolePermissions(row.id);
            return rows.map((permissionRow) => ({
              key: permissionRow.id,
              label: permissionRow.permissionName,
            }));
          }}
          tableTitle={t('roles.assign.permission')}
        />
      ),
      beforeSure: async (done) => {
        try {
          const permissionIds = drawerRef.value?.getSelectedKeys() ?? [];
          await assignRolePermissions(row.id, { permissionIds });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          done();
        } catch (error: unknown) {
          errorMessage(error);
        }
      },
    });
  };

  /**
   * 打开数据范围配置弹窗
   * @param row 表格行
   */
  const openDataScopeDialog = (row: SysRolePageRow) => {
    const dialogFormRef = ref<FormOverlayExpose<SysRoleScopeForm> | null>(null);

    addDialog({
      title: `${t('roles.menu.dataScope')} - ${row.roleName} (${row.roleCode})`,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => <RoleDataScopeDialog ref={dialogFormRef} roleId={row.id} />,
      beforeSure: createFormBeforeSure<SysRoleScopeForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formPayload) => {
          await upsertRoleScope(row.id, formPayload);
        },
      }),
    });
  };

  return {
    openAssignPermissionDrawer,
    openDataScopeDialog,
  };
}

export default useRoleMoreAction;
