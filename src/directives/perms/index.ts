import { hasAuth } from '@/shared/permission';
import type { Directive, DirectiveBinding } from 'vue';

export const perms: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | Array<string>>) {
    const { value } = binding;
    if (value) {
      !hasAuth(value) && el.parentNode?.removeChild(el);
    } else {
      throw new Error("[Directive: perms]: need perms! Like v-perms=\"['btn.add','btn.edit']\"");
    }
  },
};
