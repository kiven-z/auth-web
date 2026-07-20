import { type InAppMessageCategoryOption, listInAppMessageCategoryChildren } from '@/api/message/in-app-category';
import { errorMessage } from '@/services/feedback/message';
import { ref } from 'vue';

/**
 * 小类选项（按大类 id 懒加载）
 * @param statusScope 启停范围（ENABLED / ALL）；默认 ALL；撰写页传 ENABLED
 * @returns 小类选项、加载状态与加载方法
 */
function useInAppCategorySubOptions(statusScope = 'ALL') {
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
      const rows = await listInAppMessageCategoryChildren(majorId, statusScope);
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
