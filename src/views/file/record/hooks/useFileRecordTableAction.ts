import type { TableActionWithSelectionDeps } from '@/api/common';
import { deleteFileRecord, downloadFileRecord, getFileRecordDetail } from '@/api/file/file-record';
import useFileRecordTableActionCore from '@/views/file/_shared/hooks/useFileRecordTableActionCore';

type FileRecordTableActionDeps = TableActionWithSelectionDeps;

/**
 * 文件记录表格操作（详情与删除）。
 * @param deps 表格操作依赖
 * @returns 详情与删除操作
 */
function useFileRecordTableAction(deps: FileRecordTableActionDeps) {
  return useFileRecordTableActionCore({
    ...deps,
    deleteApi: deleteFileRecord,
    downloadApi: downloadFileRecord,
    detailApi: getFileRecordDetail,
  });
}

export default useFileRecordTableAction;
