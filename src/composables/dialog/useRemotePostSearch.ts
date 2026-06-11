import { searchPostByKeyword, type SysPostSearchOption } from '@/api/system/post';
import debounce from 'lodash/debounce';
import { onScopeDispose, ref } from 'vue';

import { errorMessage } from '@/ui/feedback/message';

/** 远程岗位关键字请求防抖间隔 */
const REMOTE_POST_SEARCH_DEBOUNCE_MS = 300;

/** 远程岗位搜索单次返回条数上限 */
const REMOTE_POST_SEARCH_LIMIT = 20;

/** {@link useRemotePostSearch} 配置 */
export interface UseRemotePostSearchOptions {
  /** 请求失败时传给 {@link errorMessage} 的 `defaultI18nKey` */
  errorDefaultI18nKey: string;
}

/**
 * 远程按关键字搜索启用岗位（用于 `el-select` remote）。
 * @param options 错误文案键
 * @returns 远程岗位选项、加载状态与搜索方法
 */
export default function useRemotePostSearch(options: UseRemotePostSearchOptions) {
  const { errorDefaultI18nKey } = options;

  const postOptions = ref<SysPostSearchOption[]>([]);
  const postSearchLoading = ref(false);

  let searchGeneration = 0;

  /**
   * 执行一次远程搜索
   * @param trimmed 已 trim 的关键字
   */
  async function executeSearch(trimmed: string) {
    const generation = ++searchGeneration;
    postSearchLoading.value = true;
    try {
      const rows = await searchPostByKeyword({
        postCode: trimmed,
        postName: trimmed,
        status: true,
        limit: REMOTE_POST_SEARCH_LIMIT,
      });
      if (generation !== searchGeneration) {
        return;
      }
      postOptions.value = rows;
    } catch (error: unknown) {
      if (generation !== searchGeneration) {
        return;
      }
      errorMessage(error, { defaultI18nKey: errorDefaultI18nKey });
      postOptions.value = [];
    } finally {
      if (generation === searchGeneration) {
        postSearchLoading.value = false;
      }
    }
  }

  const debouncedExecuteSearch = debounce((trimmed: string) => {
    void executeSearch(trimmed);
  }, REMOTE_POST_SEARCH_DEBOUNCE_MS);

  onScopeDispose(() => {
    debouncedExecuteSearch.cancel();
  });

  /**
   * 供 `el-select` `remote-method` 使用
   * @param keyword 用户输入关键字
   */
  const loadPostListByKeyword = (keyword: string) => {
    const trimmed = keyword?.trim() ?? '';
    if (!trimmed) {
      debouncedExecuteSearch.cancel();
      searchGeneration += 1;
      postOptions.value = [];
      postSearchLoading.value = false;
      return;
    }
    debouncedExecuteSearch(trimmed);
  };

  return { postOptions, postSearchLoading, loadPostListByKeyword };
}
