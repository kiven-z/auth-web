import type { UserPostPageRow } from '@/api/system/user-post';
import type { TableActionDeps } from '@/api/common';
import type { Ref } from 'vue';

/** 用户分配岗位抽屉操作依赖 */
interface UserAssignPostDrawerActionDeps extends TableActionDeps {
  /** 用户主键 */
  userId: string;
  /** 表格多选主键 */
  selectedRows: Ref<string[]>;
}

/**
 * 用户分配岗位抽屉：分页查询与后续增删改操作占位
 * @param deps 抽屉操作依赖
 * @returns 抽屉操作方法
 */
function useUserAssignPostDrawerAction(_deps: UserAssignPostDrawerActionDeps) {
  /**
   * 打开新增岗位关联弹窗（下一步实现）
   */
  const openCreateDialog = () => {
    // 下一步：岗位多选分配弹窗
  };

  /**
   * 打开编辑岗位关联弹窗（下一步实现）
   * @param _row 表格行
   */
  const openEditDialog = (_row: UserPostPageRow) => {
    // 下一步：编辑关联状态/主岗位/备注
  };

  /**
   * 批量删除岗位关联（下一步实现）
   * @param _ids 关联主键列表
   */
  const deleteBatchRows = (_ids?: string[]) => {
    // 下一步：批量删除
  };

  /**
   * 清空当前用户全部岗位关联（下一步实现）
   */
  const clearAllPosts = () => {
    // 下一步：全部清空
  };

  return {
    openCreateDialog,
    openEditDialog,
    deleteBatchRows,
    clearAllPosts,
  };
}

export default useUserAssignPostDrawerAction;
