import type { TableActionDeps } from '@/api/common';
import type { SysRoleCreateForm } from '@/api/system/role';
import { createRole } from '@/api/system/role';
import { addDialog } from '@/components/ui/Dialog';
import { errorMessage, message } from '@/shared/messaging/message';
import RoleDescriptionDialog from '@/views/system/role/components/RoleDescriptionDialog.vue';
import RoleFormDialog from '@/views/system/role/components/RoleFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 与弹窗子组件 defineExpose 对齐
 */
type RoleDialogFormExpose = {
  formRef?: { validate: () => Promise<boolean | undefined> };
  form: SysRoleCreateForm;
};

/**
 * 角色表格操作：弹窗与写接口
 */
function useRoleTableAction(deps: TableActionDeps) {
  const { t } = useI18n();

  const { fetchTableData } = deps;

  /**
   * 打开新增弹窗
   */
  const openCreateDialog = () => {
    const formData: SysRoleCreateForm = {
      roleCode: '',
      roleName: '',
      status: true,
      roleType: 1,
      orderNum: 0,
      remark: '',
    };
    const dlgFormRef = ref<RoleDialogFormExpose | null>(null);

    addDialog({
      title: t('roles.dialogCreateTitle'),
      props: { formInline: formData },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(RoleFormDialog, { ref: dlgFormRef, formInline: formData }),
      beforeSure: async (done) => {
        try {
          // 弹窗表单验证
          const formInst = dlgFormRef.value?.formRef;
          const valid = await formInst?.validate().catch(() => false);
          if (!valid) return;

          // 获取表单数据
          const f = dlgFormRef.value?.form;
          if (!f) return;

          // 创建角色
          await createRole(f);

          message(t('tips.addSuccess'), { type: 'success' });
          await fetchTableData();
          done();
        } catch (error: unknown) {
          errorMessage(error, { defaultI18nKey: 'roles.loadFailed' });
        }
      },
    });
  };

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
    openCreateDialog,
    openDetailDialog,
    openEditDialog,
  };
}

export default useRoleTableAction;
