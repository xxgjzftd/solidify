export type XSelectRemoteProps<
  A extends XSelectRemoteAjaxConstraint,
  V,
  M extends boolean,
> = Omit<
  XSelectProps<A['store']['data'][number], V, M>,
  'data' | 'loading' | 'onSearch'
> &
  (V extends object ? { identify: (value: V) => number | string } : object) & {
    ajax: A
    defer?: boolean
    onPrepare?: (ajax: A, input?: string) => void
  }

interface XSelectRemoteAjaxConstraint {
  execute: () => Promise<void>
  mutate: unknown
  store: { data: unknown[]; loading: boolean; url: UrlCouldGet }
}

export function XSelectRemote<
  A extends XSelectRemoteAjaxConstraint,
  V,
  M extends boolean = false,
>(props: XSelectRemoteProps<A, V, M>) {
  const [srp, sp] = splitProps(props, ['ajax', 'defer', 'onPrepare'])
  const ajax = srp.ajax
  const search = (input?: string) => {
    props.onPrepare?.(ajax, input)
    return ajax.execute()
  }
  // eslint-disable-next-line solid/reactivity
  if (!srp.defer) void search()
  // eslint-disable-next-line solid/reactivity
  const debounced = debounce(() => {
    void search()
  })
  return (
    <XSelect
      {...sp}
      data={ajax.store.data}
      loading={ajax.store.loading}
      onSearch={debounced}
    />
  )
}
