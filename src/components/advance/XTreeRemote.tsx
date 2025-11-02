export interface XTreeRemoteExpose {
  search: () => Promise<void>
}

export type XTreeRemoteProps<
  A extends XTreeRemoteAjaxConstraint,
  V,
  M extends boolean,
> = ExposeProps<XTreeRemoteExpose> &
  Omit<XTreeProps<A['store']['data'][number], V, M>, 'data' | 'loading'> &
  (V extends object ? { identify: (value: V) => number | string } : object) & {
    ajax: A
    defer?: boolean
    onPrepare?: (ajax: A) => void
  }

interface XTreeRemoteAjaxConstraint {
  execute: () => Promise<void>
  mutate: unknown
  store: { data: unknown[]; loading: boolean; url: UrlCouldGet }
}

export function XTreeRemote<
  A extends XTreeRemoteAjaxConstraint,
  V,
  M extends boolean = false,
>(props: XTreeRemoteProps<A, V, M>) {
  const [trp, tp] = splitProps(props, ['ajax', 'defer', 'onPrepare', 'expose'])
  const ajax = trp.ajax
  const search = () => {
    props.onPrepare?.(ajax)
    return ajax.execute()
  }
  // eslint-disable-next-line solid/reactivity
  if (!trp.defer) void search()

  trp.expose?.({ search })

  return <XTree {...tp} data={ajax.store.data} loading={ajax.store.loading} />
}
