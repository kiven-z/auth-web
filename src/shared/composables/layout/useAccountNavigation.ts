import { useRoute, useRouter } from 'vue-router';

/** 记录打开账户页来源页面的 history.state 键名。 */
const ACCOUNT_FROM_STATE_KEY = 'accountFrom';

/**
 * 账户页导航辅助方法，绑定当前组件上下文。
 * @returns 打开与返回导航方法
 */
export function useAccountNavigation() {
  const router = useRouter();
  const route = useRoute();

  /** 打开账户资料页，并将当前页记录为返回目标。 */
  function openAccount() {
    void router.push({
      name: 'AccountProfile',
      state: { [ACCOUNT_FROM_STATE_KEY]: route.fullPath },
    });
  }

  /** 返回打开账户页的来源页；无有效记录时回到首页。 */
  function backFromAccount() {
    const from = history.state?.[ACCOUNT_FROM_STATE_KEY];
    if (typeof from === 'string' && from.startsWith('/')) {
      void router.push(from);
      return;
    }
    void router.push('/');
  }

  return {
    openAccount,
    backFromAccount,
  };
}
