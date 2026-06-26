import { useDark } from '@pureadmin/utils';
import { computed } from 'vue';

/**
 * Monaco 内置主题与整体明暗一一对应
 */
export function useMonacoTheme() {
  const { isDark } = useDark();
  return computed(() => (isDark.value ? 'vs-dark' : 'vs'));
}
