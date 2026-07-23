import Avatar from '@/assets/user.png';
import { useUserStore } from '@/store/modules/auth/user';
import { isAllEmpty } from '@pureadmin/utils';
import { computed } from 'vue';

/**
 * 顶栏用户展示（头像 / 显示名 / 退出）
 * @returns 展示字段与 logout
 */
export function useSessionUserDisplay() {
  const userStore = useUserStore();

  const userAvatar = computed(() => (isAllEmpty(userStore.avatar) ? Avatar : userStore.avatar));

  const username = computed(() => (isAllEmpty(userStore.nickname) ? userStore.username : userStore.nickname));

  const avatarsStyle = computed(() => (username.value ? { marginRight: '10px' } : ''));

  /**
   * 退出登录并清理本地会话
   */
  function logout(): void {
    void userStore.logoutAndClear();
  }

  return {
    userAvatar,
    username,
    avatarsStyle,
    logout,
  };
}
