import { type InAppMessageCategoryOption, listInAppMessageCategoryMajors } from '@/api/message/in-app-category';
import { errorMessage } from '@/services/feedback/message';
import { ref } from 'vue';

/**
 * 大类全量选项
 * @returns 大类选项、加载状态与加载方法
 */
function useInAppCategoryMajorOptions() {
  const majorOptions = ref<InAppMessageCategoryOption[]>([]);
  const loadingMajors = ref(false);

  /** 加载全部启用大类 */
  async function loadMajors() {
    loadingMajors.value = true;
    try {
      const rows = await listInAppMessageCategoryMajors();
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
