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
    columns: { type: Array as PropType<TableColumnList>, default: () => [] },
    data: { type: Array as PropType<any[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<AuthDataTablePagination | null>, default: null },
    size: { type: String as PropType<'' | 'default' | 'small' | 'large'>, default: 'default' },
    adaptive: { type: Boolean, default: false },
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
    alignWhole: { type: String, default: 'left' },
    headerAlign: { type: String, default: '' },
    border: { type: Boolean, default: false },
    highlightCurrentRow: { type: Boolean, default: false },
    rowKey: { type: [String, Function] as PropType<string | ((row: any) => string)>, default: undefined },
    tableLayout: { type: String as PropType<'fixed' | 'auto'>, default: 'fixed' },
    headerCellStyle: { type: Object as PropType<Record<string, string>>, default: undefined },
    showOverflowTooltip: { type: Boolean, default: false },
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

    function handleSizeChange(size: number) {
      if (props.pagination) {
        (props.pagination as AuthDataTablePagination).pageSize = size;
      }
      emit('page-size-change', size);
    }

    function handleCurrentChange(page: number) {
      if (props.pagination) {
        (props.pagination as AuthDataTablePagination).currentPage = page;
      }
      emit('page-current-change', page);
    }

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

    function paginationWrapClass(align?: 'left' | 'center' | 'right') {
      const suffix = align === 'left' || align === 'center' ? align : 'right';
      return ['auth-data-table__pagination-wrap', `auth-data-table__pagination-wrap--${suffix}`];
    }

    return () => {
      const p = props.pagination;

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
