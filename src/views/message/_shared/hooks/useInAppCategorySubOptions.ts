import { type InAppMessageCategoryOption, listInAppMessageCategoryChildren } from '@/api/message/in-app-category';
import { errorMessage } from '@/services/feedback/message';
import { ref } from 'vue';

/**
 * 小类选项
 * @param status 启停状态；不传则不限
 * @returns 小类选项、加载状态与加载方法
 */
function useInAppCategorySubOptions(status?: boolean) {
  const subOptions = ref<InAppMessageCategoryOption[]>([]);
  const loadingSubs = ref(false);

  /**
   * 按大类 id 加载小类
   * @param majorId 大类主键
   */
  async function loadSubs(majorId: string) {
    if (!majorId) {
      subOptions.value = [];
      return;
    }
    loadingSubs.value = true;
    try {
      const rows = await listInAppMessageCategoryChildren(majorId, status);
      subOptions.value = (rows ?? []).filter((item) => Boolean(item.id));
    } catch (error: unknown) {
      errorMessage(error);
      subOptions.value = [];
    } finally {
      loadingSubs.value = false;
    }
  }

  return { subOptions, loadingSubs, loadSubs };
}

export default useInAppCategorySubOptions;
