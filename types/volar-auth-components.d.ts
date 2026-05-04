declare module 'vue' {
  export interface GlobalComponents {
    AuthDataTable: (typeof import('@/components/ui/AuthDataTable'))['default'];
    TableBar: (typeof import('@/components/ui/TableBar/src/bar'))['default'];
  }
}
export {};
