declare module 'vue' {
  export interface GlobalComponents {
    AuthDataTable: (typeof import('@/components/ui/AuthDataTable'))['default'];
    AuthPagedTable: (typeof import('@/components/ui/AuthPagedTable'))['default'];
    TableBar: (typeof import('@/components/ui/TableBar'))['default'];
  }
}
export {};
