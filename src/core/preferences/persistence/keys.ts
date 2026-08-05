/** UI 偏好配置键 */
export const UI_PREFERENCE_KEYS = {
  LOCALE: 'ui.locale',
  LAYOUT: 'ui.layout',
  CONFIGURE: 'ui.configure',
} as const;

/** UI 偏好配置键联合类型 */
export type UiPreferenceKey = (typeof UI_PREFERENCE_KEYS)[keyof typeof UI_PREFERENCE_KEYS];
