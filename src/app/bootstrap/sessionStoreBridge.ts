import { registerSessionLogout } from '@/auth/config/auth/auth-session-effects';
import { registerUserProfileSync } from '@/core/session/userProfileSync';
import { useUserStore } from '@/store/modules/auth/user';

/**
 * 将 infrastructure 层会话能力桥接到 Pinia（用户资料同步、登出）。
 * 须在 {@link setupStore} 之后、首次 {@link setToken} 之前调用。
 */
export function wireSessionStoreBridge(): void {
  registerUserProfileSync((profile) => {
    const userStore = useUserStore();
    userStore.SET_AVATAR(profile.avatar);
    userStore.SET_USERNAME(profile.username);
    userStore.SET_NICKNAME(profile.nickname);
    userStore.SET_PRIMARY_DEPT(profile.primaryDeptId, profile.primaryDeptName);
    userStore.SET_ROLES(profile.roles);
    userStore.SET_PERMS(profile.permissions);
    userStore.SET_USER_ID(profile.userId);
  });

  registerSessionLogout(() => useUserStore().logOut());
}
