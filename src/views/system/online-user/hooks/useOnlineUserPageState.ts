import { getOnlineUserPage, type OnlineUserPageRow } from '@/api/auth/online-user';
import { usePaginationState } from '@/components/business/AuthPagedTable';
import { reactive } from 'vue';

/**
 * 在线用户页分页状态：列表行以 userId 作为表格 row-key
 * @returns 分页状态与拉取方法
 */
function useOnlineUserPageState() {
  const searchForm = reactive({
    userId: undefined as string,
  });

  const tableState = usePaginationState<OnlineUserPageRow & { id: string }>({
    searchForm,
    errorI18nKey: 'onlineUser.message.loadFailed',
    defaultPageSize: 30,
    fetchApi: async (params) => {
      const page = await getOnlineUserPage(params);
      const list = (page.list ?? []).map((row) => ({
        ...row,
        id: row.userId ?? '',
      }));
      return { ...page, list };
    },
  });

  return { tableState, searchForm };
}

export default useOnlineUserPageState;
