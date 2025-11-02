export type XTableRemoteColumnConfig<A extends XTableRemoteAjaxConstraint> =
  Omit<
    XTableColumnConfig<A['store']['data'][number]>,
    'children' | 'header'
  > & {
    children?: (
      row: A['store']['data'][number],
      index: Accessor<number>,
      ajax: A,
    ) => JSX.Element
    header?: (ajax: A) => JSX.Element
    search?: (ajax: A) => JSX.Element
    title?: (ajax: A) => JSX.Element
  }

export interface XTableRemoteExpose {
  search: () => Promise<void>
}

export type XTableRemoteProps<A extends XTableRemoteAjaxConstraint> =
  ExposeProps<XTableRemoteExpose> &
    Omit<
      XTableProps<A['store']['data'][number]>,
      'columns' | 'data' | 'id' | 'loading' | 'ui'
    > &
    UIProps<XTableRemoteUi> & {
      ajax: A
      columns: XTableRemoteColumnConfig<A>[]
      defer?: boolean
      id?: string
      onPrepare?: (ajax: A) => void
      operation?: (ajax: A) => JSX.Element
      pagination?: boolean
    }

export interface XTableRemoteUi {
  container?: string
}

interface PagedQuery {
  pageIndex?: number
  pageSize?: number
}

interface XTableRemoteAjaxConstraint {
  execute: () => Promise<void>
  mutate: (key: 'query', value: PagedQuery) => void
  store: {
    data: unknown[]
    loading: boolean
    paging: PagingResultDto
    query?: PagedQuery
    url: UrlCouldGet
  }
}

export const XTableRemoteContext =
  createContext<
    Readonly<{
      change: Signal<[label: string, value: string]>
      remove: Signal<string>
    }>
  >()

export const XTableRemoteColumnHeaderContext =
  createContext<Readonly<{ label: string; visible: Signal<boolean> }>>()

export function XTableRemote<A extends XTableRemoteAjaxConstraint>(
  props: XTableRemoteProps<A>,
) {
  const [trp, tp] = splitProps(props, [
    'ajax',
    'columns',
    'defer',
    'id',
    'onPrepare',
    'operation',
    'pagination',
    'ui',
    'expose',
  ])
  const ajax = trp.ajax

  const id = createMemo(
    () => props.id ?? `${location.pathname}${ajax.store.url}/remote`,
  )

  const search = () => {
    props.onPrepare?.(ajax)
    return ajax.execute()
  }

  // eslint-disable-next-line solid/reactivity
  const debounced = debounce(() => {
    void search()
  })

  const columns = createMemo(() =>
    trp.columns.map(
      (column) =>
        ({
          ...column,
          children: (row, index) => column.children?.(row, index, ajax),
          header: () => {
            const trc = useContext(XTableRemoteContext)
            let fe: XFloatingExpose
            if (trc) {
              createEffect(
                on(trc.change[0], () => {
                  if (visible[0]()) {
                    fe.hide()
                  }
                }),
              )
            }

            const visible = createSignal(false)
            const value = {
              get label() {
                return column.label
              },
              get visible() {
                return visible
              },
            }
            return (
              <XTableRemoteColumnHeaderContext.Provider value={value}>
                <Switch
                  fallback={
                    <Show fallback={column.label} when={column.title}>
                      {column.title?.(ajax)}
                    </Show>
                  }>
                  <Match when={column.header}>{column.header?.(ajax)}</Match>
                  <Match when={column.search}>
                    <XFloating
                      expose={(e) => {
                        fe = e
                      }}
                      floating={column.search?.(ajax)}
                      onVisibleChange={visible[1]}
                      placement='bottom-start'
                      trigger='click'
                      ui={{ floating: { wrapper: 'border-0! p-0!' } }}>
                      <div class='flex cursor-pointer items-center gap-1'>
                        <Show fallback={column.label} when={column.title}>
                          {column.title?.(ajax)}
                        </Show>
                        <IconHeroiconsMagnifyingGlass
                          class={cx(
                            'w-4',
                            column.label in conditions ? 'text-cyan-500' : '',
                          )}
                        />
                      </div>
                    </XFloating>
                  </Match>
                </Switch>
              </XTableRemoteColumnHeaderContext.Provider>
            )
          },
        }) as XTableColumnConfig<A['store']['data'][number]>,
    ),
  )

  const [conditions, setConditions] = createStore({} as Record<string, string>)
  const change = createSignal() as Signal<[label: string, value: string]>
  createEffect(
    on(
      change[0],
      ([label, value]) => {
        setConditions(label, value)
        debounced()
      },
      { defer: true },
    ),
  )
  const remove = createSignal('', { equals: false })
  const conditionsRemove = (label: string) => {
    remove[1](label)
  }
  const reset = () => {
    for (const label in conditions) {
      remove[1](label)
    }
  }

  // eslint-disable-next-line solid/reactivity
  if (!trp.defer) void search()

  const value = {
    get change() {
      return change
    },
    get remove() {
      return remove
    },
  }

  trp.expose?.({ search })

  return (
    <XTableRemoteContext.Provider value={value}>
      <div class={cx('flex flex-col gap-2', trp.ui?.container)}>
        <div class='flex flex-wrap justify-between'>
          <div class='flex flex-wrap gap-2'>
            <For each={Object.entries(conditions)}>
              {([label, value]) => (
                <XTag
                  closable
                  onClose={() => {
                    conditionsRemove(label)
                  }}>{`${label}: ${value}`}</XTag>
              )}
            </For>
          </div>
          <div class='flex items-center justify-end gap-2'>
            <XButton onClick={reset}>
              <IconHeroiconsArrowPath />
              <span>重置</span>
            </XButton>
            <XButtonAsync action={search}>
              <IconHeroiconsMagnifyingGlass />
              <span>查询</span>
            </XButtonAsync>
            {trp.operation?.(ajax)}
          </div>
        </div>
        <XTable
          data={ajax.store.data}
          loading={ajax.store.loading}
          {...tp}
          columns={columns()}
          id={id()}
          ui='flex-1'
        />
        <Show when={trp.pagination}>
          <XPagination
            onChange={(pageIndex, pageSize) => {
              ajax.mutate('query', { pageIndex, pageSize })
              void search()
            }}
            pageIndex={ajax.store.query?.pageIndex}
            pageSize={ajax.store.query?.pageSize}
            total={ajax.store.paging.itemCount}
          />
        </Show>
      </div>
    </XTableRemoteContext.Provider>
  )
}
