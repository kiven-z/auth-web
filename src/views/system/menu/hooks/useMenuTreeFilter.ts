import type { SysMenuTreeNode } from '@/api/system/menu';
import { transformI18n } from '@/plugins/i18n';

/**
 * 树形视图客户端筛选：匹配展示标题、路由名称与 i18n key。
 */
export function useMenuTreeFilter() {
  /**
   * 判断菜单节点是否命中关键词
   * @param keyword 搜索词
   * @param data 树节点数据
   */
  function filterMenuNode(keyword: string, data: SysMenuTreeNode): boolean {
    const trimmed = keyword.trim();
    if (!trimmed) {
      return true;
    }

    const lowerKeyword = trimmed.toLocaleLowerCase();
    const displayTitle = transformI18n(data.title).toLocaleLowerCase();

    if (displayTitle.includes(lowerKeyword)) {
      return true;
    }
    if (data.name?.toLocaleLowerCase().includes(lowerKeyword)) {
      return true;
    }

    return data.title?.toLocaleLowerCase().includes(lowerKeyword);
  }

  return { filterMenuNode };
}
