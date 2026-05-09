import { ref } from 'vue';

import { searchUserByKeyword, type UserSearchOption } from '@/api/system/user-base';
import { errorMessage } from '@/shared/messaging/message';

/** {@link useRemoteUserSearch} 配置 */
export interface UseRemoteUserSearchOptions {
  /** 请求失败时传给 {@link errorMessage} 的 `defaultI18nKey` */
  errorDefaultI18nKey: string;
  /** 透传后端的返回条数上限，不传则使用后端默认 */
  limit?: number;
}

/**
 * 远程按关键字搜索用户（用于 `el-select` remote 等）。
 * @param options 错误文案键与可选 limit
 */
export default function useRemoteUserSearch(options: UseRemoteUserSearchOptions) {
  const { errorDefaultI18nKey, limit } = options;

  const userOptions = ref<UserSearchOption[]>([]);
  const userSearchLoading = ref(false);

  const loadUserListByKeyword = async (keyword: string) => {
    if (!keyword || keyword.trim() === '') {
      userOptions.value = [];
      return;
    }
    userSearchLoading.value = true;
    try {
      userOptions.value = await searchUserByKeyword(keyword, limit);
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: errorDefaultI18nKey });
      userOptions.value = [];
    } finally {
      userSearchLoading.value = false;
    }
  };

  return { userOptions, userSearchLoading, loadUserListByKeyword };
}
