import type { SysUserProfileResponse } from '@/api/system/user/user-base';
import type { InjectionKey, Ref } from 'vue';

/** 工作台共享档案上下文（侧栏 + 编辑资料共用，避免重复请求） */
export interface WorkstationProfileContext {
  /** 用户档案 */
  profile: Ref<SysUserProfileResponse | null>;
  /** 档案加载中 */
  loading: Ref<boolean>;
  /** 档案加载失败 */
  loadFailed: Ref<boolean>;
  /** 合并更新本地档案（保存 / 头像后同步侧栏，不额外请求） */
  patchProfile: (patch: Partial<SysUserProfileResponse>) => void;
}

/** 工作台档案 provide / inject 键 */
export const WORKSTATION_PROFILE_KEY: InjectionKey<WorkstationProfileContext> = Symbol('workstationProfile');
