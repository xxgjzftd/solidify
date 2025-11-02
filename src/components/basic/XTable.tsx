export interface XTableColumnConfig<D> extends XTableColumnUserConfig {
  children?: (row: D, index: Accessor<number>) => JSX.Element
  header?: () => JSX.Element
  type?: 'default' | 'selection'
}

export interface XTableColumnUserConfig {
  fixed?: -1 | 0 | 1
  invisible?: boolean
  label: string
  width?: number
}

export interface XTableProps<D> extends UIProps<string>, VoidProps {
  columns: XTableColumnConfig<D>[]
  data: D[]
  id: string
  loading?: boolean
  onSelectionChange?: (selection: D[]) => void
}

export function XTable<D>(props: XTableProps<D>) {
  const [configs, setConfigs] = createStorage(
    // eslint-disable-next-line solid/reactivity
    'table' + props.id,
    [] as XTableColumnUserConfig[],
  )
  const resetConfigs = () => {
    setConfigs(props.columns.map((column) => ({ label: column.label })))
  }
  createRenderEffect(
    on(
      () => props.columns,
      (columns) => {
        const _configs = configs.filter((it) =>
          columns.find((column) => column.label === it.label),
        )
        columns.forEach(
          (column) =>
            _configs.find((config) => config.label === column.label) ??
            _configs.push({ label: column.label }),
        )
        setConfigs(_configs)
      },
    ),
  )

  const [columns, setColumns] = createStore(
    [] as SetRequired<
      XTableColumnConfig<D>,
      'fixed' | 'invisible' | 'label' | 'type' | 'width'
    >[],
  )
  createRenderEffect(() => {
    setColumns(
      reconcile(
        props.columns
          .map((column) =>
            Object.assign(
              {
                fixed: 0,
                invisible: false,
                label: column.label,
                type: 'default',
                width: column.type === 'selection' ? 40 : 80,
              },
              column,
              configs.find((config) => config.label === column.label),
            ),
          )
          .filter((item) => !item.invisible)
          .sort(
            (a, b) =>
              configs.findIndex((item) => item.label === a.label) -
              configs.findIndex((item) => item.label === b.label),
          )
          .sort((a, b) => a.fixed - b.fixed),
        { key: 'label' },
      ),
    )
  })

  const tableMinWidth = createMemo(() =>
    columns.reduce((sum, column) => sum + column.width, 0),
  )

  const column2ThMap = new WeakMap<
    XTableColumnConfig<D>,
    HTMLTableCellElement
  >()
  const [column2OffsetMap, setColumn2OffsetMap] = createSignal(
    new Map<XTableColumnConfig<D>, number>(),
  )
  createEffect(() => {
    const _column2OffsetMap = new Map<XTableColumnConfig<D>, number>()
    let sum = 0
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].fixed !== -1) {
        break
      }
      _column2OffsetMap.set(columns[i], sum)
      sum += column2ThMap.get(columns[i])?.offsetWidth ?? 0
    }
    sum = 0
    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].fixed !== 1) {
        break
      }
      _column2OffsetMap.set(columns[i], sum)
      sum += column2ThMap.get(columns[i])?.offsetWidth ?? 0
    }
    setColumn2OffsetMap(_column2OffsetMap)
  })
  const resolveOffsetPx = (column: XTableColumnConfig<D>) => {
    const offset = column2OffsetMap().get(column)?.toString()
    return offset ? `${offset}px` : undefined
  }

  const checkboxSignals = createMemo(() =>
    props.data.map(() => createSignal(false)),
  )
  const checkboxGroupIndeterminate = createMemo(() =>
    checkboxSignals().some(([it]) => it()),
  )
  const checkboxGroupValue = createMemo(() =>
    checkboxSignals().every(([it]) => it()),
  )
  createEffect(
    on(
      () => props.data.filter((_, index) => checkboxSignals()[index]?.[0]?.()),
      (selection) => {
        props.onSelectionChange?.(selection)
      },
    ),
  )

  let dragIndex = -1
  let dropIndex = -1
  const dragover = (e: DragEvent) => {
    e.preventDefault()
  }
  const drop = (e: DragEvent) => {
    e.preventDefault()
    if (dragIndex < 0 || dropIndex === dragIndex) return

    const _configs = [...configs]
    _configs.splice(dropIndex, 0, _configs.splice(dragIndex, 1)[0])
    setConfigs(_configs)
    dragIndex = -1
    dropIndex = -1
  }

  return (
    <div class={cx('relative overflow-hidden', props.ui)}>
      <div class='h-full w-full overflow-auto'>
        <table
          class='w-full border-separate border-spacing-0'
          style={{ 'min-width': `${tableMinWidth().toString()}px` }}>
          <thead class='sticky top-0 z-10'>
            <tr>
              <For each={columns}>
                {(column) => (
                  <th
                    class={cx(column.fixed && 'sticky z-1')}
                    ref={(el) => column2ThMap.set(column, el)}
                    style={{
                      left:
                        column.fixed === -1
                          ? resolveOffsetPx(column)
                          : undefined,
                      right:
                        column.fixed === 1
                          ? resolveOffsetPx(column)
                          : undefined,
                      width: column.width ? `${column.width.toString()}px` : '',
                    }}>
                    <Switch>
                      <Match when={column.type === 'default'}>
                        {column.header?.() ?? column.label}
                      </Match>
                      <Match when={column.type === 'selection'}>
                        <XCheckbox
                          indeterminate={checkboxGroupIndeterminate()}
                          onChange={(v) => {
                            batch(() => {
                              checkboxSignals().forEach(([, set]) => set(v))
                            })
                          }}
                          value={checkboxGroupValue()}
                        />
                      </Match>
                    </Switch>
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody class='relative z-1'>
            <Switch
              fallback={
                <tr>
                  <td class='text-gray-400' colspan={columns.length}>
                    <div class='flex w-full items-center justify-center gap-2'>
                      <IconHeroiconsMagnifyingGlass class='h-4 w-4' />
                      <span>无数据</span>
                    </div>
                  </td>
                </tr>
              }>
              <Match when={props.loading}>
                <tr>
                  <td class='text-gray-400' colspan={columns.length}>
                    <div class='flex w-full items-center justify-center gap-2'>
                      <IconHeroiconsArrowPath class='h-4 w-4 animate-spin' />
                      <span>加载中</span>
                    </div>
                  </td>
                </tr>
              </Match>
              <Match when={props.data.length}>
                <For each={props.data}>
                  {(row, index) => (
                    <tr>
                      <For each={columns}>
                        {(column) => (
                          <td
                            class={cx(column.fixed && 'sticky z-1')}
                            style={{
                              left:
                                column.fixed === -1
                                  ? resolveOffsetPx(column)
                                  : undefined,
                              right:
                                column.fixed === 1
                                  ? resolveOffsetPx(column)
                                  : undefined,
                              width: column.width
                                ? `${column.width.toString()}px`
                                : '',
                            }}>
                            <Switch>
                              <Match when={column.type === 'default'}>
                                {column.children?.(row, index)}
                              </Match>
                              <Match when={column.type === 'selection'}>
                                <XCheckbox
                                  onChange={(v) =>
                                    checkboxSignals()[index()]?.[1](v)
                                  }
                                  value={checkboxSignals()[index()]?.[0]()}
                                />
                              </Match>
                            </Switch>
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </Match>
            </Switch>
          </tbody>
        </table>
      </div>

      <XFloating
        floating={
          <div class='divide-y'>
            <div class='flex items-center justify-between py-1'>
              <span>列定制</span>
              <XButton onClick={resetConfigs} type='text'>
                重置
              </XButton>
            </div>
            <div class='h-px bg-gray-300' />
            <div class='divide-y px-2'>
              <For each={configs}>
                {(config, index) => (
                  <div
                    class='group flex cursor-pointer items-center justify-between gap-4 py-1 text-sm select-none'
                    draggable='true'
                    on:dragover={dragover}
                    on:dragstart={() => {
                      dragIndex = index()
                    }}
                    on:drop={(e) => {
                      dropIndex = index()
                      drop(e)
                    }}>
                    <div class='flex items-center gap-2'>
                      <IconHeroiconsBars3 class='h-4 w-4' />
                      <Show
                        fallback={
                          <IconHeroiconsEye
                            class='h-4 w-4'
                            onClick={() => {
                              setConfigs(index(), 'invisible', true)
                            }}
                          />
                        }
                        when={config.invisible}>
                        <IconHeroiconsEyeSlash
                          class='h-4 w-4'
                          onClick={() => {
                            setConfigs(index(), 'invisible', false)
                          }}
                        />
                      </Show>
                      <div>{config.label}</div>
                    </div>
                    <div class='flex items-center'>
                      <Show
                        fallback={
                          <XFloating floating={<div>不固定</div>}>
                            <IconHeroiconsChevronUpDown16Solid
                              class='h-4 w-4'
                              onClick={() => {
                                setConfigs(index(), 'fixed', 0)
                              }}
                            />
                          </XFloating>
                        }
                        when={config.fixed !== -1}>
                        <XFloating floating={<div>固定在列首</div>}>
                          <IconHeroiconsChevronUp16Solid
                            class='invisible w-4 group-hover:visible'
                            onClick={() => {
                              setConfigs(index(), 'fixed', -1)
                            }}
                          />
                        </XFloating>
                      </Show>
                      <Show
                        fallback={
                          <XFloating floating={<div>不固定</div>}>
                            <IconHeroiconsChevronUpDown16Solid
                              class='h-4 w-4'
                              onClick={() => {
                                setConfigs(index(), 'fixed', 0)
                              }}
                            />
                          </XFloating>
                        }
                        when={config.fixed !== 1}>
                        <XFloating floating={<div>固定在列尾</div>}>
                          <IconHeroiconsChevronDown16Solid
                            class='invisible w-4 group-hover:visible'
                            onClick={() => {
                              setConfigs(index(), 'fixed', 1)
                            }}
                          />
                        </XFloating>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        }
        placement='bottom-end'
        trigger='click'
        ui={{ floating: { wrapper: 'bg-white shadow-xl' } }}>
        <IconHeroiconsCog6Tooth class='absolute top-0 right-0 z-10 mt-2 mr-1 w-6' />
      </XFloating>

      <div class='pointer-events-none absolute inset-0 z-20 border' />
    </div>
  )
}
