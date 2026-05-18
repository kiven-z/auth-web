/**
 * 格式化 token（JWT 格式，供 Authorization 头使用）。
 * @param token token
 * @returns 格式化后的 token
 */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};
