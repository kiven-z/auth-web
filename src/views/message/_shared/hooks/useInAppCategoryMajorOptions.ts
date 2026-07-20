import { type InAppMessageCategoryOption, listInAppMessageCategoryMajors } from '@/api/message/in-app-category';
import { errorMessage } from '@/services/feedback/message';
import { ref } from 'vue';

/**
 * 大类选项
 * @param statusScope 启停范围
 * @returns 大类选项、加载状态与加载方法
 */
function useInAppCategoryMajorOptions(statusScope = 'ALL') {
  const majorOptions = ref<InAppMessageCategoryOption[]>([]);
  const loadingMajors = ref(false);

  /** 加载大类选项 */
  async function loadMajors() {
    loadingMajors.value = true;
    try {
      const rows = await listInAppMessageCategoryMajors(statusScope);
      majorOptions.value = (rows ?? []).filter((item) => Boolean(item.id));
    } catch (error: unknown) {
      errorMessage(error);
      majorOptions.value = [];
    } finally {
      loadingMajors.value = false;
    }
  }

  return { majorOptions, loadingMajors, loadMajors };
}

export default useInAppCategoryMajorOptions;
