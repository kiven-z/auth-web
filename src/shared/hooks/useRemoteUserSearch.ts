import debounce from 'lodash/debounce';
import { onScopeDispose, ref } from 'vue';

import { searchUserByKeyword, type UserSearchOption } from '@/api/system/user-base';
import { errorMessage } from '@/shared/messaging/message';

/** 远程用户关键字请求防抖间隔（与分配面板关键词搜索一致） */
const REMOTE_USER_SEARCH_DEBOUNCE_MS = 300;

/** {@link useRemoteUserSearch} 配置 */
export interface UseRemoteUserSearchOptions {
  /** 请求失败时传给 {@link errorMessage} 的 `defaultI18nKey` */
  errorDefaultI18nKey: string;
  /** 透传后端的返回条数上限，不传则使用后端默认 */
  limit?: number;
}

/**
 * 远程按关键字搜索用户（用于 `el-select` remote 等）。
 * 关键字非空时对请求防抖，避免连续输入触发过多接口；清空关键字时立即清空选项并取消待发起请求。
 *
 * @param options 错误文案键与可选 limit
 */
export default function useRemoteUserSearch(options: UseRemoteUserSearchOptions) {
  const { errorDefaultI18nKey, limit } = options;

  const userOptions = ref<UserSearchOption[]>([]);
  const userSearchLoading = ref(false);

  /** 递增序号，用于丢弃过期请求结果（慢网先于快网返回时避免错显） */
  let searchGeneration = 0;

  /**
   * 执行一次远程搜索（防抖结束后调用）
   * @param trimmed 已 trim 的关键字
   */
  async function executeSearch(trimmed: string) {
    const generation = ++searchGeneration;
    userSearchLoading.value = true;
    try {
      const rows = await searchUserByKeyword(trimmed, limit);
      if (generation !== searchGeneration) {
        return;
      }
      userOptions.value = rows;
    } catch (error: unknown) {
      if (generation !== searchGeneration) {
        return;
      }
      errorMessage(error, { defaultI18nKey: errorDefaultI18nKey });
      userOptions.value = [];
    } finally {
      if (generation === searchGeneration) {
        userSearchLoading.value = false;
      }
    }
  }

  const debouncedExecuteSearch = debounce((trimmed: string) => {
    void executeSearch(trimmed);
  }, REMOTE_USER_SEARCH_DEBOUNCE_MS);

  onScopeDispose(() => {
    debouncedExecuteSearch.cancel();
  });

  /**
   * 供 `el-select` `remote-method` 使用：空关键字立即清空；非空则防抖后请求。
   * @param keyword 用户输入关键字
   */
  const loadUserListByKeyword = (keyword: string) => {
    const trimmed = keyword?.trim() ?? '';
    if (!trimmed) {
      debouncedExecuteSearch.cancel();
      searchGeneration += 1;
      userOptions.value = [];
      userSearchLoading.value = false;
      return;
    }
    debouncedExecuteSearch(trimmed);
  };

  return { userOptions, userSearchLoading, loadUserListByKeyword };
}
