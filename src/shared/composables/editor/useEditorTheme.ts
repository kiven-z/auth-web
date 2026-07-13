import { useDark } from '@pureadmin/utils';
import { computed, type ComputedRef } from 'vue';

/** 编辑器主题（与应用明暗一致） */
export interface EditorTheme {
  /** md-editor-v3：`dark` | `light` */
  mdEditorTheme: ComputedRef<'dark' | 'light'>;
  /** Monaco：`vs-dark` | `vs` */
  monacoTheme: ComputedRef<'vs-dark' | 'vs'>;
}

/**
 * 统一导出 md-editor / Monaco 主题，共享同一份明暗状态
 * @returns 两类编辑器主题 computed
 */
export function useEditorTheme(): EditorTheme {
  const { isDark } = useDark();

  return {
    mdEditorTheme: computed(() => (isDark.value ? 'dark' : 'light')),
    monacoTheme: computed(() => (isDark.value ? 'vs-dark' : 'vs')),
  };
}
