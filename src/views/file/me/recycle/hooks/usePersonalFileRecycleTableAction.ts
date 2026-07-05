import type { TableActionWithSelectionDeps } from '@/api/common';
import { purgePersonalFileRecycle, restorePersonalFileRecycle } from '@/api/file/file-me-recycle';
import useFileRecycleTableActionCore from '@/views/file/_shared/hooks/useFileRecycleTableActionCore';

type PersonalFileRecycleTableActionDeps = TableActionWithSelectionDeps;

/**
 * 个人文件回收站表格操作（详情、恢复与彻底删除）。
 * @param dependencies 表格操作依赖
 * @returns 详情、恢复与彻底删除相关方法
 */
function usePersonalFileRecycleTableAction(dependencies: PersonalFileRecycleTableActionDeps) {
  return useFileRecycleTableActionCore({
    ...dependencies,
    restoreApi: restorePersonalFileRecycle,
    purgeApi: purgePersonalFileRecycle,
  });
}

export default usePersonalFileRecycleTableAction;
