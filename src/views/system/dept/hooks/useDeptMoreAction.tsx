import type { TableActionDeps } from '@/api/common';
import { putDeptRoles, type SysDeptListVO } from '@/api/system/dept';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/shared/messaging/message';
import DeptAssignRoleDrawer from '@/views/system/dept/components/DeptAssignRoleDrawer.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface DeptMoreActionDeps extends TableActionDeps {
  refresh: () => Promise<void>;
}

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/** 待开发：分配岗位能力上线前占位提示 */
const ASSIGN_POST_NOT_READY_MESSAGE = '部门分配岗位功能开发中';

/**
 * 部门「更多」操作（分配角色/岗位）
 */
function useDeptMoreAction(deps: DeptMoreActionDeps) {
  const { refresh } = deps;
  const { t } = useI18n();

  /**
   * 打开分配角色抽屉
   */
  const openAssignRoleDrawer = (row: SysDeptListVO) => {
    const drawerRef = ref<AssignPanelExpose | null>(null);

    addDrawer({
      title: t('dept.assignRole'),
      size: '100%',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () =>
        h(DeptAssignRoleDrawer, {
          ref: drawerRef,
          deptId: row.id,
          deptName: row.deptName,
          deptCode: row.deptCode,
        }),
      beforeSure: async (done) => {
        try {
          const roleCodes = drawerRef.value?.getSelectedKeys() ?? [];
          await putDeptRoles(row.id, { roleCodes });
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
   * 分配岗位（暂未开放）
   */
  const openAssignPostDrawer = (_row: SysDeptListVO) => {
    void _row;
    message(ASSIGN_POST_NOT_READY_MESSAGE, { type: 'warning' });
  };

  return {
    openAssignRoleDrawer,
    openAssignPostDrawer,
  };
}

export default useDeptMoreAction;
