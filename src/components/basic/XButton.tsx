const ui = cva('inline-flex items-center gap-2', {
  compoundVariants: [
    { class: 'bg-cyan-500 hover:bg-cyan-600', color: 'cyan', type: 'default' },
    {
      class: 'text-cyan-500 hover:text-cyan-600',
      color: 'cyan',
      type: ['plain', 'text'],
    },
    { class: 'bg-gray-500 hover:bg-gray-600', color: 'gray', type: 'default' },
    {
      class: 'text-gray-500 hover:text-gray-600',
      color: 'gray',
      type: ['plain', 'text'],
    },
    {
      class: 'bg-green-500 hover:bg-green-600',
      color: 'green',
      type: 'default',
    },
    {
      class: 'text-green-500 hover:text-green-600',
      color: 'green',
      type: ['plain', 'text'],
    },
    {
      class: 'bg-yellow-500 hover:bg-yellow-600',
      color: 'yellow',
      type: 'default',
    },
    {
      class: 'text-yellow-500 hover:text-yellow-600',
      color: 'yellow',
      type: ['plain', 'text'],
    },
    { class: 'bg-red-500 hover:bg-red-600', color: 'red', type: 'default' },
    {
      class: 'text-red-500 hover:text-red-600',
      color: 'red',
      type: ['plain', 'text'],
    },
  ],
  variants: {
    color: { cyan: '', gray: '', green: '', red: '', yellow: '' },
    disabled: { true: 'cursor-not-allowed opacity-50' },
    loading: { true: 'cursor-not-allowed opacity-50' },
    size: { default: 'text-sm', large: 'text-base', small: 'text-xs' },
    type: {
      default: 'rounded-md px-3 py-1 text-white',
      plain: 'rounded-md px-3 py-1 ring-1 ring-inset ring-current',
      text: '',
    },
  },
})

export type ButtonColors = Extract<
  Colors,
  'cyan' | 'gray' | 'green' | 'red' | 'yellow'
>

export interface XButtonProps extends ParentProps, UIProps<string> {
  color?: ButtonColors
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  size?: 'default' | 'large' | 'small'
  type?: 'default' | 'plain' | 'text'
}

export function XButton(props: XButtonProps) {
  const _props = mergeProps(
    {
      color: 'cyan',
      disabled: false,
      loading: false,
      size: 'default',
      type: 'default',
    } as const,
    props,
  )

  return (
    <button
      class={cx(
        ui({
          color: _props.color,
          disabled: _props.disabled,
          loading: _props.loading,
          size: _props.size,
          type: _props.type,
        }),
        _props.ui,
      )}
      disabled={_props.disabled || _props.loading}
      onClick={() => _props.onClick?.()}
      type='button'>
      <Show when={_props.loading}>
        <IconHeroiconsArrowPath class='h-4 w-4 animate-spin' />
      </Show>
      {_props.children}
    </button>
  )
}
