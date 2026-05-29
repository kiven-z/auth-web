import { errorMessage } from '@/shared/messaging/message';
import { onMounted, ref } from 'vue';

import type { AssignDrawerOptions, AssignSeedItem } from './types';

/**
 * 分配抽屉薄封装：挂载时加载 seed，配合 `v-if="!loading"` 再渲染表格面板。
 */
export function useAssignDrawer(options: AssignDrawerOptions) {
  const loading = ref(true);
  const seed = ref<AssignSeedItem[]>([]);

  async function reloadSeed() {
    loading.value = true;
    try {
      seed.value = await options.loadSeed();
    } catch (error: unknown) {
      errorMessage(error, { defaultI18nKey: options.errorI18nKey ?? 'sysMenu.assignLoadFailed' });
      seed.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    void reloadSeed();
  });

  return {
    loading,
    seed,
    fetchPage: options.fetchPage,
    initialPageSize: options.initialPageSize,
    reloadSeed,
  };
}
