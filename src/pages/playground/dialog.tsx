export default function Dialog() {
  const [v1, setV1] = createSignal(false)
  const [v2, setV2] = createSignal(false)
  return (
    <div>
      <XButton onClick={() => setV1(true)}>open</XButton>

      <XDialog onClose={() => setV1(false)} title='v1' visible={v1()}>
        <div>
          <XButton onClick={() => setV2(true)}>open v2</XButton>
        </div>
      </XDialog>

      <XDialog
        onClose={() => setV2(false)}
        title='v2'
        ui={{ container: '!w-1/3' }}
        visible={v2()}>
        <div>
          <XButton onClick={() => setV2(false)}>close</XButton>
        </div>
      </XDialog>
    </div>
  )
}
