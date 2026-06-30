import { applyConfigureSideEffects, patchConfigure } from '@/core/preferences';

/** configure 字段与 emitter 事件映射 */
type ConfigurePatch = Partial<ResponsiveStorage['configure']>;

/**
 * UI 个性化配置写入（经 preferences storage 网关）及关联副作用
 * @returns patchConfigureField
 */
export function useUiConfigure() {
  /**
   * 合并写入 configure 并触发对应 UI 副作用
   * @param patch 待合并字段
   * @param options emitEvents 是否广播 mitt 事件，默认 true
   */
  function patchConfigureField(patch: ConfigurePatch, options?: { emitEvents?: boolean }): void {
    patchConfigure(patch);

    if (options?.emitEvents ?? true) {
      applyConfigureSideEffects(patch);
    }
  }

  return {
    patchConfigureField,
  };
}
