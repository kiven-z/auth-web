import type { App } from 'vue';

import AuthDataTable from './src/AuthDataTable';

export type { AuthDataTablePagination } from './src/types';
export {
  DEFAULT_ADAPTIVE_DEBOUNCE_MS,
  DEFAULT_ADAPTIVE_MIN_HEIGHT_PX,
  DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
  DEFAULT_ADAPTIVE_PAGINATION_RESERVE_PX,
  DEFAULT_PAGE_SIZES,
  DEFAULT_PAGINATION_LAYOUT,
  MIN_ADAPTIVE_TABLE_HEIGHT_PX,
} from './src/constants';
export { useAdaptiveFillHeight } from './src/useAdaptiveFillHeight';
export type { AdaptiveFillHeightOptions } from './src/useAdaptiveFillHeight';

/**
 * 全局注册 `AuthDataTable`、`auth-data-table`。
 */
export function installAuthDataTable(app: App) {
  app.component('AuthDataTable', AuthDataTable);
  app.component('auth-data-table', AuthDataTable);
}

export default AuthDataTable;
