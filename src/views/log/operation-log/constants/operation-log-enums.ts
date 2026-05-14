// 与后端 log_operation.operation_type 取值一致（OperationLogKind）
export const OPERATION_TYPES = ['CREATE', 'UPDATE', 'DELETE', 'QUERY', 'EXPORT'] as const;

// 操作模块（大模块:小模块 格式，此处仅枚举常见值用于筛选下拉）
export const OPERATION_MODULES = [
  'SYSTEM:USER',
  'SYSTEM:ROLE',
  'SYSTEM:DEPT',
  'SYSTEM:PROJECT',
  'SYSTEM:SECURITY_CONFIG',
  'SYSTEM:MENU',
  'SYSTEM:POST',
  'SYSTEM:JOB',
] as const;

// 操作对象类型
export const TARGET_TYPES = ['User', 'Dept', 'Role', 'Menu', 'Post'] as const;

// HTTP 方法
export const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
