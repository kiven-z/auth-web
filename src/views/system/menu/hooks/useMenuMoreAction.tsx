import type { TableActionDeps } from '@/api/common';
import { addDrawer } from '@/components/ui/Drawer';
import MenuAssignPermissionDrawer from '@/views/system/menu/components/MenuAssignPermissionDrawer.vue';
import MenuAssignRoleDrawer from '@/views/system/menu/components/MenuAssignRoleDrawer.vue';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface MenuTableActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
}

type AssignSaveExpose = {
  saveData: () => Promise<boolean>;
};

function useMenuMoreAction(deps: MenuTableActionDeps) {
  const { refresh } = deps;

  const { t } = useI18n();

  /**
   * 打开分配角色抽屉
   * @param row 行数据
   */
  const openAssignRoleDrawer = (row: SysMenuRow) => {
    const drawerRef = ref<AssignSaveExpose | null>(null);
    addDrawer({
      title: t('sysMenu.assignRoleTitle'),
      class: 'auth-assign-manage-drawer',
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
        const ok = await drawerRef.value?.saveData();
        if (ok) {
          await refresh();
          done();
        }
      },
    });
  };

  /**
   * 打开分配权限抽屉
   * @param row 行数据
   */
  const openAssignPermissionDrawer = (row: SysMenuRow) => {
    const drawerRef = ref<AssignSaveExpose | null>(null);
    addDrawer({
      title: t('sysMenu.assignPermissionTitle'),
      class: 'auth-assign-manage-drawer',
      direction: 'ttb',
      size: '100%',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () =>
        h(MenuAssignPermissionDrawer, { ref: drawerRef, menuId: row.id, menuTitle: row.title, menuName: row.name }),
      beforeSure: async (done) => {
        const ok = await drawerRef.value?.saveData();
        if (ok) {
          await refresh();
          done();
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
