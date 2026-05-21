import type { CreateJobGroupRequest } from '@/api/schedule/job-group';

/**
 * 任务分组弹窗表单默认值（新增场景）
 */
export function createEmptyJobGroupForm(): CreateJobGroupRequest {
  return {
    groupCode: '',
    groupName: '',
    description: '',
    status: true,
    orderNum: 0,
  };
}
