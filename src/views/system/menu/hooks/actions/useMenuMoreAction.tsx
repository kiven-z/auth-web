import type { TableActionDeps } from '@/shared/types/table-action';
import { getMenuRoles, putMenuRoles } from '@/api/system/menu/menu-role';
import { addDrawer } from '@/components/ui/Drawer';
import { transformI18n } from '@/app/plugins/i18n';
import { errorMessage, message } from '@/services/feedback/message';
import RoleAssignPanel from '@/views/system/_shared/assign/RoleAssignPanel.vue';
import useOpenMenuAuthorizationSurface from '@/views/system/menu/hooks/authorization/useOpenMenuAuthorizationSurface';
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

/**
 * 菜单「更多」操作（授权面、分配角色）
 * @param deps 表格操作依赖
 * @returns 更多操作方法
 */
function useMenuMoreAction(deps: MenuTableActionDeps) {
  const { refresh } = deps;
  const { t } = useI18n();
  const { openMenuAuthorizationSurface } = useOpenMenuAuthorizationSurface();

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
        <RoleAssignPanel
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
          errorMessage(error);
        }
      },
    });
  };

  return {
    openMenuAuthorizationSurface,
    openAssignRoleDrawer,
  };
}

export default useMenuMoreAction;
