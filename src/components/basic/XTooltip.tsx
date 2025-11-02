export type TooltipColors = Extract<
  Colors,
  'blue' | 'cyan' | 'gray' | 'green' | 'pink' | 'purple' | 'red' | 'yellow'
>

export interface XTooltipProps {
  color?: TooltipColors
  description?: string
  title: string
}

const ui = cva('space-y-1 rounded-md px-2 py-1', {
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
  },
})

export function XTooltip(props: XTooltipProps) {
  const _props = mergeProps({ color: 'gray' } as const, props)

  return (
    <div class={ui({ color: _props.color })}>
      <div class='flex items-center gap-2 text-sm font-medium'>
        <Switch>
          <Match when={_props.color === 'gray'}>
            <IconHeroiconsInformationCircle />
          </Match>
          <Match when={_props.color === 'red'}>
            <IconHeroiconsExclamationCircle />
          </Match>
          <Match when={_props.color === 'yellow'}>
            <IconHeroiconsExclamationTriangle />
          </Match>
          <Match when={_props.color === 'green'}>
            <IconHeroiconsCheckCircle />
          </Match>
        </Switch>
        <span>{_props.title}</span>
      </div>
      <Show when={_props.description}>
        <div class='text-xs text-gray-500'>{_props.description}</div>
      </Show>
    </div>
  )
}
