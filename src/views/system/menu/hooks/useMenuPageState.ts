import { handleTree } from '@/shared/lib/tree';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

/** 菜单列表行（对齐后端 SysMenuListVO） */
export interface SysMenuRow {
  id: string;
  parentId: string | null;
  name: string;
  title: string;
  menuType: number;
  status: number;
  showLink: number;
  menuRank: number;
  keepAlive: number;
  fixedTag: number;
  component?: string;
  path?: string;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
  createUsername?: string | null;
  updateUsername?: string | null;
  children?: SysMenuRow[];
}

/** mock 数据：扁平列表，供前端转树及表格展示 */
const MOCK_MENU_LIST: SysMenuRow[] = [
  {
    id: '1',
    parentId: null,
    name: 'SystemManagement',
    title: '系统管理',
    menuType: 0,
    status: 0,
    showLink: 1,
    menuRank: 10,
    keepAlive: 0,
    fixedTag: 0,
    component: '',
    path: '/system',
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-01-01 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '101',
    parentId: '1',
    name: 'SystemUser',
    title: '用户管理',
    menuType: 0,
    status: 0,
    showLink: 1,
    menuRank: 1,
    keepAlive: 1,
    fixedTag: 0,
    component: 'system/user/index',
    path: '/system/user',
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-01-01 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '102',
    parentId: '1',
    name: 'SystemRole',
    title: '角色管理',
    menuType: 0,
    status: 0,
    showLink: 1,
    menuRank: 2,
    keepAlive: 1,
    fixedTag: 0,
    component: 'system/role/index',
    path: '/system/role',
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-01-01 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '103',
    parentId: '1',
    name: 'SystemMenu',
    title: '菜单管理',
    menuType: 0,
    status: 0,
    showLink: 1,
    menuRank: 3,
    keepAlive: 0,
    fixedTag: 0,
    component: 'system/menu/index',
    path: '/system/menu',
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-01-01 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '104',
    parentId: '1',
    name: 'SystemDept',
    title: '部门管理',
    menuType: 0,
    status: 1,
    showLink: 1,
    menuRank: 4,
    keepAlive: 0,
    fixedTag: 0,
    component: 'system/dept/index',
    path: '/system/dept',
    createTime: '2025-01-02 10:00:00',
    updateTime: '2025-01-02 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '105',
    parentId: '1',
    name: 'SystemEmailTemplate',
    title: '邮件模板',
    menuType: 0,
    status: 0,
    showLink: 1,
    menuRank: 5,
    keepAlive: 0,
    fixedTag: 0,
    component: 'system/email-template/index',
    path: '/system/email-template',
    createTime: '2025-01-03 10:00:00',
    updateTime: '2025-01-03 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '2',
    parentId: null,
    name: 'LogManagement',
    title: '日志管理',
    menuType: 0,
    status: 0,
    showLink: 1,
    menuRank: 20,
    keepAlive: 0,
    fixedTag: 0,
    component: '',
    path: '/log',
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-01-01 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '201',
    parentId: '2',
    name: 'LogLogin',
    title: '登录日志',
    menuType: 0,
    status: 0,
    showLink: 1,
    menuRank: 1,
    keepAlive: 1,
    fixedTag: 0,
    component: 'log/login/index',
    path: '/log/login',
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-01-01 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '202',
    parentId: '2',
    name: 'LogOperation',
    title: '操作日志',
    menuType: 0,
    status: 0,
    showLink: 1,
    menuRank: 2,
    keepAlive: 1,
    fixedTag: 0,
    component: 'log/operation/index',
    path: '/log/operation',
    createTime: '2025-01-01 10:00:00',
    updateTime: '2025-01-01 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '3',
    parentId: null,
    name: 'ExternalDocs',
    title: '项目文档',
    menuType: 2,
    status: 0,
    showLink: 1,
    menuRank: 99,
    keepAlive: 0,
    fixedTag: 0,
    component: '',
    path: 'https://example.com/docs',
    createTime: '2025-01-05 10:00:00',
    updateTime: '2025-01-05 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
  {
    id: '4',
    parentId: null,
    name: 'EmbeddedDashboard',
    title: '监控大屏',
    menuType: 1,
    status: 0,
    showLink: 1,
    menuRank: 30,
    keepAlive: 0,
    fixedTag: 0,
    component: '',
    path: 'https://example.com/dashboard',
    createTime: '2025-01-06 10:00:00',
    updateTime: '2025-01-06 10:00:00',
    createUsername: 'admin',
    updateUsername: 'admin',
  },
];

/**
 * 菜单管理页：表格视图与树形视图的状态管理。
 *
 * 当前阶段使用 mock 数据，接口对接后替换 fetchTableData / fetchTreeData 的实现即可。
 */
function useMenuPageState() {
  /** 表格视图 —— 选中行 ID 列表 */
  const selectedRows = ref<string[]>([]);
  /** 全局加载状态 */
  const loading = ref(false);

  // ─── 表格视图状态 ───────────────────────────────────────────────────────────

  /** 表格数据（扁平列表，支持分页） */
  const tableData = ref<SysMenuRow[]>([]);

  const searchForm = reactive({
    name: undefined as string | undefined,
    title: undefined as string | undefined,
    menuType: undefined as number | undefined,
    status: undefined as number | undefined,
    component: undefined as string | undefined,
  });

  const pagination = reactive({
    total: 0,
    pageSize: 30,
    currentPage: 1,
  });

  // ─── 树形视图状态 ────────────────────────────────────────────────────────────

  /** 树形数据（嵌套，前端 handleTree 生成） */
  const treeData = ref<SysMenuRow[]>([]);

  // ─── 表格视图方法 ────────────────────────────────────────────────────────────

  /**
   * 加载表格数据（带搜索条件的分页查询）
   * TODO: 替换为实际接口 GET /api/system/menu/list（带分页参数）
   */
  const fetchTableData = async () => {
    loading.value = true;
    try {
      // mock：前端过滤模拟后端搜索
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filtered = [...MOCK_MENU_LIST];
      if (searchForm.name) {
        filtered = filtered.filter((m) => m.name.toLowerCase().includes(searchForm.name!.toLowerCase()));
      }
      if (searchForm.title) {
        filtered = filtered.filter((m) => m.title.includes(searchForm.title!));
      }
      if (searchForm.menuType !== undefined) {
        filtered = filtered.filter((m) => m.menuType === searchForm.menuType);
      }
      if (searchForm.status !== undefined) {
        filtered = filtered.filter((m) => m.status === searchForm.status);
      }
      if (searchForm.component) {
        filtered = filtered.filter((m) => (m.component ?? '').includes(searchForm.component!));
      }
      const start = (pagination.currentPage - 1) * pagination.pageSize;
      tableData.value = filtered.slice(start, start + pagination.pageSize);
      pagination.total = filtered.length;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 加载树形数据（一次性全量加载，前端 handleTree 转树）
   * TODO: 替换为实际接口 GET /api/system/menu/list（不传分页）
   */
  const fetchTreeData = async () => {
    loading.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      treeData.value = handleTree([...MOCK_MENU_LIST], 'id', 'parentId');
    } finally {
      loading.value = false;
    }
  };

  /**
   * 分页大小变化
   * @param value 新分页大小
   */
  const handlePageSizeChange = async (value: number) => {
    pagination.pageSize = value;
    pagination.currentPage = 1;
    await fetchTableData();
  };

  /**
   * 当前页变化
   * @param value 新页码
   */
  const handlePageCurrentChange = async (value: number) => {
    pagination.currentPage = value;
    await fetchTableData();
  };

  /**
   * 多选变化
   * @param value 选中行数组
   */
  const handleSelectionChange = (value: SysMenuRow[]) => {
    selectedRows.value = value.map((item) => item.id);
  };

  /**
   * 重置搜索条件并重新查询
   * @param formRef 表单实例
   */
  const resetQuery = async (formRef?: FormInstance) => {
    pagination.currentPage = 1;
    if (formRef) {
      formRef.resetFields();
    } else {
      searchForm.name = undefined;
      searchForm.title = undefined;
      searchForm.menuType = undefined;
      searchForm.status = undefined;
      searchForm.component = undefined;
    }
    await fetchTableData();
  };

  return {
    loading,
    selectedRows,
    // 表格视图
    tableData,
    searchForm,
    pagination,
    fetchTableData,
    resetQuery,
    handlePageSizeChange,
    handlePageCurrentChange,
    handleSelectionChange,
    // 树形视图
    treeData,
    fetchTreeData,
  };
}

export default useMenuPageState;
