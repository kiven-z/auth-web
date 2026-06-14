import { getOnlineSessionPage, type OnlineSessionPageRow } from '@/api/auth/online-session';
import { usePaginationState } from '@/components/business/AuthPagedTable';
import { reactive } from 'vue';

/**
 * 在线用户页分页状态：列表行以 sessionId 作为表格 row-key / 多选 id
 * @returns 分页状态与拉取方法
 */
function useOnlineSessionPageState() {
  const searchForm = reactive({
    username: undefined as string | undefined,
    ipAddress: undefined as string | undefined,
  });

  const tableState = usePaginationState<OnlineSessionPageRow & { id: string }>({
    searchForm,
    errorI18nKey: 'onlineUser.message.loadFailed',
    defaultPageSize: 30,
    fetchApi: async (params) => {
      const page = await getOnlineSessionPage(params);
      const list = (page.list ?? []).map((row) => ({
        ...row,
        id: row.sessionId,
      }));
      return { ...page, list };
    },
  });

  return { tableState, searchForm };
}

export default useOnlineSessionPageState;
