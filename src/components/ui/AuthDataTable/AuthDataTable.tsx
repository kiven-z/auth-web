import { isBoolean, isFunction } from '@pureadmin/utils';
import { ElConfigProvider, ElPagination, ElTable, ElTableColumn } from 'element-plus';
import type { PropType } from 'vue';
import {
  computed,
  createVNode,
  defineComponent,
  Fragment,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import './index.scss';

/** 分页对象（与角色页 reactive 结构一致，可就地修改） */
export type AuthDataTablePagination = {
  total: number;
  pageSize: number;
  currentPage: number;
  background?: boolean;
  layout?: string;
  pageSizes?: number[];
  align?: 'left' | 'center' | 'right';
  style?: Record<string, string>;
};

const Renderer = defineComponent({
  name: 'AuthTableCellRenderer',
  props: {
    render: { type: Function as PropType<(params: Record<string, unknown>) => unknown>, required: true },
    params: { type: Object as PropType<Record<string, unknown>>, required: true },
  },
  setup(props) {
    return () => createVNode(Fragment, null, [props.render(props.params) as any]);
  },
});

function renderCellContent(
  column: TableColumns,
  scope: { row: any; column: any; $index: number },
  slots: any,
  tableProps: Record<string, unknown>
) {
  if (column.formatter) {
    return column.formatter(scope.row, scope.column, scope.row?.[column.prop as string], scope.$index);
  }
  if (column.cellRenderer) {
    return (
      <Renderer
        render={column.cellRenderer as (p: Record<string, unknown>) => unknown}
        params={{
          ...scope,
          index: scope.$index,
          props: tableProps,
        }}
      />
    );
  }
  const slotName = column.slot;
  if (slotName && slots[slotName]) {
    return slots[slotName](scope);
  }
  if (column.prop) {
    return <span>{scope.row[column.prop as string]}</span>;
  }
  return null;
}

function columnVisible(column: TableColumns) {
  if (isBoolean(column.hide) && column.hide) {
    return false;
  }
  if (isFunction(column.hide) && (column.hide as () => boolean)()) {
    return false;
  }
  return true;
}

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
      type: Object as PropType<{ offsetBottom?: number; fixHeader?: boolean; timeout?: number; zIndex?: number }>,
      default: () => ({ offsetBottom: 96, fixHeader: true, timeout: 60, zIndex: 3 }),
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

    const paginationStyle = computed(() => {
      const p = props.pagination;
      const align = p?.align ?? 'right';
      return Object.assign(
        {
          width: '100%',
          margin: '16px 0',
          display: 'flex',
          flexWrap: 'wrap' as const,
          justifyContent: align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
        },
        p?.style ?? {}
      );
    });

    const visibleColumns = computed(() => props.columns.filter(columnVisible));

    async function setAdaptive() {
      await nextTick();
      const wrap = tableWrapperRef.value;
      if (!wrap) {
        return;
      }
      const bottom = props.adaptiveConfig?.offsetBottom ?? 96;
      wrap.style.height = `${window.innerHeight - wrap.getBoundingClientRect().top - bottom}px`;
    }

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    function debouncedSetAdaptive() {
      const wait = props.adaptiveConfig?.timeout ?? 60;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        void setAdaptive();
      }, wait);
    }

    watch(
      () => props.columns,
      () => {
        if (props.adaptive) {
          void setAdaptive();
        }
      },
      { deep: true }
    );

    onMounted(() => {
      if (!props.adaptive) {
        return;
      }
      void nextTick(() => {
        if (props.rowHoverBgColor && tableWrapperRef.value) {
          tableWrapperRef.value.style.setProperty('--el-table-row-hover-bg-color', props.rowHoverBgColor, 'important');
        }
        void setAdaptive();
        window.addEventListener('resize', debouncedSetAdaptive);
      });
    });

    onBeforeUnmount(() => {
      if (props.adaptive) {
        window.removeEventListener('resize', debouncedSetAdaptive);
      }
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    });

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

    return () => {
      const p = props.pagination;
      const tableVNode = (
        <div ref={tableWrapperRef} style={{ width: '100%', height: '500px' }}>
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
          <ElPagination
            class="auth-data-table-pagination"
            style={paginationStyle.value}
            layout={p.layout ?? 'total, sizes, prev, pager, next, jumper'}
            pageSizes={p.pageSizes ?? [10, 20, 30, 50]}
            total={p.total}
            currentPage={p.currentPage}
            pageSize={p.pageSize}
            background={p.background ?? true}
            onSizeChange={handleSizeChange}
            onCurrentChange={handleCurrentChange}
          />
        ) : null;

      return (
        <div class="auth-data-table" style={{ width: '100%' }} v-loading={props.loading}>
          <ElConfigProvider>
            {tableVNode}
            {paginationVNode}
          </ElConfigProvider>
        </div>
      );
    };
  },
});
