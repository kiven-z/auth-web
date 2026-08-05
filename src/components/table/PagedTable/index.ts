import { withInstall } from '@/shared/vue/withInstall';

import pagedTable from './src/PagedTable.vue';

export type { PagedTableExpose, PagedTableProps, PaginationTableState } from './src/types';
export { usePaginationState } from './src/hooks/usePaginationState';
export type { UsePaginationStateOptions } from './src/hooks/usePaginationState';

/** 分页列表壳：TableBar + DataTable + usePaginationState 模板 wiring */
export const PagedTable = withInstall(pagedTable);

export default PagedTable;
