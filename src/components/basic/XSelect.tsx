export interface XSelectOptionConfig<V> {
  content?: JSX.Element
  disabled?: boolean
  label?: number | string
  value: V
}

export interface XSelectProps<
  D,
  V,
  M extends boolean,
  MV = M extends true ? V[] : V,
> extends UIProps<string> {
  children?: (
    selected: Accessor<(undefined | XSelectOptionConfig<V>)[]>,
  ) => JSX.Element
  clearable?: boolean
  data: D[]
  disabled?: boolean
  enabled?: boolean
  factory: (it: D) => XSelectOptionConfig<V>
  identify?: (value: V) => number | string
  loading?: boolean
  multiple?: M
  onBlur?: () => void
  onChange?: (value?: MV) => void
  onFocus?: () => void
  onSearch?: (input: string) => void
  placeholder?: string
  size?: 'default' | 'large' | 'small'
  supplement?: (lacks: V[]) => D[]
  value?: MV
}

export function XSelect<D, V, M extends boolean = false>(
  props: XSelectProps<D, V, M>,
) {
  type MV = M extends true ? V[] : V

  const _props = mergeProps(
    {
      children: ((selected) => (
        <Show
          fallback={selected()[0]?.content ?? selected()[0]?.label}
          when={props.multiple}>
          <div class='flex gap-1'>
            <For each={selected()}>
              {(it) =>
                it && (
                  <XTag
                    closable
                    onClose={() => {
                      if (_props.multiple) {
                        onChange(
                          ((_props.value ?? []) as V[]).filter(
                            (v) => identify(v) !== identify(it.value),
                          ) as MV,
                        )
                      } else {
                        onChange()
                      }
                    }}
                    size='small'>
                    {it.content ?? it.label}
                  </XTag>
                )
              }
            </For>
          </div>
        </Show>
      )) as NonNullable<XSelectProps<D, V, M>['children']>,
      clearable: false,
      disabled: false,
      multiple: false,
      placeholder: '',
      size: 'default',
    } as const,
    props,
  )

  const fic = useContext(XFormItemContext)
  const disabled = createMemo(() =>
    _props.enabled ? false : _props.disabled || !!fic?.disabled,
  )

  const trc = useContext(XTableRemoteContext)
  const trchc = useContext(XTableRemoteColumnHeaderContext)

  let ie: XInputExpose

  if (trchc) {
    createEffect(
      on(trchc.visible[0], (v) => {
        if (v) {
          setTimeout(() => {
            ie.input.focus()
            ie.input.click()
          })
        }
      }),
    )

    if (trc) {
      createEffect(
        on(trc.remove[0], (label) => {
          if (label === trchc.label) {
            _props.onChange?.()
            trc.change[1]([trchc.label, undefined!])
          }
        }),
      )
    }
  }

  const onChange = (value?: MV) => {
    _props.onChange?.(value)
    fic?.validation?.validate()
    if (trc && trchc) {
      trc.change[1]([
        trchc.label,
        selectedOptions()
          .map((it) => it?.label)
          .join(','),
      ])
    }
  }

  const [supplements, setSupplements] = createSignal([] as D[])
  const init = createMemo(() => _props.data.map((it) => _props.factory(it)))
  const options = createMemo(() =>
    supplements()
      .map((it) => _props.factory(it))
      .concat(init()),
  )

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

  createEffect(
    on([() => _props.value, init], () => {
      if (_props.value) {
        const lacks = ([] as V[]).concat(_props.value).filter(
          (it) =>
            !init()
              .map((it) => identify(it.value))
              .includes(identify(it)),
        )
        const data = _props.supplement?.(lacks)
        if (data) {
          setSupplements(data)
        }
      } else {
        setSupplements([])
      }
    }),
  )

  let fe: XFloatingExpose
  let ule: HTMLUListElement | undefined

  const selectedKeys = createMemo(() =>
    ([] as V[]).concat(_props.value ?? []).map(identify),
  )
  const selectedOptions = createMemo(() =>
    selectedKeys().map((key) =>
      options().find((option) => identify(option.value) === key),
    ),
  )
  const isSelected = createSelector(
    selectedKeys,
    (key: number | string, keys) => keys.includes(key),
  )

  const [searchValue, setSearchValue] = createSignal('')
  createEffect(
    on(
      searchValue,
      (v) => {
        _props.onSearch?.(v)
      },
      { defer: true },
    ),
  )

  const chevron = (
    <IconHeroiconsChevronDown class='shrink-0 transition' />
  ) as Element

  return (
    <XFloating
      disabled={disabled()}
      expose={(e) => {
        fe = e
      }}
      floating={
        <ul
          class={cx(
            'max-h-80 overflow-auto bg-white select-none',
            _props.size === 'large' && 'text-base',
            _props.size === 'default' && 'text-sm',
            _props.size === 'small' && 'text-xs',
          )}
          ref={ule}>
          <Switch fallback={<li class='px-2 py-1 text-gray-500'>无数据</li>}>
            <Match when={_props.loading}>
              <li class='flex items-center gap-1 px-2 py-1 text-gray-500'>
                <IconHeroiconsArrowPath class='h-4 w-4 animate-spin' />
                <span>加载中</span>
              </li>
            </Match>
            <Match when={options().length}>
              <For each={options()}>
                {(option) => (
                  <li
                    class={cx(
                      'px-2 py-1 hover:bg-gray-100',
                      isSelected(identify(option.value)) &&
                        'bg-gray-50 text-cyan-500',
                      option.disabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer',
                    )}
                    onClick={() => {
                      if (_props.disabled || option.disabled) {
                        return
                      }
                      if (_props.multiple) {
                        if (isSelected(identify(option.value))) {
                          onChange(
                            ((_props.value ?? []) as V[]).filter(
                              (it) => identify(it) !== identify(option.value),
                            ) as MV,
                          )
                        } else {
                          onChange([
                            ...((_props.value ?? []) as V[]),
                            option.value,
                          ] as MV)
                        }
                      } else {
                        if (
                          _props.clearable &&
                          isSelected(identify(option.value))
                        ) {
                          onChange()
                        } else {
                          onChange(option.value as MV)
                        }
                        fe.hide()
                      }
                      setSearchValue('')
                    }}>
                    {option.content ?? option.label}
                  </li>
                )}
              </For>
            </Match>
          </Switch>
        </ul>
      }
      onVisibleChange={(v) => {
        chevron.classList.toggle('rotate-180', v)
        if (v) {
          if (ule) {
            ule.style.width = `${fe.reference().clientWidth.toString()}px`
          }
        } else {
          fic?.validation?.validate()
        }
      }}
      placement='bottom-start'
      trigger='click'
      ui={{ floating: { wrapper: 'p-0!' } }}>
      <XInput
        disabled={disabled()}
        enabled={_props.enabled}
        error={fic?.error}
        expose={(e) => {
          ie = e
        }}
        id={fic?.id}
        inject={false}
        onBlur={_props.onBlur}
        onFocus={_props.onFocus}
        onInput={(v) => {
          setSearchValue(v ?? '')
        }}
        prefix={
          <Switch>
            <Match when={selectedOptions().length}>
              {_props.children(selectedOptions)}
            </Match>
            <Match when={_props.placeholder}>
              <span class='text-gray-500'>{_props.placeholder}</span>
            </Match>
          </Switch>
        }
        size={_props.size}
        suffix={chevron}
        ui={_props.ui}
        value={searchValue()}
      />
    </XFloating>
  )
}
