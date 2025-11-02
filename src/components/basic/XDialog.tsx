export interface XDialogProps extends ParentProps {
  header?: JSX.Element
  onClose?: () => void
  title?: string
  ui?: XDialogUi
  visible?: boolean
}

export interface XDialogUi {
  children?: { wrapper?: string }
  container?: string
}

export function XDialog(props: XDialogProps) {
  const _props = mergeProps({ title: '', visible: false } as const, props)
  const [zIndex, setZIndex] = createSignal(popup.zIndex)

  let rendered = false
  createEffect(() => {
    if (_props.visible) {
      rendered = true
      setZIndex(popup.zIndex)
      popup.increment()
    } else {
      if (rendered) {
        popup.decrement()
      }
    }
  })
  return (
    <Show when={_props.visible || rendered}>
      <Portal>
        <div
          class={cx(
            'fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300',
            _props.visible ? 'visible opacity-100' : 'invisible opacity-0',
          )}
          on:click={(e) => {
            if (e.target === e.currentTarget) _props.onClose?.()
          }}
          style={{ 'z-index': zIndex() }}>
          <div
            class={cx(
              'flex w-10/12 flex-col rounded-lg bg-white p-4',
              _props.ui?.container,
            )}>
            <Show
              fallback={
                <div class='flex items-center justify-between'>
                  <div>{_props.title}</div>
                  <XButton color='gray' onClick={_props.onClose} type='text'>
                    <IconHeroiconsXMark />
                  </XButton>
                </div>
              }
              when={_props.header}>
              {_props.header}
            </Show>
            <div
              class={cx(
                'flex flex-1 overflow-hidden py-4',
                _props.ui?.children?.wrapper,
              )}>
              {_props.children}
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  )
}
