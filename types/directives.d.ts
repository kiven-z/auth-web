import type { Directive } from 'vue';
import type { CopyEl, OptimizeOptions, RippleOptions } from '@/app/directives';

/** 全局自定义指令类型（供 Volar / vue-tsc 识别 v-* 模板指令） */
type AuthDirective = Directive<HTMLElement, string | Array<string>>;

declare module 'vue' {
  interface GlobalDirectives {
    /** 按钮权限指令（根据登录接口返回的 `permissions` 字段进行判断） */
    vPerms: AuthDirective;
    /** 文本复制指令（默认双击复制） */
    vCopy: Directive<CopyEl, string>;
    /** 长按指令 */
    vLongpress: Directive<HTMLElement, Function>;
    /** 防抖、节流指令 */
    vOptimize: Directive<HTMLElement, OptimizeOptions>;
    /**
     * `v-ripple` 指令，用法如下：
     * 1. `v-ripple` 代表启用基本的 `ripple` 功能
     * 2. `v-ripple="{ class: 'text-red' }"` 代表自定义 `ripple` 颜色
     * 3. `v-ripple.center` 代表从中心扩散
     */
    vRipple: Directive<HTMLElement, RippleOptions>;
  }
}

export {};
