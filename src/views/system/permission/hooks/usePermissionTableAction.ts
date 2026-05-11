import type { TableActionDeps } from '@/api/common';

interface PermissionTableActionDeps extends TableActionDeps {}

/**
 * 权限表格操作：查看详情、删除（分页查询已就绪，更多 CRUD 后续补充）
 * @param deps 须传入列表页同一实例的
 */
function usePermissionTableAction(deps: PermissionTableActionDeps) {
  const { fetchTableData } = deps;

  return {};
}

export default usePermissionTableAction;
