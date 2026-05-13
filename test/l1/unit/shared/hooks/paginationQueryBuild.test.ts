import { describe, expect, it } from 'vitest';

import { applyPaginationFromPageResponse, buildPaginationQuery } from '@/shared/hooks/paginationQueryBuild';

describe('buildPaginationQuery', () => {
  it('merges search form with pageIndex/pageSize and strips empty filters', () => {
    const q = buildPaginationQuery({ a: 1, b: undefined, c: '', d: [], e: 'x' }, 2, 20);
    expect(q).toEqual({ a: 1, e: 'x', pageIndex: 2, pageSize: 20 });
  });
});

describe('applyPaginationFromPageResponse', () => {
  it('writes total and guards invalid pageNo/pageSize', () => {
    const pagination = { total: 0, pageSize: 10, currentPage: 3 };
    applyPaginationFromPageResponse(pagination, { total: 100, pageNo: 0, pageSize: 0 });
    expect(pagination.total).toBe(100);
    expect(pagination.currentPage).toBe(3);
    expect(pagination.pageSize).toBe(10);
  });

  it('applies valid pageNo and pageSize from response', () => {
    const pagination = { total: 0, pageSize: 10, currentPage: 1 };
    applyPaginationFromPageResponse(pagination, { total: 50, pageNo: 2, pageSize: 15 });
    expect(pagination.total).toBe(50);
    expect(pagination.currentPage).toBe(2);
    expect(pagination.pageSize).toBe(15);
  });
});
