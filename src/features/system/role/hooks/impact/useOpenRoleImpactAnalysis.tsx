import { addDrawer } from '@/components/ui/Drawer';
import RoleImpactAnalysisDrawer from '@/features/system/role/components/impact/RoleImpactAnalysisDrawer.vue';
import { useI18n } from 'vue-i18n';

/** 打开角色影响分析抽屉入参 */
export interface OpenRoleImpactAnalysisOptions {
  roleId: string;
  roleCode: string;
  roleName: string;
}

/**
 * 打开角色影响分析抽屉（摘要 / 影响用户分页 / 刷新画像）
 * @returns 打开方法
 */
function useOpenRoleImpactAnalysis() {
  const { t } = useI18n();

  /**
   * 打开指定角色的影响分析
   * @param options 角色标识与展示名
   */
  function openRoleImpactAnalysis(options: OpenRoleImpactAnalysisOptions) {
    addDrawer({
      title: `${t('roles.impact.title')} · ${options.roleName} (${options.roleCode})`,
      size: '80%',
      resizable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => <RoleImpactAnalysisDrawer roleId={options.roleId} />,
    });
  }

  return { openRoleImpactAnalysis };
}

export default useOpenRoleImpactAnalysis;
