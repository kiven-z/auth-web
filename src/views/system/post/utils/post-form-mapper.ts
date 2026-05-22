import type { SysPostCreateForm } from '@/api/system/post';

/**
 * 岗位弹窗表单默认值（新增场景）
 * FIXME 这个可以省略
 */
export function createEmptyPostForm(): SysPostCreateForm {
  return {
    deptId: '',
    postCode: '',
    postName: '',
    status: true,
    orderNum: 0,
    remark: '',
  };
}
