/** 从统计 KPI 跳转到列表页的载荷 */
export type AuthorizationInvalidationStatsNavigatePayload =
  | { target: 'outbox'; status?: string }
  | { target: 'event'; processing?: boolean };
