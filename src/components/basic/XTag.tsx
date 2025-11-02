export type TagColors = Extract<
  Colors,
  'blue' | 'cyan' | 'gray' | 'green' | 'pink' | 'purple' | 'red' | 'yellow'
>

export interface XTagProps extends ParentProps {
  closable?: boolean
  color?: TagColors
  onClick?: () => void
  onClose?: () => void
  size?: 'default' | 'large' | 'small'
}

const ui = cva(
  'inline-flex cursor-pointer items-center rounded-md px-2 ring-1 ring-inset ring-current',
  {
    variants: {
      color: {
        blue: 'bg-blue-100 text-blue-700',
        cyan: 'bg-cyan-100 text-cyan-700',
        gray: 'bg-gray-100 text-gray-700',
        green: 'bg-green-100 text-green-700',
        pink: 'bg-pink-100 text-pink-700',
        purple: 'bg-purple-100 text-purple-700',
        red: 'bg-red-100 text-red-700',
        yellow: 'bg-yellow-100 text-yellow-700',
      },
      size: {
        default: 'py-1 text-sm',
        large: 'py-2 text-base',
        small: 'py-0.5 text-xs',
      },
    },
  },
)

export function XTag(props: XTagProps) {
  const _props = mergeProps(
    { closable: false, color: 'cyan', size: 'default' } as const,
    props,
  )

  return (
    <div
      class={ui({ color: _props.color, size: _props.size })}
      onClick={() => _props.onClick?.()}>
      {_props.children}
      <Show when={_props.closable}>
        <IconHeroiconsXMark16Solid
          class='ml-1 h-4 w-4'
          onClick={() => _props.onClose?.()}
        />
      </Show>
    </div>
  )
}
