import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import { getFileRecycleDetail, purgeFileRecycle, restoreFileRecycle } from '@/api/file/file-recycle';
import useFileRecycleTableActionCore from '@/views/file/_shared/hooks/useFileRecycleTableActionCore';

type FileRecycleTableActionDeps = TableActionWithSelectionDeps;

/**
 * 文件回收站表格操作（详情、恢复与彻底删除）。
 * @param deps 表格操作依赖
 * @returns 详情、恢复与彻底删除相关方法
 */
function useFileRecycleTableAction(deps: FileRecycleTableActionDeps) {
  return useFileRecycleTableActionCore({
    ...deps,
    restoreApi: restoreFileRecycle,
    purgeApi: purgeFileRecycle,
    detailApi: getFileRecycleDetail,
  });
}

export default useFileRecycleTableAction;
