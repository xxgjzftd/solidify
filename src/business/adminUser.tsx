export const adminUserTableRemoteColumns = createTableRemoteColumns(
  '/mailihome/business/admin/user',
  [
    {
      children: (row) => <XTagLookup lookup={row.type!} />,
      label: '类型',
      search: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'USERTYPE' },
          })}
          factory={(it) => ({ label: it.message, value: it.code })}
          onChange={(value) => {
            ajax.mutate('query', 'type', value)
          }}
          value={ajax.store.query.type}
        />
      ),
    },
    { children: (row) => row.username, label: '用户名' },
    {
      children: (row) => row.name,
      label: '昵称',
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
      children: (row) => <XTagLookup lookup={row.status!} />,
      label: '状态',
      search: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'RCSTAT' },
          })}
          factory={(it) => ({ label: it.message, value: it.code })}
          onChange={(value) => {
            ajax.mutate('query', 'status', value)
          }}
          value={ajax.store.query.status}
        />
      ),
    },
    {
      children: (row) => (
        <For each={row.roles}>{(it) => <XTag>{it.name}</XTag>}</For>
      ),
      label: '角色',
    },
  ],
)

export const adminUserFormRemoteItems = createFormRemoteItems(
  '/mailihome/business/admin/user/{userId}',
  [
    {
      children: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'USERTYPE' },
          })}
          factory={(it) => ({ label: it.message, value: it })}
          identify={(value) => value.code}
          onChange={(value) => {
            ajax.mutate('data', 'type', value)
          }}
          value={ajax.store.data.type}
        />
      ),
      label: '类型',
    },
    {
      children: (ajax) => (
        <XInput
          onInput={(value) => {
            ajax.mutate('data', 'username', value)
          }}
          value={ajax.store.data.username}
        />
      ),
      label: '用户名',
    },
    {
      children: (ajax) => (
        <XInput
          onInput={(value) => {
            ajax.mutate('data', 'password', value)
          }}
          value={ajax.store.data.password}
        />
      ),
      label: '密码',
    },
    {
      children: (ajax) => (
        <XInput
          onInput={(value) => {
            ajax.mutate('data', 'name', value)
          }}
          value={ajax.store.data.name}
        />
      ),
      label: '昵称',
    },
    {
      children: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'RCSTAT' },
          })}
          factory={(it) => ({ label: it.message, value: it })}
          identify={(value) => value.code}
          onChange={(value) => {
            ajax.mutate('data', 'status', value)
          }}
          value={ajax.store.data.status}
        />
      ),
      label: '状态',
    },
    {
      children: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/business/role', 'get', { query: {} })}
          factory={(it) => ({ label: it.name, value: it })}
          identify={(value) => value.id!}
          multiple
          onChange={(value) => {
            ajax.mutate('data', 'roles', value ?? [])
          }}
          onPrepare={({ mutate }, input) => {
            mutate('query', 'quickSearch', input)
          }}
          supplement={(lacks) => lacks}
          value={ajax.store.data.roles}
        />
      ),
      label: '角色',
    },
  ],
)
