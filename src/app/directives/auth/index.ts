import { hasAuth } from '@/auth/permission';
import type { Directive, DirectiveBinding } from 'vue';

/**
 * 按钮权限指令：无权限时移除元素。
 */
export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | Array<string>>) {
    const { value } = binding;
    if (value) {
      !hasAuth(value) && el.parentNode?.removeChild(el);
    } else {
      throw new Error('[Directive: auth]: need auth code! Like v-auth="sys:user:create"');
    }
  },
};
