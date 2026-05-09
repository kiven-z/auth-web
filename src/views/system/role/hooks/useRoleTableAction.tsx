import { addDialog } from '@/components/ui/Dialog';
import RoleDescriptionDialog from '@/views/system/role/components/RoleDescriptionDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableActionDeps } from '@/api/common';

/**
 * 角色表格操作
 */
function useRoleTableAction(deps: TableActionDeps) {
  const { t } = useI18n();

  const { fetchTableData } = deps;

  /**
   * 查看角色描述
   */
  const openDetailDialog = () => {
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
  const openEditDialog = async () => {
    // 保存逻辑落地后：await api...; await deps.onSearch();
    await fetchTableData();
  };

  return {
    openDetailDialog,
    openEditDialog,
  };
}

export default useRoleTableAction;
