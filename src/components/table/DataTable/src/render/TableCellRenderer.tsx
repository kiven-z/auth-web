import type { PropType } from 'vue';
import { createVNode, defineComponent, Fragment } from 'vue';

/**
 * 将 cellRenderer 函数包成可挂载的 VNode
 */
export default defineComponent({
  name: 'AuthTableCellRenderer',
  props: {
    render: { type: Function as PropType<(params: Record<string, unknown>) => unknown>, required: true },
    params: { type: Object as PropType<Record<string, unknown>>, required: true },
  },
  setup(props) {
    return () => createVNode(Fragment, null, [props.render(props.params) as any]);
  },
});
