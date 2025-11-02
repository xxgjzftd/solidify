export default function Checkbox() {
  const [checked, setChecked] = createSignal(false)
  const { execute, store } = createAjax(
    '/mailihome/business/department',
    'get',
    { query: {} },
  )
  void execute()
  return (
    <div class='flex items-center gap-2'>
      <span>checked: {checked()}</span>
      <XCheckbox indeterminate onChange={setChecked} value={checked()} />

      <For each={store.data}>{(it) => <span>{it.name}</span>}</For>
    </div>
  )
}
