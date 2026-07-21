import { transformI18n } from '@/app/plugins/i18n';
import { useEpThemeStoreHook } from '@/store/modules/app/epTheme';
import { delay } from '@pureadmin/utils';
import { computed, defineComponent, nextTick, type PropType, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import CollapseIcon from '@/components/ui/TableBar/src/images/collapse.svg?component';
import DragIcon from '@/components/ui/TableBar/src/images/drag.svg?component';
import ExpandIcon from '@/components/ui/TableBar/src/images/expand.svg?component';
import RefreshIcon from '@/components/ui/TableBar/src/images/refresh.svg?component';
import SettingIcon from '@/components/ui/TableBar/src/images/settings.svg?component';
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';

import './index.scss';
import type { TableTreeControlRef } from './types';
import { useTableBarColumns } from './useTableBarColumns';

const props = {
  /** 无 title 插槽时显示的标题；为空则使用 i18n `tableBar.defaultTitle` */
  title: {
    type: String,
    default: '',
  },
  /** 树形表格展开/折叠时传入表格实例 */
  tableRef: {
    type: Object as PropType<TableTreeControlRef | undefined>,
    default: undefined,
  },
  columns: {
    type: Array as PropType<TableColumnList>,
    default: () => [],
  },
  isExpandAll: {
    type: Boolean,
    default: true,
  },
  /** 外部控制的刷新 loading；传入时不再使用内部 500ms 假 loading */
  refreshLoading: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
};

export default defineComponent({
  name: 'TableBar',
  props,
  emits: ['refresh', 'fullscreen'],
  setup(props, { emit, slots, attrs }) {
    const { t } = useI18n();
    const loading = ref(false);
    const isFullscreen = ref(false);
    const isExpandAll = ref(props.isExpandAll);
    const columnGroupRef = ref<{ $el: HTMLElement } | null>(null);

    const columnsRef = toRef(props, 'columns');
    const {
      size,
      checkAll,
      isIndeterminate,
      checkColumnList,
      checkedColumns,
      dynamicColumns,
      handleCheckAllChange,
      handleCheckedColumnsChange,
      handleCheckColumnListChange,
      resetColumns,
      initSortable,
      destroySortable,
      isFixedColumn,
    } = useTableBarColumns(columnsRef);

    const getDropdownItemStyle = computed(() => {
      return (densitySize: 'large' | 'default' | 'small') => {
        return {
          background: densitySize === size.value ? useEpThemeStoreHook().epThemeColor : '',
          color: densitySize === size.value ? '#fff' : 'var(--el-text-color-primary)',
        };
      };
    });

    const iconClass = computed(() => {
      return [
        'text-black',
        'dark:text-white',
        'duration-100',
        'hover:text-primary!',
        'cursor-pointer',
        'outline-hidden',
      ];
    });

    function tippyOptions(i18nKey: string) {
      return {
        content: () => t(i18nKey),
        offset: [0, 18] as [number, number],
        duration: [300, 0] as [number, number],
        followCursor: true,
        hideOnClick: 'toggle' as const,
      };
    }

    function onReFresh() {
      if (props.refreshLoading === undefined) {
        loading.value = true;
        emit('refresh');
        delay(500).then(() => {
          loading.value = false;
        });
        return;
      }
      emit('refresh');
    }

    const refreshSpinning = computed(() => props.refreshLoading ?? loading.value);

    function toggleRowExpansionAll(data: unknown[] | undefined, isExpansion: boolean) {
      const table = props.tableRef;
      if (!data || !table?.toggleRowExpansion) {
        return;
      }
      data.forEach((item) => {
        table.toggleRowExpansion!(item, isExpansion);
        const row = item as { children?: unknown[] };
        if (row.children !== undefined && row.children !== null) {
          toggleRowExpansionAll(row.children as unknown[], isExpansion);
        }
      });
    }

    function onExpand() {
      isExpandAll.value = !isExpandAll.value;
      toggleRowExpansionAll(props.tableRef?.data as unknown[] | undefined, isExpandAll.value);
    }

    function onFullscreen() {
      isFullscreen.value = !isFullscreen.value;
      emit('fullscreen', isFullscreen.value);
    }

    async function onColumnPopoverShow() {
      await nextTick(() => {
        initSortable(columnGroupRef.value?.$el);
      });
    }

    const dropdown = {
      dropdown: () => (
        <el-dropdown-menu class="translation">
          <el-dropdown-item
            style={getDropdownItemStyle.value('large')}
            onClick={() => {
              size.value = 'large';
            }}
          >
            {t('tableBar.densityLarge')}
          </el-dropdown-item>
          <el-dropdown-item
            style={getDropdownItemStyle.value('default')}
            onClick={() => {
              size.value = 'default';
            }}
          >
            {t('tableBar.densityDefault')}
          </el-dropdown-item>
          <el-dropdown-item
            style={getDropdownItemStyle.value('small')}
            onClick={() => {
              size.value = 'small';
            }}
          >
            {t('tableBar.densitySmall')}
          </el-dropdown-item>
        </el-dropdown-menu>
      ),
    };

    const reference = {
      reference: () => (
        <SettingIcon class={['w-4', iconClass.value]} v-tippy={tippyOptions('tableBar.tippyColumnSettings')} />
      ),
    };

    return () => (
      <>
        <div {...attrs} class={['table-bar', 'bg-bg_color', isFullscreen.value ? 'table-bar--fullscreen' : '']}>
          <div class="table-bar__toolbar">
            {slots?.title ? (
              slots.title()
            ) : (
              <p class="m-0 truncate text-base font-bold">{props.title || t('tableBar.defaultTitle')}</p>
            )}
            <div class="table-bar__actions">
              {slots?.buttons ? <div class="mr-4 flex">{slots.buttons()}</div> : null}
              {props.tableRef?.size ? (
                <>
                  <ExpandIcon
                    class={['w-4', iconClass.value]}
                    style={{
                      transform: isExpandAll.value ? 'none' : 'rotate(-90deg)',
                    }}
                    v-tippy={tippyOptions(isExpandAll.value ? 'tableBar.tippyCollapse' : 'tableBar.tippyExpand')}
                    onClick={() => onExpand()}
                  />
                  <el-divider direction="vertical" />
                </>
              ) : null}
              <RefreshIcon
                class={['w-4', iconClass.value, refreshSpinning.value ? 'animate-spin' : '']}
                v-tippy={tippyOptions('tableBar.refresh')}
                onClick={() => onReFresh()}
              />
              <el-divider direction="vertical" />
              <el-dropdown v-slots={dropdown} trigger="click" v-tippy={tippyOptions('tableBar.tippyDensity')}>
                <CollapseIcon class={['w-4', iconClass.value]} />
              </el-dropdown>
              <el-divider direction="vertical" />

              <el-popover
                v-slots={reference}
                placement="bottom-start"
                popper-style={{ padding: 0 }}
                width="200"
                trigger="click"
                onShow={onColumnPopoverShow}
                onHide={() => destroySortable()}
              >
                <div class="table-bar__popover-head">
                  <el-checkbox
                    class="-mr-1!"
                    label={t('tableBar.columnShowAll')}
                    v-model={checkAll.value}
                    indeterminate={isIndeterminate.value}
                    onChange={(value: boolean | string | number) => handleCheckAllChange(!!value)}
                  />
                  <el-button type="primary" link onClick={() => resetColumns()}>
                    {t('tableBar.reset')}
                  </el-button>
                </div>

                <div class="table-bar__column-body">
                  <el-scrollbar max-height="36vh">
                    <el-checkbox-group
                      ref={columnGroupRef}
                      modelValue={checkedColumns.value}
                      onUpdate:modelValue={(value: (string | number)[]) =>
                        handleCheckedColumnsChange(value as string[])
                      }
                    >
                      <el-space direction="vertical" alignment="flex-start" size={0}>
                        {checkColumnList.value.map((item, index) => {
                          return (
                            <div class="flex items-center" key={item}>
                              <DragIcon
                                class={['drag-btn mr-2 w-4', isFixedColumn(item) ? 'cursor-no-drop!' : 'cursor-grab!']}
                              />
                              <el-checkbox
                                key={index}
                                label={item}
                                value={item}
                                onChange={(value: boolean | string | number) =>
                                  handleCheckColumnListChange(!!value, item)
                                }
                              >
                                <span
                                  title={transformI18n(item)}
                                  class="inline-block w-30 truncate hover:text-text_color_primary"
                                >
                                  {transformI18n(item)}
                                </span>
                              </el-checkbox>
                            </div>
                          );
                        })}
                      </el-space>
                    </el-checkbox-group>
                  </el-scrollbar>
                </div>
              </el-popover>
              <el-divider direction="vertical" />

              <iconifyIconOffline
                class={['w-4', iconClass.value]}
                icon={isFullscreen.value ? ExitFullscreen : Fullscreen}
                v-tippy={tippyOptions(isFullscreen.value ? 'tableBar.tippyExitFullscreen' : 'tableBar.tippyFullscreen')}
                onClick={() => onFullscreen()}
              />
            </div>
          </div>
          {slots.default?.({
            size: size.value,
            dynamicColumns: dynamicColumns.value,
          })}
        </div>
      </>
    );
  },
});
