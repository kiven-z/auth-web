interface MenuSearchOption {
  path: string;
  type: 'history' | 'collect';
  meta: {
    icon?: string;
    title?: string;
  };
}

interface MenuSearchDrag {
  oldIndex: number;
  newIndex: number;
}

interface Props {
  value: string;
  options: Array<MenuSearchOption>;
}

export type { MenuSearchOption, MenuSearchDrag, Props };
