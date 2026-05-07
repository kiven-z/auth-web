import { addDialog } from '@/components/ui/Dialog';
import RoleDescriptionDialog from '@/views/system/role/components/RoleDescriptionDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface RoleTableActionDeps {
  /**
   * 与页面 `useRolePageState` 同源
   * 编辑/删除等写操作成功后刷新列表（避免在 hook 内再次调用 pageState）
   */
  onSearch: () => Promise<void>;
}

/**
 * 角色表格操作
 * @param deps 须传入列表页同一实例的 {@link deps.onSearch}
 */
function useRoleTableAction(deps: RoleTableActionDeps) {
  const { t } = useI18n();

  const { onSearch } = deps;

  /**
   * 查看角色描述
   */
  const onView = () => {
    const formRef = ref();

    addDialog({
      title: t('roles.dialogViewTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      contentRenderer: () => h(RoleDescriptionDialog, { ref: formRef }),
      beforeSure: (done) => done(),
    });
  };

  /**
   * 编辑角色
   */
  const onEdit = async () => {
    // 保存逻辑落地后：await api...; await deps.onSearch();
    await onSearch();
  };

  return {
    onView,
    onEdit,
  };
}

export default useRoleTableAction;
