import type { Emitter } from 'mitt';
import mitt from 'mitt';

/**
 * 全局公共事件需要在此处添加类型
 */
interface Events {
  openPanel: string;
  tagOnClick: string;
  logoChange: boolean;
  tagViewsChange: string;
  changLayoutRoute: string;
  tagViewsShowModel: string;
  [key: string]: unknown;
  [key: symbol]: unknown;
}

export const emitter: Emitter<Events> = mitt<Events>();
