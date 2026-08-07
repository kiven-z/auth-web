import './index.css';
import type { OptionsType } from './type';
import { useRenderIcon } from '@/components/ui/Icon';
import { useDark } from '@/shared/composables/theme/useDark';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import { useResizeObserver } from '@vueuse/core';
import { defineComponent, getCurrentInstance, h, nextTick, type PropType, ref, toRef, watch } from 'vue';

const props = {
  options: {
    type: Array<OptionsType>,
    default: () => [],
  },
  /** 默认选中，按照第一个索引为 `0` 的模式（`modelValue`只有传`number`类型时才为响应式） */
  modelValue: {
    type: undefined,
    require: false,
    default: '0',
  },
  /** 将宽度调整为父元素宽度	 */
  block: {
    type: Boolean,
    default: false,
  },
  /** 控件尺寸 */
  size: {
    type: String as PropType<'small' | 'default' | 'large'>,
  },
  /** 是否全局禁用，默认 `false` */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 当内容发生变化时，设置 `resize` 可使其自适应容器位置 */
  resize: {
    type: Boolean,
    default: false,
  },
};

function resolveHoverBackground(isDark: boolean, optionDisabled: boolean | undefined, isCurrent: boolean) {
  if (optionDisabled || isCurrent) {
    return '';
  }
  return isDark ? '#1f1f1f' : 'rgba(0, 0, 0, 0.06)';
}

function resolveItemColor(
  disabled: boolean,
  optionDisabled: boolean | undefined,
  highlighted: boolean,
  isDark: boolean
) {
  if (disabled) {
    return null;
  }
  if (optionDisabled || !highlighted) {
    return '';
  }
  return isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0,0,0,.88)';
}

function renderOptionLabel(option: OptionsType) {
  if (!option.label) {
    return null;
  }
  return isFunction(option.label) ? h(option.label) : <span>{option.label}</span>;
}

function renderOptionIcon(option: OptionsType) {
  if (!option.icon || isFunction(option.label)) {
    return null;
  }
  return (
    <span class="auth-segmented-item-icon" style={{ marginRight: option.label ? '6px' : 0 }}>
      {h(
        useRenderIcon(option.icon, {
          ...option?.iconAttrs,
        })
      )}
    </span>
  );
}

export default defineComponent({
  name: 'ReSegmented',
  props,
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const width = ref(0);
    const translateX = ref(0);
    const { isDark } = useDark();
    const initStatus = ref(false);
    const curMouseActive = ref(-1);
    const segmentedItembg = ref('');
    const segmentedRootRef = ref<HTMLDivElement>();
    const instance = getCurrentInstance()!;
    const curIndex = isNumber(props.modelValue) ? toRef(props, 'modelValue') : ref(0);

    function handleChange({ option, index }, event: Event) {
      if (props.disabled || option.disabled) return;
      event.preventDefault();
      isNumber(props.modelValue) ? emit('update:modelValue', index) : (curIndex.value = index);
      segmentedItembg.value = '';
      emit('change', { index, option });
    }

    function handleMouseenter({ option, index }, event: Event) {
      if (props.disabled) return;
      event.preventDefault();
      curMouseActive.value = index;
      segmentedItembg.value = resolveHoverBackground(isDark.value, option.disabled, curIndex.value === index);
    }

    function handleMouseleave(_, event: Event) {
      if (props.disabled) return;
      event.preventDefault();
      curMouseActive.value = -1;
    }

    function handleInit(index = curIndex.value) {
      nextTick(() => {
        const curLabelRef = instance?.proxy?.$refs[`labelRef${index}`] as ElRef;
        if (!curLabelRef) return;
        width.value = curLabelRef.clientWidth;
        translateX.value = curLabelRef.offsetLeft;
        initStatus.value = true;
      });
    }

    if (props.block || props.resize) {
      useResizeObserver(segmentedRootRef, () => {
        nextTick(() => {
          handleInit(curIndex.value);
        });
      });
    }

    watch(
      () => curIndex.value,
      (index) => {
        nextTick(() => {
          handleInit(index);
        });
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.size,
      () => {
        handleInit(curIndex.value);
      }
    );

    const rendLabel = () => {
      return props.options.map((option, index) => {
        const highlighted = curIndex.value === index || curMouseActive.value === index;
        return (
          <label
            ref={`labelRef${index}`}
            class={['auth-segmented-item', (props.disabled || option?.disabled) && 'auth-segmented-item-disabled']}
            style={{
              background: curMouseActive.value === index ? segmentedItembg.value : '',
              color: resolveItemColor(props.disabled, option.disabled, highlighted, isDark.value),
            }}
            onMouseenter={(event) => handleMouseenter({ option, index }, event)}
            onMouseleave={(event) => handleMouseleave({ option, index }, event)}
            onClick={(event) => handleChange({ option, index }, event)}
          >
            <input type="radio" name="segmented" />
            <div
              class="auth-segmented-item-label"
              v-tippy={{
                content: option?.tip,
                zIndex: 41000,
              }}
            >
              {renderOptionIcon(option)}
              {renderOptionLabel(option)}
            </div>
          </label>
        );
      });
    };

    return () => (
      <div
        ref={segmentedRootRef}
        class={{
          'auth-segmented': true,
          'auth-segmented-block': props.block,
          'auth-segmented--large': props.size === 'large',
          'auth-segmented--small': props.size === 'small',
        }}
      >
        <div class="auth-segmented-group">
          <div
            class="auth-segmented-item-selected"
            style={{
              width: `${width.value}px`,
              transform: `translateX(${translateX.value}px)`,
              display: initStatus.value ? 'block' : 'none',
            }}
          ></div>
          {rendLabel()}
        </div>
      </div>
    );
  },
});
