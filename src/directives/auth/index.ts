import { hasAuth } from '@/shared/permission';
import type { Directive, DirectiveBinding } from 'vue';

/**
 * 权限指令
 * @param el 元素
 * @param binding 绑定
 */
export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | Array<string>>) {
    const { value } = binding;
    if (value) {
      !hasAuth(value) && el.parentNode?.removeChild(el);
    } else {
      throw new Error("[Directive: auth]: need auths! Like v-auth=\"['btn.add','btn.edit']\"");
    }
  },
};
