export interface XFormRemoteExpose extends XFormExpose {
  search: () => Promise<void>
}

export type XFormRemoteItemConfig<A extends XFormRemoteAjaxConstraint> = Omit<
  XFormItemProps,
  'children'
> & { children: (ajax: A) => JSX.Element }

export type XFormRemoteProps<A extends XFormRemoteAjaxConstraint> =
  ExposeProps<XFormRemoteExpose> &
    Omit<XFormProps, 'children' | 'disabled' | 'expose'> & {
      ajax: A
      children?: (ajax: A) => JSX.Element
      defer?: boolean
      disabled?: ((ajax: A) => boolean) | boolean
      onPrepare?: (ajax: A) => void
    }

interface XFormRemoteAjaxConstraint {
  execute: () => Promise<void>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: (store: { data: any }) => void
  store: { data: unknown; loading: boolean }
}

export function XFormRemote<A extends XFormRemoteAjaxConstraint>(
  props: XFormRemoteProps<A>,
) {
  const [frp, fp] = splitProps(props, [
    'ajax',
    'children',
    'defer',
    'disabled',
    'onPrepare',
    'expose',
  ])
  const ajax = frp.ajax
  const disabled = createMemo(() =>
    typeof frp.disabled === 'function' ? frp.disabled(ajax) : frp.disabled,
  )

  const search = () => {
    props.onPrepare?.(ajax)
    return ajax.execute()
  }

  const init = JSON.stringify(ajax.store.data)
  let fe: XFormExpose
  const reset = () => {
    ajax.mutate({ data: JSON.parse(init) as unknown })
    fe.reset()
  }
  const validate = () => fe.validate()

  // eslint-disable-next-line solid/reactivity
  if (!frp.defer) void search()

  useLoading(
    () => ajax.store.loading,
    () => fe.form,
  )

  frp.expose?.({
    get form() {
      return fe.form
    },
    reset,
    search,
    validate,
  })

  return (
    <XForm
      {...fp}
      disabled={disabled()}
      expose={(e) => {
        fe = e
      }}>
      {props.children?.(ajax)}
    </XForm>
  )
}
