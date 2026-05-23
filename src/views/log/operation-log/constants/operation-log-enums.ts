// 与 log_operation.operation_type 取值一致（OperationLogKind）
export const OPERATION_TYPES = ['CREATE', 'UPDATE', 'DELETE', 'QUERY', 'EXPORT'] as const;

// HTTP 方法
export const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
