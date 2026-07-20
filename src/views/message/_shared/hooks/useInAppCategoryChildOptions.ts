import { type InAppMessageCategoryOption, listInAppMessageCategoryChildren } from '@/api/message/in-app-category';
import { errorMessage } from '@/services/feedback/message';
import { ref } from 'vue';

/**
 * 小类全量选项
 * @returns 小类选项、加载状态与加载方法
 */
function useInAppCategoryChildOptions() {
  const childOptions = ref<InAppMessageCategoryOption[]>([]);
  const loadingChildren = ref(false);

  /**
   * 按大类 code 加载全部启用小类
   * @param parentCode 大类编码
   */
  async function loadChildren(parentCode: string) {
    if (!parentCode) {
      childOptions.value = [];
      return;
    }
    loadingChildren.value = true;
    try {
      const rows = await listInAppMessageCategoryChildren(parentCode);
      childOptions.value = (rows ?? []).filter((item) => Boolean(item.id));
    } catch (error: unknown) {
      errorMessage(error);
      childOptions.value = [];
    } finally {
      loadingChildren.value = false;
    }
  }

  /** 清空小类选项 */
  function clearChildOptions() {
    childOptions.value = [];
  }

  return { childOptions, loadingChildren, loadChildren, clearChildOptions };
}

export default useInAppCategoryChildOptions;
