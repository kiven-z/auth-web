import { addDialog } from '@/components/ui/Dialog';
import UserProfile from '@/components/user/UserProfile/src/index.vue';
import RoleDescriptionDialog from '@/views/system/role/components/RoleDescriptionDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface RoleTableActionDeps {
  /** 与页面 `useRolePageState` 同源，编辑/删除等写操作成功后刷新列表（避免在 hook 内再次调用 pageState） */
  onSearch: () => Promise<void>;
}

/**
 * 角色表格操作
 * @param deps 须传入列表页同一实例的 {@link deps.onSearch}
 */
function useRoleTableAction(deps: RoleTableActionDeps) {
  const { t } = useI18n();

  const { onSearch } = deps;

  const onView = () => {
    const formRef = ref();

    addDialog({
      title: t('roles.dialogViewTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(RoleDescriptionDialog, { ref: formRef }),
      beforeSure: (done) => {
        done();
      },
    });
  };

  const onEdit = async () => {
    // 保存逻辑落地后：await api...; await deps.onSearch();
    // TODO
    await onSearch();
  };

  /**
   * 打开用户档案弹窗（创建人/更新人下钻）
   * @param userId 用户 ID（与后端 Long 字符串化一致）
   */
  const openUserProfile = (userId: string) => {
    if (!userId) {
      return;
    }
    addDialog({
      title: t('users.dialogUserProfileTitle'),
      width: '720px',
      draggable: true,
      fullscreenIcon: true,
      closeOnPressEscape: true,
      closeOnClickModal: false,
      contentRenderer: () => h(UserProfile, { userId }),
      beforeSure: (done) => {
        done();
      },
    });
  };

  return {
    onView,
    onEdit,
    openUserProfile,
  };
}

export default useRoleTableAction;
