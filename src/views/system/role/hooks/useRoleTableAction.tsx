import { addDialog } from '@/components/ui/Dialog';
import RoleDescriptionDialog from '@/views/system/role/components/RoleDescriptionDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 角色表格操作
 */
function useRoleTableAction() {
  const { t } = useI18n();

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

  const onEdit = () => {};

  return {
    onView,
    onEdit,
  };
}

export default useRoleTableAction;
