import { DEFAULT_ERROR_FALLBACK_I18N_KEY, errorMessage, message } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表单弹层子组件通过 defineExpose 暴露的结构（与 FormDialog 配合使用）
 */
export interface FormOverlayExpose<TForm> {
  formRef?: FormInstance;
  form: TForm;
}

/** {@link useFormOverlaySubmit.createFormBeforeSure} 配置 */
export interface CreateFormBeforeSureOptions<TForm> {
  /** 指向表单弹层组件实例的 ref */
  formExposeRef: Ref<FormOverlayExpose<TForm> | null>;
  /**
   * 提交失败且无法从异常解析文案时的 i18n 兜底键
   */
  errorI18nKey?: string;
  /**
   * 校验通过后执行业务提交；返回 false 时不关闭弹层
   * @param formData 当前表单数据
   */
  onSubmit: (formData: TForm) => Promise<boolean | void>;
  /** 提交成功后的提示文案 i18n key；不传则不自动 message */
  successI18nKey?: string;
  /** 编辑场景要求 formData 含 id */
  requireId?: boolean;
}

/**
 * 封装 addDialog / addDrawer 的 beforeSure：校验 → 取表单 → 提交 → 成功提示 → done()
 * @returns `createFormBeforeSure` 工厂方法
 */
export function useFormOverlaySubmit() {
  const { t } = useI18n();

  /**
   * 生成 beforeSure 回调
   */
  function createFormBeforeSure<TForm>(options: CreateFormBeforeSureOptions<TForm>) {
    return async (done: (cancel?: boolean) => void) => {
      try {
        // 获取表单实例
        const formInstance = options.formExposeRef.value?.formRef;
        // 校验表单
        const isValid = await formInstance?.validate().catch(() => false);
        // 如果校验不通过，则返回
        if (!isValid) {
          return;
        }

        // 获取表单数据
        const formPayload = options.formExposeRef.value?.form;
        if (!formPayload) {
          return;
        }

        // 如果编辑场景要求 formData 含 id，但 formData 不含 id，则返回
        if (options.requireId && !(formPayload as { id?: string }).id) {
          return;
        }

        // 提交表单
        const submitResult = await options.onSubmit(formPayload);
        if (submitResult === false) {
          return;
        }

        // 如果提交成功，则提示
        if (options.successI18nKey) {
          message(t(options.successI18nKey), { type: 'success' });
        }

        // 关闭弹层
        done();
      } catch (error: unknown) {
        errorMessage(error, {
          defaultI18nKey: options.errorI18nKey ?? DEFAULT_ERROR_FALLBACK_I18N_KEY,
        });
      }
    };
  }

  return { createFormBeforeSure };
}
