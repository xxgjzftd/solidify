export type XReconfirmProps = Omit<
  XFloatingProps,
  'children' | 'expose' | 'floating' | 'trigger'
> & { children?: JSX.Element; confirm: () => unknown; message?: JSX.Element }

export function XReconfirm(props: XReconfirmProps) {
  const [rp, fp] = splitProps(props, ['children', 'confirm', 'message'])

  let fe: XFloatingExpose
  const hide = () => {
    fe.hide()
  }
  const confirm = async () => {
    await rp.confirm()
    hide()
  }
  return (
    <XFloating
      {...fp}
      expose={(e) => {
        fe = e
      }}
      floating={
        <>
          {rp.message ?? <div class='w-40 p-2 text-sm'>确认删除吗？</div>}
          <div class='flex justify-end gap-2 pt-2'>
            <XButton color='gray' onClick={hide} size='small' type='text'>
              取消
            </XButton>
            <XButtonAsync action={confirm} size='small'>
              确认
            </XButtonAsync>
          </div>
        </>
      }
      trigger='click'>
      {rp.children ?? (
        <XButton color='red' type='text'>
          删除
        </XButton>
      )}
    </XFloating>
  )
}
