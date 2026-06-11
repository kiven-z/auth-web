import { createUserDept, updateUserDept, type UserDeptAssignForm, type UserDeptPageRow } from '@/api/system/user-dept';
import { addDialog } from '@/components/ui/Dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/composables/table/useFormOverlaySubmit';
import UserDeptAssignFormDialog from '@/views/system/user/components/UserDeptAssignFormDialog.vue';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TableActionDeps } from '@/api/common';

/** 用户分配部门抽屉操作依赖 */
interface UserAssignDeptDrawerActionDeps extends TableActionDeps {
  /** 用户主键 */
  userId: string;
}

/**
 * 用户分配部门抽屉：分页查询、新增与编辑部门关联
 * @param deps 抽屉操作依赖
 * @returns 抽屉状态与操作方法
 */
function useUserAssignDeptDrawerAction(deps: UserAssignDeptDrawerActionDeps) {
  const { userId, fetchTableData } = deps;
  const { t } = useI18n();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 打开编辑部门关联弹窗
   * @param row 表格行
   */
  const openEditDialog = (row: UserDeptPageRow) => {
    const dialogFormRef = ref<FormOverlayExpose<UserDeptAssignForm> | null>(null);

    addDialog({
      title: t('users.deptAssignEditTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () =>
        h(UserDeptAssignFormDialog, {
          ref: dialogFormRef,
          form: {
            deptId: row.deptId,
            status: row.status,
            isPrimary: row.isPrimary,
            remark: row.remark ?? undefined,
          },
        }),
      beforeSure: createFormBeforeSure<UserDeptAssignForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'users.deptAssignSaveFailed',
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formPayload) => {
          await updateUserDept(userId, row.id, formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  /**
   * 打开新增部门关联弹窗
   */
  const openCreateDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<UserDeptAssignForm> | null>(null);

    addDialog({
      title: t('users.deptAssignCreateTitle'),
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(UserDeptAssignFormDialog, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<UserDeptAssignForm>({
        formExposeRef: dialogFormRef,
        errorI18nKey: 'users.deptAssignSaveFailed',
        successI18nKey: 'tips.addSuccess',
        onSubmit: async (formPayload) => {
          await createUserDept(userId, formPayload);
          await fetchTableData();
        },
      }),
    });
  };

  return {
    openCreateDialog,
    openEditDialog,
  };
}

export default useUserAssignDeptDrawerAction;
