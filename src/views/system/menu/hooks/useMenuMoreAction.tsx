import type { TableActionDeps } from '@/api/common';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { h, ref } from 'vue';
import MenuAssignPermissionDrawer from '@/views/system/menu/components/MenuAssignPermissionDrawer.vue';
import { useI18n } from 'vue-i18n';
import { addDrawer } from '@/components/ui/Drawer';
import MenuAssignRoleDrawer from '@/views/system/menu/components/MenuAssignRoleDrawer.vue';

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

  const openAssignRoleDrawer = (row: SysMenuRow) => {
    const drawerRef = ref<AssignSaveExpose | null>(null);
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
        const ok = await drawerRef.value?.saveData();
        if (ok) {
          await refresh();
          done();
        }
      },
    });
  };

  const openAssignPermissionDrawer = (row: SysMenuRow) => {
    const drawerRef = ref<AssignSaveExpose | null>(null);
    addDrawer({
      title: t('sysMenu.assignPermissionTitle'),
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
