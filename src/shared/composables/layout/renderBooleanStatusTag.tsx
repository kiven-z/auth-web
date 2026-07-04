import { transformI18n } from '@/app/plugins/i18n';
import { ElTag } from 'element-plus';

/**
 * 通用启用/停用布尔状态标签（`buttons.statusActiveText` / `statusInactiveText`）
 * @param status 是否启用
 * @returns 状态 ElTag 节点
 */
export function renderBooleanStatusTag(status: boolean) {
  return status ? (
    <ElTag type="success" effect="plain">
      {transformI18n('buttons.statusActiveText')}
    </ElTag>
  ) : (
    <ElTag type="danger" effect="plain">
      {transformI18n('buttons.statusInactiveText')}
    </ElTag>
  );
}
