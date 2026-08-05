declare module 'vue' {
  export interface GlobalComponents {
    DataTable: (typeof import('@/components/table/DataTable'))['default'];
    PagedTable: (typeof import('@/components/table/PagedTable'))['default'];
    TableBar: (typeof import('@/components/table/TableBar'))['default'];
  }
}
export {};
