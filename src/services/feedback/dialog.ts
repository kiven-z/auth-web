import { i18n } from '@/app/plugins/i18n';
import { ElMessageBox } from 'element-plus';

/** 单层确认文案 */
export interface ConfirmLayer {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const translate = (key: string): string => (i18n.global.t as (key: string) => string)(key);

function defaultDeleteLayers(): ConfirmLayer[] {
  return [
    {
      title: translate('tips.deleteConfirm'),
      message: translate('tips.deleteConfirm'),
    },
    {
      title: translate('tips.lastTimeConfirmDeleteTitle'),
      message: translate('tips.lastTimeConfirmDeleteTitle'),
    },
  ];
}

/**
 * 顺序弹出多层 ElMessageBox.confirm；用户中途取消则返回 false
 * 未传 layers 时使用默认「两次删除确认」文案
 * @param layers 确认层文案
 * @param onConfirmed 全部确认后的回调
 * @returns 是否全部确认
 */
export async function multiConfirm(
  layers?: ConfirmLayer[],
  onConfirmed?: () => void | Promise<void>
): Promise<boolean> {
  const steps = layers?.length ? layers : defaultDeleteLayers();
  try {
    for (const layer of steps) {
      await ElMessageBox.confirm(layer.message ?? '', layer.title ?? '', {
        confirmButtonText: layer.confirmButtonText ?? translate('buttons.pureConfirm'),
        cancelButtonText: layer.cancelButtonText ?? translate('buttons.pureClose'),
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

/**
 * 标准两次删除确认
 * @returns 用户是否确认删除
 */
export async function deleteConfirm(): Promise<boolean> {
  return multiConfirm();
}

/**
 * 非删除类危险操作的两次确认（文案与历史 operationConfirm 一致）
 * @returns 用户是否确认操作
 */
export async function operationConfirm(): Promise<boolean> {
  return multiConfirm([
    {
      title: translate('tips.confirmTitle'),
      message: translate('tips.confirmTitle'),
    },
    {
      title: translate('tips.confirmTitle'),
      message: translate('tips.lastTimeConfirmTitle'),
    },
  ]);
}
