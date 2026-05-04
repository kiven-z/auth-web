import type { App } from 'vue';

import AuthDataTable from './AuthDataTable';

export type { AuthDataTablePagination } from './AuthDataTable';

/**
 * 全局注册 `AuthDataTable`、`auth-data-table`。
 */
export function installAuthDataTable(app: App) {
  app.component('AuthDataTable', AuthDataTable);
  app.component('auth-data-table', AuthDataTable);
}

export default AuthDataTable;
