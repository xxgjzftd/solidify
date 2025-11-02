export default function Select() {
  interface Dto {
    id: number
    name: string
  }

  const [v1, setV1] = createSignal<number>()
  const [v2, setV2] = createSignal<Dto[]>([{ id: 99, name: 'option 99' }])

  const [data] = createSignal<Dto[]>([
    { id: 1, name: 'option 1' },
    { id: 2, name: 'option 2' },
    { id: 3, name: 'option 3' },
  ])

  const [department, setDepartment] =
    createSignal<components['schemas']['DepartmentDto']>()

  return (
    <div class='flex flex-col gap-4'>
      <span class='text-lg font-bold'>基础</span>
      <XSelect
        clearable
        data={data()}
        factory={(it) => ({ label: it.name, value: it.id })}
        onChange={(v) => setV1(v)}
        value={v1()}
      />

      <span class='text-lg font-bold'>禁用</span>
      <XSelect
        data={data()}
        disabled
        factory={(it) => ({ label: it.name, value: it.id })}
        value={v1()}
      />

      <span class='text-lg font-bold'>
        多选 自定义option显示 自定义选中项显示 对象value supplement
      </span>
      <XSelect
        data={data()}
        factory={(it) => ({
          content: (
            <span>
              {it.id} {it.name}
            </span>
          ),
          label: it.name,
          value: it,
        })}
        identify={(it) => it.id}
        multiple
        onChange={(v) => setV2(v ?? [])}
        placeholder='请选择'
        supplement={(lacks) => lacks}
        value={v2()}>
        {(selected) => (
          <For each={selected()}>
            {(it) => <span class='mr-1 text-cyan-500'>{it?.label}</span>}
          </For>
        )}
      </XSelect>

      <span class='text-lg font-bold'>remote</span>
      <XSelectRemote
        ajax={createAjax('/mailihome/business/department', 'get', {
          query: {},
        })}
        factory={(it) => ({ label: it.name, value: it })}
        identify={(value) => value.id!}
        onChange={(value) => setDepartment(value)}
        onPrepare={({ mutate }, input) => {
          mutate('query', 'quickSearch', input)
        }}
        supplement={(lacks) => lacks}
        value={department()}
      />
    </div>
  )
}
