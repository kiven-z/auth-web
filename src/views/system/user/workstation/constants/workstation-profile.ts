import type { InjectionKey } from 'vue';

/** 工作台侧栏档案刷新（编辑资料 / 头像保存后调用） */
export const WORKSTATION_REFRESH_PROFILE_KEY: InjectionKey<() => Promise<void>> = Symbol('workstationRefreshProfile');
