import { i18n } from '@/plugins/i18n';
import { ElMessageBox } from 'element-plus';

/** 单层确认文案（标题、正文与按钮文案均可选） */
export interface ConfirmLayer {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

function t(key: string): string {
  return i18n.global.t(key);
}

function defaultDeleteLayers(): ConfirmLayer[] {
  return [
    {
      title: t('common.tips.deleteConfirm'),
      message: t('common.tips.deleteConfirm'),
    },
    {
      title: t('common.tips.lastTimeConfirmDeleteTitle'),
      message: t('common.tips.lastTimeConfirmDeleteTitle'),
    },
  ];
}

/**
 * 顺序弹出多层 ElMessageBox.confirm；用户中途取消则返回 false。
 * 未传 layers 时使用默认「两次删除确认」文案。
 */
export async function multiConfirm(
  layers?: ConfirmLayer[],
  onConfirmed?: () => void | Promise<void>
): Promise<boolean> {
  const steps = layers?.length ? layers : defaultDeleteLayers();
  try {
    for (const layer of steps) {
      await ElMessageBox.confirm(layer.message ?? '', layer.title ?? '', {
        confirmButtonText: layer.confirmButtonText ?? t('buttons.pureConfirm'),
        cancelButtonText: layer.cancelButtonText ?? t('buttons.pureClose'),
        type: 'warning',
        draggable: true,
        showClose: false,
      });
    }
    if (onConfirmed) {
      await onConfirmed();
    }
    return true;
  } catch {
    return false;
  }
}

/** 标准两次删除确认 */
export async function deleteConfirm(): Promise<boolean> {
  return multiConfirm();
}

/** 非删除类危险操作的两次确认（文案与历史 operationConfirm 一致） */
export async function operationConfirm(): Promise<boolean> {
  return multiConfirm([
    {
      title: t('common.tips.confirmTitle'),
      message: t('common.tips.confirmTitle'),
    },
    {
      title: t('common.tips.confirmTitle'),
      message: t('common.tips.lastTimeConfirmTitle'),
    },
  ]);
}
