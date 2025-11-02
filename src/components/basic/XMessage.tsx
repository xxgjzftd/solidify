const { content, setContent, setVisible, visible, zIndex } = createRoot(() => {
  const [visible, setVisible] = createSignal(false)
  const [zIndex, setZIndex] = createSignal(popup.zIndex)
  const [content, setContent] = createSignal(() => <></>)

  let rendered = false
  createEffect(() => {
    if (visible()) {
      rendered = true
      setZIndex(popup.zIndex)
      popup.increment()
    } else {
      if (rendered) {
        popup.decrement()
      }
    }
  })

  return { content, setContent, setVisible, visible, zIndex }
})

export const message = {
  notify: (content: () => JSX.Element) => {
    setContent(() => content)
    setVisible(true)
    setTimeout(() => {
      setVisible(false)
    }, 3000)
  },
  tooltip: (props: XTooltipProps) => {
    message.notify(() => <XTooltip {...props} />)
  },
}

let used = false
export function XMessage() {
  if (used) {
    console.warn('XMessage is a singleton component')
    // eslint-disable-next-line solid/components-return-once
    return
  }
  used = true

  return (
    <Portal>
      <div
        class={cx(
          'fixed top-8 w-1/2 transition',
          visible()
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-10 opacity-0',
        )}
        style={{ 'margin-left': '25%', 'z-index': zIndex() }}>
        {content()()}
      </div>
    </Portal>
  )
}
