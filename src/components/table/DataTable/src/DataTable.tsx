import { ElConfigProvider, ElPagination, ElTable, ElTableColumn } from 'element-plus';
import type { PropType } from 'vue';
import { computed, defineComponent, mergeProps, nextTick, onMounted, ref, watch } from 'vue';

import { columnVisible, renderCellContent } from './render/columnHelpers';
import {
  DEFAULT_ADAPTIVE_DEBOUNCE_MS,
  DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
  DEFAULT_ADAPTIVE_PAGINATION_RESERVE_PX,
  DEFAULT_PAGE_SIZES,
  DEFAULT_PAGINATION_LAYOUT,
  MIN_ADAPTIVE_TABLE_HEIGHT_PX,
} from './constants';
import './index.scss';
import type { DataTableAdaptiveConfig, DataTableAdaptiveMode, DataTablePagination } from './types';
import { useAdaptiveFillHeight } from '@/components/table/DataTable';
import { useFillParentHeight } from './hooks/useFillParentHeight';

export type { DataTablePagination, DataTableAdaptiveMode } from './types';

export default defineComponent({
  name: 'DataTable',
  props: {
    /** 列配置 */
    columns: { type: Array as PropType<TableColumnList>, default: () => [] },
    /** 表格数据 */
    data: { type: Array as PropType<any[]>, default: () => [] },
    /** 加载状态 */
    loading: { type: Boolean, default: false },
    /** 分页配置 */
    pagination: { type: Object as PropType<DataTablePagination | null>, default: null },
    /** 表格尺寸 */
    size: { type: String as PropType<'' | 'default' | 'small' | 'large'>, default: 'default' },
    /**
     * 高度模式：
     * - `false` 不定高
     * - `viewport` 按视口剩余高度
     * - `fill` 填满定高父级
     */
    adaptive: {
      type: [Boolean, String] as PropType<DataTableAdaptiveMode>,
      default: false,
    },
    /** 自适应高度配置（主要服务 viewport） */
    adaptiveConfig: {
      type: Object as PropType<DataTableAdaptiveConfig>,
      default: () => ({
        offsetBottom: DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
        fixHeader: true,
        timeout: DEFAULT_ADAPTIVE_DEBOUNCE_MS,
        zIndex: 3,
        paginationReserve: DEFAULT_ADAPTIVE_PAGINATION_RESERVE_PX,
      }),
    },
    /** 整体对齐方式 */
    alignWhole: { type: String, default: 'left' },
    /** 表头对齐方式 */
    headerAlign: { type: String, default: '' },
    /** 是否显示边框 */
    border: { type: Boolean, default: false },
    /** 是否高亮当前行 */
    highlightCurrentRow: { type: Boolean, default: false },
    /** 行主键 */
    rowKey: { type: [String, Function] as PropType<string | ((row: any) => string)>, default: undefined },
    /** 表格布局 */
    tableLayout: { type: String as PropType<'fixed' | 'auto'>, default: 'fixed' },
    /** 表头单元格样式 */
    headerCellStyle: { type: Object as PropType<Record<string, string>>, default: undefined },
    /** 是否显示溢出 tooltip */
    showOverflowTooltip: { type: Boolean, default: false },
    /** 行悬停背景色 */
    rowHoverBgColor: { type: String, default: '' },
  },
  emits: ['page-size-change', 'page-current-change', 'selection-change'],
  setup(props, { emit, slots, attrs, expose }) {
    const rootRef = ref<HTMLElement | null>(null);
    const tableWrapperRef = ref<HTMLElement | null>(null);
    const innerTableRef = ref<InstanceType<typeof ElTable> | null>(null);

    const isViewport = computed(() => props.adaptive === 'viewport');
    const isFill = computed(() => props.adaptive === 'fill');
    const hasAdaptiveHeight = computed(() => isViewport.value || isFill.value);

    const showPagination = computed(() => {
      const p = props.pagination;
      return !!(p && p.currentPage != null && p.pageSize != null);
    });

    const paginationInnerStyle = computed(() => props.pagination?.style ?? {});

    const visibleColumns = computed(() => props.columns.filter(columnVisible));

    const { recalculate: recalculateViewport } = useAdaptiveFillHeight(tableWrapperRef, {
      enabled: () => isViewport.value,
      offsetBottom: () => props.adaptiveConfig?.offsetBottom ?? DEFAULT_ADAPTIVE_OFFSET_BOTTOM,
      reserveBottom: () =>
        showPagination.value ? (props.adaptiveConfig?.paginationReserve ?? DEFAULT_ADAPTIVE_PAGINATION_RESERVE_PX) : 0,
      minHeight: () => props.adaptiveConfig?.minHeight ?? MIN_ADAPTIVE_TABLE_HEIGHT_PX,
      debounceMs: () => props.adaptiveConfig?.timeout ?? DEFAULT_ADAPTIVE_DEBOUNCE_MS,
    });

    const { recalculate: recalculateFill } = useFillParentHeight(tableWrapperRef, {
      enabled: () => isFill.value,
      debounceMs: () => props.adaptiveConfig?.timeout ?? DEFAULT_ADAPTIVE_DEBOUNCE_MS,
      observe: [rootRef],
    });

    /**
     * 按当前高度模式重算；全屏切换等场景调用。
     */
    async function setAdaptive() {
      if (isViewport.value) {
        await recalculateViewport();
        return;
      }
      if (isFill.value) {
        await recalculateFill();
        await nextTick();
        innerTableRef.value?.doLayout?.();
      }
    }

    watch(
      () => props.columns,
      () => {
        if (hasAdaptiveHeight.value) {
          void setAdaptive();
        }
      },
      { deep: true }
    );

    watch(
      () => props.pagination,
      () => {
        if (hasAdaptiveHeight.value) {
          void nextTick(() => {
            void setAdaptive();
          });
        }
      },
      { deep: true }
    );

    watch(
      () => props.adaptive,
      () => {
        void setAdaptive();
      }
    );

    onMounted(() => {
      if (!hasAdaptiveHeight.value || !props.rowHoverBgColor) {
        return;
      }
      void nextTick(() => {
        tableWrapperRef.value?.style.setProperty('--el-table-row-hover-bg-color', props.rowHoverBgColor, 'important');
      });
    });

    /**
     * 处理每页条数变化
     */
    function handleSizeChange(size: number) {
      if (props.pagination) {
        (props.pagination as DataTablePagination).pageSize = size;
      }
      emit('page-size-change', size);
    }

    /**
     * 处理当前页变化
     */
    function handleCurrentChange(page: number) {
      if (props.pagination) {
        (props.pagination as DataTablePagination).currentPage = page;
      }
      emit('page-current-change', page);
    }

    /**
     * 渲染列
     */
    function renderColumn(column: TableColumns, colIndex: number) {
      const alignDefault = (props.alignWhole || 'left') as 'left' | 'center' | 'right';
      const headerAlignVal = (props.headerAlign || column.headerAlign || '') as any;
      const key = (column.prop as string) ?? `col-${colIndex}`;

      if (column.type === 'selection') {
        return (
          <ElTableColumn
            key={`sel-${key}`}
            type="selection"
            align={(column.align as any) ?? alignDefault}
            width={column.width as any}
          />
        );
      }
      if (column.type === 'index') {
        return (
          <ElTableColumn
            key={`idx-${key}`}
            type="index"
            index={column.index as any}
            label={column.label}
            width={column.width as any}
            minWidth={column.minWidth as any}
            align={(column.align as any) ?? alignDefault}
          />
        );
      }

      const showTip = (column.showOverflowTooltip ?? props.showOverflowTooltip) as any;

      const cellSlots = {
        default: (scope: { row: any; column: any; $index: number }) =>
          renderCellContent(column, scope, slots, { ...props, ...attrs }),
      };

      const { formatter, cellRenderer, slot, children, hide, type, index: _indexCol, ...rest } = column as any;

      if (children && Array.isArray(children) && children.length > 0) {
        return (
          <ElTableColumn
            key={`grp-${key}`}
            label={column.label}
            align={(column.align as any) ?? alignDefault}
            headerAlign={headerAlignVal || undefined}
          >
            {(children as TableColumns[]).filter(columnVisible).map((child, childIdx) => renderColumn(child, childIdx))}
          </ElTableColumn>
        );
      }

      return (
        <ElTableColumn
          key={key}
          {...mergeProps(rest, {
            prop: column.prop as any,
            label: column.label,
            width: column.width as any,
            minWidth: column.minWidth as any,
            fixed: column.fixed as any,
            align: (column.align as any) ?? alignDefault,
            headerAlign: headerAlignVal || undefined,
            showOverflowTooltip: showTip,
          })}
          v-slots={cellSlots}
        />
      );
    }

    expose({
      setAdaptive,
      getTableRef: () => innerTableRef.value,
    });

    /**
     * 分页组件包裹类
     */
    function paginationWrapClass(align?: 'left' | 'center' | 'right') {
      const suffix = align === 'left' || align === 'center' ? align : 'right';
      return ['data-table__pagination-wrap', `data-table__pagination-wrap--${suffix}`];
    }

    return () => {
      const p = props.pagination;

      const tableVNode = (
        <div ref={tableWrapperRef} class="data-table__table-wrap">
          <ElTable
            ref={innerTableRef}
            {...mergeProps(attrs, {
              data: props.data,
              size: props.size,
              border: props.border,
              highlightCurrentRow: props.highlightCurrentRow,
              rowKey: props.rowKey as any,
              tableLayout: props.tableLayout,
              headerCellStyle: props.headerCellStyle,
              ...(hasAdaptiveHeight.value ? { height: '100%' } : {}),
            })}
            onSelection-change={(rows: any[]) => emit('selection-change', rows)}
          >
            {{
              default: () => visibleColumns.value.map((col, columnIndex) => renderColumn(col, columnIndex)),
              append: slots.append ? () => slots.append!() : undefined,
              empty: slots.empty ? () => slots.empty!() : undefined,
            }}
          </ElTable>
        </div>
      );

      const paginationVNode =
        showPagination.value && p ? (
          <div class={paginationWrapClass(p.align)} key="pagination">
            <ElPagination
              class="data-table-pagination"
              style={paginationInnerStyle.value}
              layout={p.layout ?? DEFAULT_PAGINATION_LAYOUT}
              pageSizes={p.pageSizes ?? DEFAULT_PAGE_SIZES}
              total={p.total}
              currentPage={p.currentPage}
              pageSize={p.pageSize}
              background={p.background ?? true}
              onUpdate:pageSize={handleSizeChange}
              onUpdate:currentPage={handleCurrentChange}
            />
          </div>
        ) : null;

      const rootClass = [
        'data-table',
        {
          'data-table--viewport': isViewport.value,
          'data-table--fill': isFill.value,
        },
      ];

      return (
        <div ref={rootRef} class={rootClass} v-loading={props.loading}>
          <ElConfigProvider>
            <div class="data-table-inner">
              {tableVNode}
              {paginationVNode}
            </div>
          </ElConfigProvider>
        </div>
      );
    };
  },
});
