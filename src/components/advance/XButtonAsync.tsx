export type XButtonAsyncProps = Omit<XButtonProps, 'loading' | 'onClick'> & {
  action: () => unknown
}

export function XButtonAsync(props: XButtonAsyncProps) {
  const [bap, bp] = splitProps(props, ['action'])
  const [loading, setLoading] = createSignal(false)

  const onClick = () => {
    setLoading(true)
    void Promise.resolve(bap.action()).finally(() => setLoading(false))
  }

  return <XButton {...bp} loading={loading()} onClick={onClick} />
}
