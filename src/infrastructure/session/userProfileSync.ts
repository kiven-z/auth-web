import { useUserStoreHook } from '@/store/modules/user';
import type { UserProfileSnapshot } from './types';

/**
 * 将用户资料同步到 Pinia Store。
 * @param profile 用户资料快照
 */
export function syncUserProfileToStore(profile: UserProfileSnapshot): void {
  const store = useUserStoreHook();
  store.SET_AVATAR(profile.avatar);
  store.SET_USERNAME(profile.username);
  store.SET_NICKNAME(profile.nickname);
  store.SET_ROLES(profile.roles);
  store.SET_PERMS(profile.permissions);
  if (profile.userId !== undefined) {
    store.SET_USER_ID(profile.userId);
  }
}
