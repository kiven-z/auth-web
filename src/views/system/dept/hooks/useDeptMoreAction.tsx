import type { TableActionDeps } from '@/api/common';
import type { SysDeptListVO } from '@/api/system/dept';
import { message } from '@/shared/messaging/message';

export interface DeptMoreActionDeps extends TableActionDeps {
  refresh: () => Promise<void>;
}

/** 待开发：分配能力上线前占位提示 */
const ASSIGN_NOT_READY_MESSAGE = '部门分配角色/岗位功能开发中';

/**
 * 部门「更多」操作（分配角色/岗位；待专用接口落地后替换为抽屉）
 */
function useDeptMoreAction(_deps: DeptMoreActionDeps) {
  void _deps;

  /**
   * 分配角色（暂未开放）
   */
  const openAssignRoleDrawer = (_row: SysDeptListVO) => {
    void _row;
    message(ASSIGN_NOT_READY_MESSAGE, { type: 'warning' });
  };

  /**
   * 分配岗位（暂未开放）
   */
  const openAssignPostDrawer = (_row: SysDeptListVO) => {
    void _row;
    message(ASSIGN_NOT_READY_MESSAGE, { type: 'warning' });
  };

  return {
    openAssignRoleDrawer,
    openAssignPostDrawer,
  };
}

export default useDeptMoreAction;
