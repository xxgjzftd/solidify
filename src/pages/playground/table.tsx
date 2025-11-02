interface Dto {
  age: number
  gender: string
  id: number
  name: string
}

export default function Table() {
  const [data, setData] = createSignal<Dto[]>([])
  const refresh = () => {
    setData(
      Array.from({ length: 10 }, (_, i) => ({
        age: Math.floor(Math.random() * 50) + 20,
        gender: Math.random() < 0.5 ? 'Male' : 'Female',
        id: i + 1,
        name: `Name ${(i + 1).toString()}`,
      })),
    )
  }

  refresh()

  const onSelectionChange = (selection: Dto[]) => {
    console.log(selection)
  }
  return (
    <div class='flex h-full w-full flex-col gap-4 overflow-hidden'>
      <XTable
        columns={[
          { label: 'selection', type: 'selection' },
          { children: (row) => row.id, label: 'ID' },
          { children: (row) => row.name, label: 'Name' },
          { children: (row) => row.age, label: 'Age', width: 1500 },
          { children: (row) => row.gender, label: 'Gender', width: 1000 },
        ]}
        data={data()}
        id='/playground/table/basic'
        onSelectionChange={onSelectionChange}
        ui='flex-1'
      />

      <XTableRemote
        ajax={createAjax('/mailihome/business/department', 'get', {
          query: {},
        })}
        columns={[
          {
            children: (row) => row.name,
            label: '名称',
            search: (ajax) => (
              <XInput
                onInput={(value) => {
                  ajax.mutate('query', 'name', value)
                }}
                value={ajax.store.query.name}
              />
            ),
          },
          {
            children: (row) => row.parent?.name,
            label: '上级部门',
            search: (ajax) => (
              <XSelectRemote
                ajax={createAjax('/mailihome/business/department', 'get', {
                  query: {},
                })}
                factory={(it) => ({ label: it.name, value: it.id! })}
                onChange={(value) => {
                  ajax.mutate('query', 'parentId', value)
                }}
                onPrepare={({ mutate }, input) => {
                  mutate('query', 'quickSearch', input)
                }}
                value={ajax.store.query.parentId}
              />
            ),
          },
          { children: (row) => row.comment, label: '备注' },
        ]}
        ui={{ container: 'flex-1' }}
      />
    </div>
  )
}
