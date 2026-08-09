/**
 * 文件导出任务运维权限码
 */
export const FILE_EXPORT_TASK_PERMS = {
  QUERY: 'sys:file:exporttask:query',
  CANCEL: 'sys:file:exporttask:cancel',
  RETRY: 'sys:file:exporttask:retry',
} as const;
