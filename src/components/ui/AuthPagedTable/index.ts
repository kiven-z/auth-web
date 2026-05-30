import { withInstall } from '@pureadmin/utils';

import authPagedTable from './src/AuthPagedTable.vue';

export type { AuthPagedTableExpose, AuthPagedTableProps, PaginationTableState } from './src/types';
export { usePaginationState } from './src/usePaginationState';
export type { UsePaginationStateOptions } from './src/usePaginationState';

/** 分页列表壳：TableBar + AuthDataTable + usePaginationState 模板 wiring */
export const AuthPagedTable = withInstall(authPagedTable);

export default AuthPagedTable;
