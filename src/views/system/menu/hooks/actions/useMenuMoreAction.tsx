import type { TableActionDeps } from '@/api/common';
import { getMenuDetail, getMenuPermissions, getMenuRoles, putMenuPermissions, putMenuRoles } from '@/api/system/menu';
import { addDialog } from '@/components/ui/Dialog';
import { addDrawer } from '@/components/ui/Drawer';
import { transformI18n } from '@/plugins/i18n';
import { errorMessage, message } from '@/ui/feedback/message';
import OrgGrantRoleAssignDrawer from '@/views/system/_shared/components/OrgGrantRoleAssignDrawer.vue';
import PermissionAssignDrawer from '@/views/system/_shared/components/PermissionAssignDrawer.vue';
import MenuBindingDescriptionDialog from '@/views/system/menu/components/MenuBindingDescriptionDialog.vue';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 菜单「更多」操作依赖 */
export interface MenuTableActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/**
 * 菜单「更多」操作
 * @param deps 表格操作依赖
 * @returns 更多操作方法
 */
function useMenuMoreAction(deps: MenuTableActionDeps) {
  const { refresh } = deps;
  const { t } = useI18n();

  /**
   * 打开分配角色抽屉
   * @param row 行数据
   */
  const openAssignRoleDrawer = (row: SysMenuRow) => {
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
          leftTitle={t('sysMenu.name')}
          leftSubtitle={`${transformI18n(row.title)} (${row.name})`}
          loadAssigned={async () => {
            const rows = await getMenuRoles(row.id);
            return rows.map((roleRow) => ({ key: roleRow.id, label: roleRow.roleName }));
          }}
        />
      ),
      beforeSure: async (done) => {
        try {
          const roleIds = drawerRef.value?.getSelectedKeys() ?? [];
          await putMenuRoles(row.id, { roleIds });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          await refresh();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'tips.assignSaveFailed' });
        }
      },
    });
  };

  /**
   * 打开分配权限抽屉
   * @param row 行数据
   */
  const openAssignPermissionDrawer = (row: SysMenuRow) => {
    const drawerRef = ref<AssignPanelExpose | null>(null);

    addDrawer({
      title: t('sysMenu.assignPermissionTitle'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => (
        <PermissionAssignDrawer
          ref={drawerRef}
          fixedPermissionType={0}
          leftTitle={t('sysMenu.assignCurrentMenu')}
          leftSubtitle={`${transformI18n(row.title)} (${row.name})`}
          loadAssigned={async () => {
            const list = await getMenuPermissions(row.id);
            return list
              .filter((permissionRow) => permissionRow.assigned)
              .map((permissionRow) => ({
                key: permissionRow.id,
                label: permissionRow.permissionName,
              }));
          }}
          tableTitle={t('sysMenu.assignPermissionTitle')}
        />
      ),
      beforeSure: async (done) => {
        try {
          const permissionIds = drawerRef.value?.getSelectedKeys() ?? [];
          await putMenuPermissions(row.id, { permissionIds });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          await refresh();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'tips.assignSaveFailed' });
        }
      },
    });
  };

  /**
   * 打开绑定关系查看弹窗
   * @param row 行数据
   */
  const openBindingDialog = async (row: SysMenuRow) => {
    try {
      const detail = await getMenuDetail(row.id);

      addDialog({
        title: t('sysMenu.bindingDialogTitle'),
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        hideFooter: true,
        contentRenderer: () => h(MenuBindingDescriptionDialog, { data: detail }),
      });
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: 'sysMenu.loadFailed' });
    }
  };

  return {
    openAssignRoleDrawer,
    openAssignPermissionDrawer,
    openBindingDialog,
  };
}

export default useMenuMoreAction;
