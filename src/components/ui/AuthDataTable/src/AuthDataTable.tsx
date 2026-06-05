import { ElConfigProvider, ElPagination, ElTable, ElTableColumn } from 'element-plus';
import type { PropType } from 'vue';
import { computed, defineComponent, mergeProps, ref } from 'vue';

import { columnVisible, renderCellContent } from './columnHelpers';
import {
  DEFAULT_ADAPTIVE_DEBOUNCE_MS,
  DEFAULT_OFFSET_BOTTOM,
  DEFAULT_PAGE_SIZES,
  DEFAULT_PAGINATION_LAYOUT,
  DEFAULT_PAGINATION_RESERVE_PX,
} from './constants';
import './index.scss';
import type { AuthDataTableAdaptiveConfig, AuthDataTablePagination } from './types';
import { useAdaptiveTableHeight } from './useAdaptiveTableHeight';

export type { AuthDataTablePagination } from './types';

export default defineComponent({
  name: 'AuthDataTable',
  props: {
    /** 列配置 */
    columns: { type: Array as PropType<TableColumnList>, default: () => [] },
    /** 表格数据 */
    data: { type: Array as PropType<any[]>, default: () => [] },
    /** 加载状态 */
    loading: { type: Boolean, default: false },
    /** 分页配置 */
    pagination: { type: Object as PropType<AuthDataTablePagination | null>, default: null },
    /** 表格尺寸 */
    size: { type: String as PropType<'' | 'default' | 'small' | 'large'>, default: 'default' },
    /** 是否自适应高度 */
    adaptive: { type: Boolean, default: false },
    /** 自适应高度配置 */
    adaptiveConfig: {
      type: Object as PropType<AuthDataTableAdaptiveConfig>,
      default: () => ({
        offsetBottom: DEFAULT_OFFSET_BOTTOM,
        fixHeader: true,
        timeout: DEFAULT_ADAPTIVE_DEBOUNCE_MS,
        zIndex: 3,
        paginationReserve: DEFAULT_PAGINATION_RESERVE_PX,
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
    const tableWrapperRef = ref<HTMLElement | null>(null);
    const innerTableRef = ref<InstanceType<typeof ElTable> | null>(null);

    const showPagination = computed(() => {
      const p = props.pagination;
      return !!(p && p.currentPage != null && p.pageSize != null);
    });

    const paginationInnerStyle = computed(() => props.pagination?.style ?? {});

    const visibleColumns = computed(() => props.columns.filter(columnVisible));

    const { setAdaptive } = useAdaptiveTableHeight(
      tableWrapperRef,
      () => ({
        adaptive: props.adaptive,
        adaptiveConfig: props.adaptiveConfig,
        columns: props.columns,
        pagination: props.pagination,
        rowHoverBgColor: props.rowHoverBgColor,
      }),
      showPagination
    );

    /**
     * 处理每页条数变化
     */
    function handleSizeChange(size: number) {
      if (props.pagination) {
        (props.pagination as AuthDataTablePagination).pageSize = size;
      }
      emit('page-size-change', size);
    }

    /**
     * 处理当前页变化
     */
    function handleCurrentChange(page: number) {
      if (props.pagination) {
        (props.pagination as AuthDataTablePagination).currentPage = page;
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

      // 渲染单元格插槽
      const cellSlots = {
        default: (scope: { row: any; column: any; $index: number }) =>
          renderCellContent(column, scope, slots, { ...props, ...attrs }),
      };

      const { formatter, cellRenderer, slot, children, hide, type, index: _indexCol, ...rest } = column as any;

      // 渲染组列
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
      return ['auth-data-table__pagination-wrap', `auth-data-table__pagination-wrap--${suffix}`];
    }

    return () => {
      const p = props.pagination;

      /**
       * 渲染表格组件
       */
      const tableVNode = (
        <div ref={tableWrapperRef} class="auth-data-table__table-wrap">
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
              ...(props.adaptive ? { height: '100%' } : {}),
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

      /**
       * 渲染分页组件
       */
      const paginationVNode =
        showPagination.value && p ? (
          <div class={paginationWrapClass(p.align)} key="pagination">
            <ElPagination
              class="auth-data-table-pagination"
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

      /**
       * 渲染根组件
       */
      const rootClass = ['auth-data-table', { 'auth-data-table--adaptive': props.adaptive }];

      return (
        <div class={rootClass} v-loading={props.loading}>
          <ElConfigProvider>
            <div class="auth-data-table-inner">
              {tableVNode}
              {paginationVNode}
            </div>
          </ElConfigProvider>
        </div>
      );
    };
  },
});
