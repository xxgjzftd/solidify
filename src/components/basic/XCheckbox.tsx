export interface XCheckboxProps extends UIProps<string>, VoidProps {
  indeterminate?: boolean
  onChange?: (value: boolean) => void
  value?: boolean
}

export function XCheckbox(props: XCheckboxProps) {
  const _props = mergeProps({ indeterminate: false } as const, props)

  let checkbox: HTMLInputElement
  createEffect(() => {
    checkbox.indeterminate = _props.value ? false : _props.indeterminate
  })

  return (
    <input
      checked={_props.value}
      class={cx('h-4 w-4 cursor-pointer rounded accent-cyan-500', _props.ui)}
      onChange={() => _props.onChange?.(checkbox.checked)}
      ref={(el) => (checkbox = el)}
      type='checkbox'
    />
  )
}
