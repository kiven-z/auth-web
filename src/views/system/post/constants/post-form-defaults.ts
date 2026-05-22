import type { SysPostCreateForm } from '@/api/system/post';

/** 岗位表单默认值（新增场景） */
export const EMPTY_POST_FORM: SysPostCreateForm = {
  deptId: '',
  postCode: '',
  postName: '',
  status: true,
  orderNum: 0,
  remark: '',
};
