/**
 * 判断两个数组彼此是否存在相同值（供角色交集判断使用）
 * @param first 第一个数组
 * @param second 第二个数组
 * @returns 是否存在相同值
 */
function isOneOfArray(first: Array<string>, second: Array<string>): boolean {
  return Array.isArray(first) && Array.isArray(second) ? first.some((value) => second.includes(value)) : true;
}

export { hasAuth } from './hasAuth';
export { isOneOfArray };
export { default as Perms } from './PermsGuard';
