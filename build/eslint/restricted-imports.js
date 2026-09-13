import { DOMAIN_API_AT_ROOT_PATTERN, VIEWS_FORBIDDEN_PATTERN } from './patterns.js';

/**
 * @param {Array<{ group: string[], message: string }>} [patterns]
 * @returns {[string, { patterns: object[] }]}
 */
export function restrictedImports(patterns = []) {
  return [
    'error',
    {
      patterns: [VIEWS_FORBIDDEN_PATTERN, DOMAIN_API_AT_ROOT_PATTERN, ...patterns],
    },
  ];
}
