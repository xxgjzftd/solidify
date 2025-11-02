import {
  computePosition,
  flip,
  offset,
  type Placement,
  shift,
} from '@floating-ui/dom'
import { children } from 'solid-js'

export interface XFloatingExpose {
  hide: () => void
  reference: Accessor<Element>
}

export interface XFloatingProps
  extends ExposeProps<XFloatingExpose>,
    ParentProps {
  disabled?: boolean
  floating: JSX.Element
  offset?: number
  onVisibleChange?: (visible: boolean) => void
  placement?: Placement
  trigger?: 'click' | 'hover'
  ui?: XFloatingUi
}

export interface XFloatingUi {
  floating?: { wrapper?: string }
}

const queue = [] as (() => boolean)[]
const listener = () => {
  let i = 0
  while (i < queue.length) {
    if (queue[i]()) {
      queue.splice(i, 1)
    } else {
      i++
    }
  }
  tryRemoveListener()
}
let listening = false
const ensureListener = () => {
  if (!listening) {
    document.addEventListener('click', listener)
    listening = true
  }
}
const tryRemoveListener = () => {
  if (!queue.length) {
    document.removeEventListener('click', listener)
    listening = false
  }
}

const XFloatingContext =
  createContext<
    Readonly<{ mouseenter?: () => void; mouseleave?: () => void }>
  >()

export function XFloating(props: XFloatingProps) {
  const _props = mergeProps(
    {
      disabled: false,
      offset: 10,
      placement: 'bottom',
      trigger: 'hover',
    } as const,
    props,
  )

  const [visible, setVisible] = createSignal(false)
  let closable = true
  const keep = () => {
    closable = false
    setTimeout(() => (closable = true))
  }
  const click = () => {
    keep()
    if (!_props.disabled && !visible()) {
      setVisible(true)
      queue.push(() => {
        if (closable) setVisible(false)
        return closable
      })
      ensureListener()
    }
  }
  let timer: ReturnType<typeof setTimeout>
  const context = useContext(XFloatingContext)
  const mouseenter = () => {
    if (_props.trigger === 'click') return
    clearTimeout(timer)
    if (!_props.disabled && !visible()) {
      setVisible(true)
    }
    context?.mouseenter?.()
  }
  const mouseleave = () => {
    if (_props.trigger === 'click') return
    clearTimeout(timer)
    timer = setTimeout(() => setVisible(false), 300)
    context?.mouseleave?.()
  }

  const resolved = children(() => _props.children)
  const reference = createMemo(() => {
    const els = resolved.toArray()
    if (els.length > 1) {
      console.warn('XFloating: only one element is allowed as reference')
    }
    let el = els[0]
    if (!el || !(el instanceof Element)) {
      console.warn('XFloating: reference is not a valid element')
      el = (<span>{el}</span>) as Element
    }
    return el as Element
  })

  createRenderEffect(() => {
    const el = reference()
    if (_props.trigger === 'click') {
      el.addEventListener('click', click)
    } else {
      el.addEventListener('mouseenter', mouseenter)
      el.addEventListener('mouseleave', mouseleave)
    }
    onCleanup(() => {
      el.removeEventListener('click', click)
      el.removeEventListener('mouseenter', mouseenter)
      el.removeEventListener('mouseleave', mouseleave)
    })
  })

  let floatingWrapper: HTMLDivElement | undefined
  let rendered = false
  createEffect(
    on(visible, (v) => {
      if (v) {
        rendered = true
        if (floatingWrapper) {
          floatingWrapper.style.zIndex = popup.zIndex
          popup.increment()
          _props.onVisibleChange?.(true)
          computePosition(reference(), floatingWrapper, {
            middleware: [offset(_props.offset), flip(), shift()],
            placement: _props.placement,
          })
            .then(({ x, y }) => {
              Object.assign(floatingWrapper.style, {
                left: `${x.toString()}px`,
                opacity: '1',
                top: `${y.toString()}px`,
              })
            })
            .catch(console.error)
        }
      } else {
        if (rendered) {
          popup.decrement()
          _props.onVisibleChange?.(false)
        }
      }
    }),
  )

  const value = { mouseenter, mouseleave }

  _props.expose?.({ hide: () => setVisible(false), reference })

  return (
    <XFloatingContext.Provider value={value}>
      {reference()}
      <Show when={visible() || rendered}>
        <Portal>
          <div
            class={cx(
              'absolute left-0 top-0 w-max overflow-hidden rounded-md border bg-white p-2 text-xs opacity-0 transition',
              visible() ? 'visible' : 'invisible',
              _props.ui?.floating?.wrapper,
            )}
            on:mouseenter={mouseenter}
            on:mouseleave={mouseleave}
            onClick={keep}
            ref={floatingWrapper}>
            {_props.floating}
          </div>
        </Portal>
      </Show>
    </XFloatingContext.Provider>
  )
}
