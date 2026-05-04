import type { App } from 'vue';

import AuthDataTable from './src/AuthDataTable';

export type { AuthDataTablePagination } from './src/types';

/**
 * 全局注册 `AuthDataTable`、`auth-data-table`。
 */
export function installAuthDataTable(app: App) {
  app.component('AuthDataTable', AuthDataTable);
  app.component('auth-data-table', AuthDataTable);
}

export default AuthDataTable;
