const ui = cva(
  'inline-flex w-full items-center overflow-hidden rounded-md px-2 ring-1 ring-inset focus-within:ring-cyan-500',
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

export interface XTextareaProps extends UIProps<string>, VoidProps {
  clearable?: boolean
  disabled?: boolean
  enabled?: boolean
  onBlur?: () => void
  onInput?: (value?: string) => void
  placeholder?: string
  rows?: number
  size?: 'default' | 'large' | 'small'
  value?: string
}

export function XTextarea(props: XTextareaProps) {
  const _props = mergeProps(
    {
      clearable: false,
      disabled: false,
      placeholder: '',
      rows: 3,
      size: 'default',
    } as const,
    props,
  )

  const fic = useContext(XFormItemContext)

  const disabled = createMemo(() =>
    _props.enabled ? false : !!fic?.disabled || _props.disabled,
  )

  const onBlur = () => {
    fic?.validation?.validate()
    _props.onBlur?.()
  }
  const onInput = (e: Event) => {
    const v = (e.target as HTMLTextAreaElement).value
    _props.onInput?.(v)
  }

  return (
    <div
      class={cx(
        ui({ disabled: disabled(), error: !!fic?.error, size: _props.size }),
        _props.ui,
      )}>
      <textarea
        class={cx(
          'min-w-0 flex-1 border-none',
          disabled() ? 'pointer-events-none bg-gray-200' : '',
        )}
        disabled={disabled()}
        id={fic?.id}
        onBlur={onBlur}
        onInput={onInput}
        placeholder={_props.placeholder}
        rows={_props.rows}
        value={_props.value ?? ''}
      />
    </div>
  )
}
