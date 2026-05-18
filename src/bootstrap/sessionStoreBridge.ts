import { registerUserProfileSync } from '@/infrastructure/session/userProfileSync';
import { store } from '@/store';
import { useUserStore } from '@/store/modules/user';

/**
 * 将 infrastructure 层会话用户资料同步桥接到 Pinia User Store。
 * 须在 {@link setupStore} 之后、首次 {@link setToken} 之前调用。
 */
export function wireSessionUserProfileSync(): void {
  registerUserProfileSync((profile) => {
    const userStore = useUserStore(store);
    userStore.SET_AVATAR(profile.avatar);
    userStore.SET_USERNAME(profile.username);
    userStore.SET_NICKNAME(profile.nickname);
    userStore.SET_ROLES(profile.roles);
    userStore.SET_PERMS(profile.permissions);
    if (profile.userId !== undefined) {
      userStore.SET_USER_ID(profile.userId);
    }
  });
}
