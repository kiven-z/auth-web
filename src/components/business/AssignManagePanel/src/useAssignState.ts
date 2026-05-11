import type { AuthDataTablePagination } from '@/components/ui/AuthDataTable';
import { useDebounceFn } from '@vueuse/core';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { AuthAssignFetchAll, AuthAssignFetchPage, AuthAssignMode, AuthAssignSeedItem } from './types';

/**
 * 获取行标识 key
 */
function getKey(row: Record<string, unknown>, rowKey: string): string {
  return String(row?.[rowKey] ?? '');
}

/**
 * 获取行默认展示文案
 * @param row 行数据
 * @param rowKey 行标识 key
 * @param getRowLabel 自定义获取行展示文案的函数
 * @returns 行默认展示文案
 */
function defaultLabel(
  row: Record<string, unknown>,
  rowKey: string,
  getRowLabel?: (row: Record<string, unknown>) => string
): string {
  if (getRowLabel) {
    return getRowLabel(row);
  }
  return String(row?.roleName ?? row?.permissionName ?? row?.name ?? row[rowKey] ?? '');
}

/**
 * 使用分配状态管理器
 * @param params 配置参数
 * @returns 分配状态管理器
 */
export function useAssignState(params: {
  mode: AuthAssignMode;
  rowKey: string;
  fetchPage?: AuthAssignFetchPage;
  fetchAllRows?: AuthAssignFetchAll;
  seed?: AuthAssignSeedItem[];
  getRowLabel?: (row: Record<string, unknown>) => string;
  initialPageSize?: number;
}) {
  const keyword = ref('');
  const internalLoading = ref(false);
  const tableData = ref<Record<string, unknown>[]>([]);

  const pagination = reactive<AuthDataTablePagination>({
    total: 0,
    pageSize: params.initialPageSize ?? 30,
    currentPage: 1,
  });

  // 已选 key 列表
  const selectedKeys = ref<string[]>([]);
  // key → label 映射
  const keyLabels = ref<Record<string, string>>({});
  // 不可移除的 key 集合
  const nonRemovableKeys = ref<Set<string>>(new Set());

  /**
   * 应用种子数据
   * @returns 应用种子数据后，更新不可移除的 key 集合、已选 key 列表、key → label 映射
   */
  function applySeed() {
    const nr = new Set<string>();
    const seed = params.seed;
    if (!seed?.length) {
      nonRemovableKeys.value = nr;
      selectedKeys.value = [];
      return;
    }
    selectedKeys.value = seed.map((s) => s.key);
    const nextLabels = { ...keyLabels.value };
    for (const s of seed) {
      nextLabels[s.key] = s.label;
      if (s.removable === false) {
        nr.add(s.key);
      }
    }
    keyLabels.value = nextLabels;
    nonRemovableKeys.value = nr;
  }

  watch(
    () => params.seed,
    () => applySeed(),
    { deep: true, immediate: true }
  );

  /**
   * 判断行是否已选
   * @param row 行数据
   * @returns 行是否已选
   */
  function isRowSelected(row: Record<string, unknown>): boolean {
    return selectedKeys.value.includes(getKey(row, params.rowKey));
  }

  /**
   * 记录行标签
   * @param row 行数据
   * @returns 记录行标签
   */
  function rememberRowLabel(row: Record<string, unknown>) {
    const k = getKey(row, params.rowKey);
    if (!k) return;
    const label = defaultLabel(row, params.rowKey, params.getRowLabel);
    if (!keyLabels.value[k]) {
      keyLabels.value = { ...keyLabels.value, [k]: label };
    }
  }

  /**
   * 切换行勾选
   * @param row 行数据
   * @returns 切换行勾选后，更新已选 key 列表、行标签
   */
  function toggleRow(row: Record<string, unknown>) {
    const key = getKey(row, params.rowKey);
    if (!key || nonRemovableKeys.value.has(key)) return;
    rememberRowLabel(row);
    const idx = selectedKeys.value.indexOf(key);
    if (idx >= 0) {
      selectedKeys.value = selectedKeys.value.filter((k) => k !== key);
    } else {
      selectedKeys.value = [...selectedKeys.value, key];
    }
  }

  /**
   * 已选标签列表
   * @returns 已选标签列表
   */
  const assignedTags = computed(() =>
    selectedKeys.value.map((k) => ({
      key: k,
      label: keyLabels.value[k] ?? k,
      closable: !nonRemovableKeys.value.has(k),
    }))
  );

  /**
   * 关闭标签
   * @param key 标签 key
   * @returns 关闭标签后，更新已选 key 列表
   */
  function onTagClose(key: string) {
    if (nonRemovableKeys.value.has(key)) return;
    selectedKeys.value = selectedKeys.value.filter((k) => k !== key);
  }

  // ── 分页模式 ──

  /**
   * 加载分页数据
   * @returns 加载分页数据后，更新表格数据、分页信息、行标签
   */
  async function loadPage() {
    if (params.mode !== 'page' || !params.fetchPage) return;
    internalLoading.value = true;
    try {
      const page: any = await params.fetchPage({
        pageIndex: pagination.currentPage,
        pageSize: pagination.pageSize,
        keyword: keyword.value.trim(),
      });
      const list = (page.list ?? []) as Record<string, unknown>[];
      tableData.value = list;
      pagination.total = page.total;
      pagination.currentPage = page.pageNo ?? page.pageIndex ?? pagination.currentPage;
      pagination.pageSize = page.pageSize;
      for (const row of list) {
        rememberRowLabel(row);
      }
    } finally {
      internalLoading.value = false;
    }
  }

  /**
   * 防抖加载分页数据
   * @returns 防抖加载分页数据后，更新分页信息
   */
  const debouncedReloadPage = useDebounceFn(() => {
    pagination.currentPage = 1;
    void loadPage();
  }, 300);

  /**
   * 监听关键词变化
   * @returns 监听关键词变化后，防抖加载分页数据
   */
  watch(keyword, async () => {
    if (params.mode === 'page') {
      await debouncedReloadPage();
    }
  });

  /**
   * 处理分页大小变化
   * @param size 分页大小
   * @returns 处理分页大小变化后，更新分页信息
   */
  function handlePageSizeChange(size: number) {
    pagination.pageSize = size;
    pagination.currentPage = 1;
    void loadPage();
  }

  /**
   * 处理分页当前页变化
   * @param page 分页当前页
   * @returns 处理分页当前页变化后，更新分页信息
   */
  function handlePageCurrentChange(page: number) {
    pagination.currentPage = page;
    void loadPage();
  }

  // ── 全量模式 ──

  /**
   * 过滤全量数据
   * @returns 过滤全量数据后，返回过滤后的数据
   */
  const filteredAllRows = computed(() => {
    if (params.mode !== 'all') return tableData.value;
    const k = keyword.value.trim().toLowerCase();
    if (!k) return tableData.value;
    return tableData.value.filter((row) => {
      const key = getKey(row, params.rowKey).toLowerCase();
      const label = defaultLabel(row, params.rowKey, params.getRowLabel).toLowerCase();
      return key.includes(k) || label.includes(k);
    });
  });

  /**
   * 加载全量数据
   * @returns 加载全量数据后，更新表格数据、行标签、已选 key 列表
   */
  async function loadAll() {
    if (params.mode !== 'all' || !params.fetchAllRows) return;
    internalLoading.value = true;
    try {
      const rows = (await params.fetchAllRows()) as Record<string, unknown>[];
      tableData.value = rows ?? [];
      for (const row of tableData.value) {
        rememberRowLabel(row);
      }
      const fromApi = tableData.value.filter((r) => r.assigned === true).map((r) => getKey(r, params.rowKey));
      selectedKeys.value = [...fromApi];
    } finally {
      internalLoading.value = false;
    }
  }

  onMounted(() => {
    if (params.mode === 'page') {
      void loadPage();
    } else {
      void loadAll();
    }
  });

  const tableRows = computed(() => (params.mode === 'page' ? tableData.value : filteredAllRows.value));

  /**
   * 获取当前已选 key 列表
   * @returns 当前已选 key 列表
   */
  function getSelectedKeys(): string[] {
    return [...selectedKeys.value];
  }

  return {
    keyword,
    internalLoading,
    tableRows,
    pagination,
    selectedKeys,
    keyLabels,
    nonRemovableKeys,
    assignedTags,
    isRowSelected,
    rememberRowLabel,
    toggleRow,
    onTagClose,
    handlePageSizeChange,
    handlePageCurrentChange,
    getSelectedKeys,
  };
}
