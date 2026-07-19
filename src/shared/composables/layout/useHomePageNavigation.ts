import { useRoute, useRouter } from 'vue-router';

/**
 * 个人中心 / 收件箱等首页级页面的来源返回导航。
 * @returns 打开与返回导航方法
 */
export function useHomePageNavigation() {
  const router = useRouter();
  const route = useRoute();

  /**
   * 打开目标路由，并将当前页记为返回来源（以 routeName 为 history.state 键）。
   * @param routeName 路由 name
   */
  function openWithReturn(routeName: string) {
    void router.push({
      name: routeName,
      state: { [routeName]: route.fullPath },
    });
  }

  /**
   * 返回打开页时记录的来源；无有效记录时回首页。
   * @param routeName 打开时使用的路由 name
   */
  function backWithReturn(routeName: string) {
    const from = history.state?.[routeName];
    if (typeof from === 'string' && from.startsWith('/')) {
      void router.push(from);
      return;
    }
    void router.push('/');
  }

  return {
    openWithReturn,
    backWithReturn,
  };
}
