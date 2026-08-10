import { transformI18n } from '@/app/plugins/i18n';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/services/feedback/message';
import type { Ref, VNode } from 'vue';
import { ref } from 'vue';

/** 分配抽屉内容组件需 expose 的选中 key 读取 */
export interface AssignDrawerPanelExpose {
  getSelectedKeys: () => string[];
}

/** {@link openAssignDrawer} 参数 */
export interface OpenAssignDrawerOptions {
  title: string;
  /** 抽屉宽度，默认 `100%` */
  size?: string | number;
  /** 是否可拖拽调整宽度，默认 `true` */
  resizable?: boolean;
  /**
   * 渲染分配面板；`panelRef` 挂到面板根上以便读取选中 keys
   * @param panelRef 面板实例 ref
   */
  contentRenderer: (panelRef: Ref<AssignDrawerPanelExpose | null>) => VNode;
  /**
   * 确定：提交当前选中 keys
   * @param selectedKeys 选中 key 列表
   */
  onSubmit: (selectedKeys: string[]) => Promise<void>;
  /** 提交成功提示 i18n key；默认 `tips.assignSaveSuccess`；传空串则不提示 */
  successI18nKey?: string;
  /** 提交成功并关闭前的收尾（如刷新列表） */
  afterSave?: () => void | Promise<void>;
}

/**
 * 打开分配抽屉：全屏壳 + 确定提交选中 keys
 * @param options 抽屉与提交参数
 */
export function openAssignDrawer(options: OpenAssignDrawerOptions): void {
  const {
    title,
    size = '100%',
    resizable = true,
    contentRenderer,
    onSubmit,
    successI18nKey = 'tips.assignSaveSuccess',
    afterSave,
  } = options;

  const panelRef = ref<AssignDrawerPanelExpose | null>(null);

  addDrawer({
    title,
    size,
    resizable,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: true,
    contentRenderer: () => contentRenderer(panelRef),
    beforeSure: async (done) => {
      try {
        const selectedKeys = panelRef.value?.getSelectedKeys() ?? [];
        await onSubmit(selectedKeys);
        if (successI18nKey) {
          message(transformI18n(successI18nKey), { type: 'success' });
        }
        await afterSave?.();
        done();
      } catch (error: unknown) {
        errorMessage(error);
      }
    },
  });
}
