import type { TableActionDeps } from '@/api/common';
import { putDeptRoles, type SysDeptListVO } from '@/api/system/dept';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/ui/feedback/message';
import DeptAssignRoleDrawer from '@/views/system/dept/components/DeptAssignRoleDrawer.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 部门「更多」操作依赖 */
export interface DeptMoreActionDeps extends TableActionDeps {
  refresh: () => Promise<void>;
}

interface AssignPanelExpose {
  getSelectedKeys: () => string[];
}

/**
 * 部门「更多」操作（分配角色）
 * @param deps 操作依赖
 * @returns 更多操作方法
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

  return {
    openAssignRoleDrawer,
  };
}

export default useDeptMoreAction;
