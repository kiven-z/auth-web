import UserProfileWidget from './src/index.vue';
import { withInstall } from '@pureadmin/utils';
import { addDialog } from '@/components/ui/Dialog';

/**
 * 查看用户信息
 * 可点击用户名（有 userId 且提供 opener 时渲染为链接按钮）
 * @param userId 用户Id
 * @param username 用户名
 */
export const selectUserinfo = async (userId: string, username?: string | null) => {
  addDialog({
    title: username ?? userId ?? '',
    draggable: false,
    contentRenderer: (): JSX.Element => <UserProfile userId={userId} />,
  });
};

export { default as UserAvatar } from './components/UserAvatar.vue';

export const UserProfile = withInstall(UserProfileWidget);
export default UserProfile;
