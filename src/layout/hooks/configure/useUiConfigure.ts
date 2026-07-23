import { applyConfigureSideEffects } from '@/core/preferences/apply';
import { patchConfigure } from '@/core/preferences/storage';

/** configure 局部字段补丁 */
type ConfigurePatch = Partial<ResponsiveStorage['configure']>;

/**
 * UI 个性化配置写入（经 preferences storage 网关）及关联副作用
 * @returns patchConfigureField
 */
export function useUiConfigure() {
  /**
   * 合并写入 configure；对 grey / weak / multiTagsCache 等应用 DOM 与 store 副作用
   * @param patch 待合并字段
   */
  function patchConfigureField(patch: ConfigurePatch): void {
    patchConfigure(patch);
    applyConfigureSideEffects(patch);
  }

  return {
    patchConfigureField,
  };
}
