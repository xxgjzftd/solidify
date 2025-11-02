export const departmentTableRemoteColumns = createTableRemoteColumns(
  '/mailihome/business/department',
  [
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
  ],
)

export const departmentFormRemoteItems = createFormRemoteItems(
  '/mailihome/business/department/{departmentId}',
  [
    {
      children: (ajax) => (
        <XInput
          onInput={(value) => {
            ajax.mutate('data', 'name', value)
          }}
          value={ajax.store.data.name}
        />
      ),
      label: '名称',
    },
    {
      children: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/business/department', 'get', {
            query: {},
          })}
          factory={(it) => ({ label: it.name, value: it })}
          identify={(value) => value.id!}
          onChange={(value) => {
            ajax.mutate('data', 'parent', value)
          }}
          onPrepare={({ mutate }, input) => {
            mutate('query', 'quickSearch', input)
          }}
          supplement={(lacks) => lacks}
          value={ajax.store.data.parent}
        />
      ),
      label: '上级部门',
    },
    {
      children: (ajax) => (
        <XInput
          onInput={(value) => {
            ajax.mutate('data', 'comment', value)
          }}
          value={ajax.store.data.comment}
        />
      ),
      label: '备注',
    },
  ],
)
