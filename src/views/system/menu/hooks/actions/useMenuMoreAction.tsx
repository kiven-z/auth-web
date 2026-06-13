import type { TableActionDeps } from '@/api/common';
import { getMenuPermissions, getMenuRoles, putMenuPermissions, putMenuRoles } from '@/api/system/menu';
import { addDrawer } from '@/components/ui/Drawer';
import { transformI18n } from '@/plugins/i18n';
import { errorMessage, message } from '@/ui/feedback/message';
import OrgGrantRoleAssignDrawer from '@/views/system/_shared/components/OrgGrantRoleAssignDrawer.vue';
import PermissionAssignDrawer from '@/views/system/_shared/components/PermissionAssignDrawer.vue';
import type { SysMenuRow } from '@/views/system/menu/hooks/useMenuPageState';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 菜单「更多」操作依赖 */
export interface MenuTableActionDeps extends TableActionDeps {
  fetchTreeData: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/** 菜单分配角色默认筛选类型（菜单角色） */
const MENU_ASSIGN_ROLE_TYPES = [2];

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
          defaultRoleTypes={MENU_ASSIGN_ROLE_TYPES}
          leftTitle={t('sysMenu.name')}
          leftSubtitle={`${transformI18n(row.title)} (${row.name})`}
          loadAssigned={async () => {
            const rows = await getMenuRoles(row.id);
            return rows.map((roleRow) => ({ key: roleRow.roleCode, label: roleRow.roleName }));
          }}
          showRoleTypeColumn={false}
          showRoleTypeFilter={false}
        />
      ),
      beforeSure: async (done) => {
        try {
          const roleCodes = drawerRef.value?.getSelectedKeys() ?? [];
          await putMenuRoles(row.id, { roleCodes });
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
                key: permissionRow.permissionCode,
                label: permissionRow.permissionName,
              }));
          }}
          tableTitle={t('sysMenu.assignPermissionTitle')}
        />
      ),
      beforeSure: async (done) => {
        try {
          const permissionCodes = drawerRef.value?.getSelectedKeys() ?? [];
          await putMenuPermissions(row.id, { permissionCodes });
          message(t('tips.assignSaveSuccess'), { type: 'success' });
          await refresh();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'tips.assignSaveFailed' });
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
