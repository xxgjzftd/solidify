const ui = cva(
  'inline-flex w-full items-center overflow-hidden rounded-md px-2 inset-ring focus-within:inset-ring-cyan-500',
  {
    defaultVariants: { disabled: false, error: false, size: 'default' },
    variants: {
      disabled: { true: 'cursor-not-allowed bg-gray-200 opacity-50' },
      error: { true: 'ring-red-500' },
      size: {
        default: 'py-1 text-sm',
        large: 'py-2 text-base',
        small: 'py-0.5 text-xs',
      },
    },
  },
)

export interface XInputExpose {
  input: HTMLInputElement
}

export interface XInputProps<
  T extends XInputType,
  V = T extends 'number' ? number : string,
> extends ExposeProps<XInputExpose>,
    UIProps<string>,
    VoidProps {
  clearable?: boolean
  disabled?: boolean
  enabled?: boolean
  error?: string
  id?: string
  inject?: boolean
  onBlur?: () => void
  onFocus?: () => void
  onInput?: (value?: V) => void
  placeholder?: string
  prefix?: JSX.Element
  size?: 'default' | 'large' | 'small'
  suffix?: JSX.Element
  type?: T
  value?: V
}

export type XInputType = 'number' | 'password' | 'text'

export function XInput<T extends XInputType = 'text'>(props: XInputProps<T>) {
  const _props = mergeProps(
    {
      clearable: false,
      disabled: false,
      inject: true,
      placeholder: '',
      rows: 3,
      size: 'default',
      type: 'text',
    } as const,
    props,
  )

  const fic = _props.inject ? useContext(XFormItemContext) : undefined

  const disabled = createMemo(() =>
    _props.enabled ? false : _props.disabled || !!fic?.disabled,
  )
  const error = createMemo(() => _props.error ?? fic?.error)
  const id = createMemo(() => _props.id ?? fic?.id)

  let ie: HTMLInputElement

  const trc = _props.inject ? useContext(XTableRemoteContext) : undefined
  const trchc = _props.inject
    ? useContext(XTableRemoteColumnHeaderContext)
    : undefined
  if (trchc) {
    createEffect(
      on(trchc.visible[0], (v) => {
        if (v) {
          ie.focus()
        }
      }),
    )

    if (trc) {
      createEffect(
        on(trc.remove[0], (label) => {
          if (label === trchc.label) {
            _props.onInput?.()
            trc.change[1]([trchc.label, undefined!])
          }
        }),
      )
    }
  }

  const onBlur = () => {
    fic?.validation?.validate()
    _props.onBlur?.()
  }
  const onFocus = () => _props.onFocus?.()
  const onInput = (e: Event) => {
    const v = (e.target as HTMLInputElement).value
    _props.onInput?.(
      (_props.type === 'number' ? Number(v) : v) as T extends 'number'
        ? number
        : string,
    )
  }
  const onChange = (e: Event) => {
    const v = (e.target as HTMLInputElement).value as T
    if (trc && trchc) {
      trc.change[1]([trchc.label, v as string])
    }
  }

  _props.expose?.({
    get input() {
      return ie
    },
  })

  return (
    <div
      class={cx(
        ui({ disabled: disabled(), error: !!error(), size: _props.size }),
        _props.ui,
      )}>
      {_props.prefix}
      <input
        class={cx(
          'ml-1 min-w-0 flex-1 border-none first:ml-0',
          disabled() ? 'pointer-events-none bg-gray-200' : '',
        )}
        disabled={disabled()}
        id={id()}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onInput={onInput}
        placeholder={_props.placeholder}
        ref={(el) => (ie = el)}
        type={_props.type}
        value={_props.value ?? ''}
      />
      {_props.suffix}
      <Show when={_props.clearable && _props.value}>
        <IconHeroiconsXCircle
          class='ml-1 shrink-0 cursor-pointer'
          onClick={() => _props.onInput?.()}
        />
      </Show>
    </div>
  )
}
