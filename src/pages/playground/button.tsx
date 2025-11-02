export default function Button() {
  const [color, setColor] = createSignal('cyan' as ButtonColors)

  return (
    <div class='flex flex-col gap-4'>
      <div>
        <XButton>default</XButton>
        <XButton color='gray'>gray</XButton>
        <XButton color='green'>green</XButton>
        <XButton color='yellow'>yellow</XButton>
        <XButton color='red'>red</XButton>
      </div>
      <div>
        <XButton type='text'>text</XButton>
        <XButton type='plain'>plain</XButton>
      </div>
      <div>
        <XButton size='small'>small</XButton>
        <XButton size='large'>large</XButton>
      </div>
      <div class='flex'>
        <XButton disabled>disabled</XButton>
        <XButton loading>loading</XButton>
      </div>

      <div>
        <XButton color={color()} onClick={() => setColor('gray')}>
          点击改变color
        </XButton>
      </div>
    </div>
  )
}
