import { getConfig } from '@/auth/config';
import { useAppStore } from '@/store/modules/app/app';
import { ref, type Ref } from 'vue';
import { getLayoutSnapshot } from './storage';

/** 视口响应式布局覆盖（不写入偏好 storage，不触发服务端同步） */
const runtimeLayoutOverride = ref<string | null>(null);

/**
 * 当前生效的布局模式（运行时覆盖优先于用户偏好）
 * @returns 布局模式
 */
export function getEffectiveLayoutModel(): string {
  return runtimeLayoutOverride.value ?? getLayoutSnapshot().layout ?? getConfig().Layout ?? 'vertical';
}

/**
 * 有效布局模式：运行时覆盖优先，否则用偏好中的布局
 * @param preferredLayout 用户偏好中的布局
 * @returns 当前应展示的布局模式
 */
export function resolveEffectiveLayout(preferredLayout?: string): string {
  return runtimeLayoutOverride.value ?? preferredLayout ?? getConfig().Layout ?? 'vertical';
}

/**
 * 供 Vue computed 订阅的运行时覆盖 ref
 * @returns 覆盖 ref
 */
export function getRuntimeLayoutOverrideRef(): Ref<string | null> {
  return runtimeLayoutOverride;
}

/**
 * 设置或清除运行时布局覆盖，并应用到 body / app store
 * @param layoutModel 覆盖值；传 null 清除并恢复用户偏好
 */
export function setRuntimeLayoutOverride(layoutModel: string | null): void {
  if (runtimeLayoutOverride.value === layoutModel) {
    return;
  }
  runtimeLayoutOverride.value = layoutModel;
  const effectiveLayout = getEffectiveLayoutModel();
  window.document.body.setAttribute('layout', effectiveLayout);
  useAppStore().setLayout(effectiveLayout);
}
