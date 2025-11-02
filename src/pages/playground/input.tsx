export default function Input() {
  const [value, setValue] = createSignal('')
  const [number, setNumber] = createSignal(0)

  return (
    <div class='flex flex-col gap-4'>
      <span>基础input</span>
      <XInput onInput={setValue} value={value()} />

      <span>带清除和placeholder</span>
      <XInput
        clearable
        onInput={setValue}
        placeholder='请输入'
        value={value()}
      />

      <span>带placeholder和禁用</span>
      <XInput
        disabled
        onInput={setValue}
        placeholder='请输入'
        value={value()}
      />

      <span>number</span>
      <XInput onInput={setNumber} type='number' value={number()} />

      <span>带后缀和clearable</span>
      <XInput
        clearable
        onInput={setValue}
        suffix={<span>元</span>}
        value={value()}
      />

      <span>带后缀icon</span>
      <XInput
        onInput={setValue}
        suffix={<IconHeroiconsXCircle />}
        value={value()}
      />

      <span>修改props</span>
      <XInput
        onInput={setValue}
        suffix={<IconHeroiconsXCircle />}
        value={value()}
      />
    </div>
  )
}
