/** 用户性别码 */
export const USER_GENDER = {
  unknown: 0,
  male: 1,
  female: 2,
} as const;

/** 用户性别表单项 */
export const USER_GENDER_OPTIONS = [
  { value: USER_GENDER.unknown, labelKey: 'users.genderLabel.unknown' },
  { value: USER_GENDER.male, labelKey: 'users.genderLabel.male' },
  { value: USER_GENDER.female, labelKey: 'users.genderLabel.female' },
] as const;
