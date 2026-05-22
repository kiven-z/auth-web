import type { TableActionDeps } from '@/api/common';
import { putMenuPermissions, putMenuRoles } from '@/api/system/menu';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/shared/messaging/message';
import MenuAssignPermissionDrawer from '@/views/system/menu/components/MenuAssignPermissionDrawer.vue';
import MenuAssignRoleDrawer from '@/views/system/menu/components/MenuAssignRoleDrawer.vue';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface MenuTableActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

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
      title: t('sysMenu.assignRoleTitle'),
      size: '100%',
      direction: 'btt',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () =>
        h(MenuAssignRoleDrawer, {
          ref: drawerRef,
          menuId: row.id,
          menuTitle: row.title,
          menuName: row.name,
        }),
      beforeSure: async (done) => {
        try {
          const roleCodes = drawerRef.value?.getSelectedKeys() ?? [];
          await putMenuRoles(row.id, { roleCodes });
          message(t('sysMenu.assignSaveSuccess'), { type: 'success' });
          await refresh();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'sysMenu.assignSaveFailed' });
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
      direction: 'ttb',
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () =>
        h(MenuAssignPermissionDrawer, {
          ref: drawerRef,
          menuId: row.id,
          menuTitle: row.title,
          menuName: row.name,
        }),
      beforeSure: async (done) => {
        try {
          const permissionCodes = drawerRef.value?.getSelectedKeys() ?? [];
          await putMenuPermissions(row.id, { permissionCodes });
          message(t('sysMenu.assignSaveSuccess'), { type: 'success' });
          await refresh();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'sysMenu.assignSaveFailed' });
        }
      },
    });
  };

  return {
    openAssignRoleDrawer,
    openAssignPermissionDrawer,
  };
}

export default useMenuMoreAction;
