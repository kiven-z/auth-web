import type { TableActionWithSelectionDeps } from '@/shared/types/table-action';
import {
  deletePersonalFileRecord,
  downloadPersonalFileRecord,
  getPersonalFileRecordDetail,
} from '@/api/file/file-me-record';
import useFileRecordTableActionCore from '@/views/file/_shared/hooks/useFileRecordTableActionCore';

type PersonalFileRecordTableActionDeps = TableActionWithSelectionDeps;

/**
 * 个人文件记录表格操作（详情、删除与下载）。
 * @param dependencies 表格操作依赖
 * @returns 表格动作方法与下载状态
 */
function usePersonalFileRecordTableAction(dependencies: PersonalFileRecordTableActionDeps) {
  return useFileRecordTableActionCore({
    ...dependencies,
    deleteApi: deletePersonalFileRecord,
    downloadApi: downloadPersonalFileRecord,
    detailApi: getPersonalFileRecordDetail,
  });
}

export default usePersonalFileRecordTableAction;
