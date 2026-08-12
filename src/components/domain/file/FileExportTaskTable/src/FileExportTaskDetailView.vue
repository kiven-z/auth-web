<script lang="ts" setup>
import type { FileExportTaskAdminDetail, FileExportTaskDetail } from '@/features/file/api/models/file-export-task';
import { type ColumnProps, Description } from '@/components/ui/Description';
import { errorMessage } from '@/services/feedback/message';
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { FILE_EXPORT_TASK_IN_PROGRESS_STATUS, FILE_EXPORT_TASK_POLL_INTERVAL_MS } from './constants';

defineOptions({
  name: 'FileExportTaskDetailView',
});

const props = defineProps<{
  /** 任务主键 */
  taskId: string;
  /** 打开弹窗时的详情快照 */
  initialDetail: FileExportTaskDetail | FileExportTaskAdminDetail;
  /** 详情查询 API */
  detailApi: (id: string) => Promise<FileExportTaskDetail | FileExportTaskAdminDetail>;
  /** 描述列 */
  columns: ColumnProps[];
}>();

const { t } = useI18n();
const detail = ref(props.initialDetail);
const refreshing = ref(false);
const visibility = useDocumentVisibility();
let inFlight = false;

const inProgress = computed(() => FILE_EXPORT_TASK_IN_PROGRESS_STATUS.has(detail.value.status ?? ''));

const shouldPoll = computed(() => inProgress.value && visibility.value === 'visible');

/**
 * 重新拉取详情
 * @param showLoading 是否展示刷新按钮 loading
 */
async function refresh(showLoading = true): Promise<void> {
  if (inFlight) {
    return;
  }
  inFlight = true;
  if (showLoading) {
    refreshing.value = true;
  }
  try {
    detail.value = await props.detailApi(props.taskId);
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    inFlight = false;
    refreshing.value = false;
  }
}

const { pause, resume } = useIntervalFn(
  () => {
    void refresh(false);
  },
  FILE_EXPORT_TASK_POLL_INTERVAL_MS,
  { immediate: false }
);

watch(
  shouldPoll,
  (active) => {
    if (active) {
      resume();
    } else {
      pause();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="file-export-task-detail-view">
    <div class="mb-3 flex justify-end">
      <el-button :loading="refreshing" link type="primary" @click="refresh(true)">
        {{ t('listTable.refresh') }}
      </el-button>
    </div>

    <Description :column="2" :columns="columns" :data="detail" />
  </div>
</template>
