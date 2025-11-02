export interface XTreeNodeConfig<D, V> {
  children?: D[]
  content?: JSX.Element
  disabled?: boolean
  label?: number | string
  value: V
}

export interface XTreeNodeProps<D, V> extends XTreeSharedProps<D, V> {
  data: D
  identify: (value: V) => number | string
  onSelect?: (value: V) => void
}

export interface XTreeProps<
  D,
  V,
  M extends boolean,
  MV = M extends true ? V[] : V,
> extends UIProps<string>,
    XTreeSharedProps<D, V> {
  data: D[]
  identify?: (value: V) => number | string
  loading?: boolean
  multiple?: M
  onChange?: (value?: MV) => void
  value?: MV
}

export interface XTreeSharedProps<D, V> {
  factory: (it: D) => XTreeNodeConfig<D, V>
}

const XTreeContext = createContext<{
  isSelected: (key: number | string) => boolean
}>()

export function XTree<D, V, M extends boolean = false>(
  props: XTreeProps<D, V, M>,
) {
  type MV = M extends true ? V[] : V

  const _props = mergeProps({ loading: false, multiple: false } as const, props)
  const identify = (value: V) => {
    if (typeof value === 'object') {
      if (_props.identify) {
        return _props.identify(value)
      } else {
        throw new Error(
          "`identify` is required when value's type extends `object` or `object[]`",
        )
      }
    } else {
      return value as number | string
    }
  }
  const selectedKeys = createMemo(() =>
    ([] as V[]).concat(_props.value ?? []).map(identify),
  )
  const isSelected = createSelector(
    selectedKeys,
    (key: number | string, keys) => keys.includes(key),
  )

  const onSelect = (value: V) => {
    if (selectedKeys().includes(identify(value))) {
      if (_props.multiple) {
        _props.onChange?.(
          ((_props.value ?? []) as V[]).filter(
            (it) => identify(it) !== identify(value),
          ) as MV,
        )
      }
    } else {
      if (_props.multiple) {
        _props.onChange?.(((_props.value ?? []) as V[]).concat(value) as MV)
      } else {
        _props.onChange?.(value as MV)
      }
    }
  }

  let container: HTMLDivElement
  useLoading(
    () => _props.loading,
    () => container,
  )

  const value = { isSelected }

  return (
    <XTreeContext.Provider value={value}>
      <div
        class={cx('space-y-1 overflow-auto', _props.ui)}
        ref={(el) => (container = el)}>
        <For each={_props.data}>
          {(it) => (
            <XTreeNode
              {..._props}
              data={it}
              identify={identify}
              onSelect={onSelect}
            />
          )}
        </For>
      </div>
    </XTreeContext.Provider>
  )
}

export function XTreeNode<D, V>(props: XTreeNodeProps<D, V>) {
  const tc = useContext(XTreeContext)

  const config = createMemo(() => props.factory(props.data))

  const [expanded, setExpanded] = createSignal(false)
  const toggle = () => {
    setExpanded((e) => !e)
  }

  const isSelected = createMemo(() =>
    tc?.isSelected(props.identify(config().value)),
  )

  return (
    <>
      <div
        class={cx(
          'flex cursor-pointer items-center gap-1 rounded hover:bg-gray-50',
          isSelected() ? 'text-cyan-500' : '',
        )}>
        <Show
          fallback={<div class='h-px w-4 bg-gray-300' />}
          when={config().children?.length}>
          <Show
            fallback={<IconHeroiconsPlus class='h-4 w-4' onClick={toggle} />}
            when={expanded()}>
            <IconHeroiconsMinus class='h-4 w-4' onClick={toggle} />
          </Show>
        </Show>
        <div
          class='flex-1'
          onClick={() => {
            props.onSelect?.(config().value)
          }}>
          {config().label}
        </div>
      </div>
      <Show when={expanded()}>
        <div class='ml-4 space-y-1 border-l'>
          <For each={config().children}>
            {(it) => <XTreeNode {...props} data={it} />}
          </For>
        </div>
      </Show>
    </>
  )
}
