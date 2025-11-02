export const departmentMemberTableRemoteColumns = createTableRemoteColumns(
  '/mailihome/business/department/member',
  [
    {
      children: (row) => row.department?.name,
      label: '部门',
      search: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/business/department', 'get', {
            query: {},
          })}
          factory={(it) => ({ label: it.name, value: it.id! })}
          onChange={(value) => {
            ajax.mutate('query', 'departmentId', value)
          }}
          onPrepare={({ mutate }, input) => {
            mutate('query', 'quickSearch', input)
          }}
          value={ajax.store.query.departmentId}
        />
      ),
    },
    {
      children: (row) => row.user?.name,
      label: '用户',
      search: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/business/user', 'get', { query: {} })}
          factory={(it) => ({ label: it.name, value: it.id! })}
          onChange={(value) => {
            ajax.mutate('query', 'userId', value)
          }}
          onPrepare={({ mutate }, input) => {
            mutate('query', 'quickSearch', input)
          }}
          value={ajax.store.query.userId}
        />
      ),
    },
    {
      children: (row) => <XTagLookup lookup={row.manager!} />,
      label: '主管',
      search: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'FLAG' },
          })}
          factory={(it) => ({ label: it.message, value: it.code })}
          onChange={(value) => {
            ajax.mutate('query', 'manager', value)
          }}
          value={ajax.store.query.manager}
        />
      ),
    },
    { children: (row) => row.comment, label: '备注' },
  ],
)

export const departmentMemberFormRemoteItems = createFormRemoteItems(
  '/mailihome/business/department/member/{departmentMemberId}',
  [
    {
      children: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/business/department', 'get', {
            query: {},
          })}
          factory={(it) => ({ label: it.name, value: it })}
          identify={(value) => value.id!}
          onChange={(value) => {
            ajax.mutate('data', 'department', value)
          }}
          onPrepare={({ mutate }, input) => {
            mutate('query', 'quickSearch', input)
          }}
          supplement={(lacks) => lacks}
          value={ajax.store.data.department}
        />
      ),
      label: '部门',
    },
    {
      children: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/business/user', 'get', { query: {} })}
          factory={(it) => ({ label: it.name, value: it })}
          identify={(value) => value.id!}
          onChange={(value) => {
            ajax.mutate('data', 'user', value)
          }}
          onPrepare={({ mutate }, input) => {
            mutate('query', 'quickSearch', input)
          }}
          supplement={(lacks) => lacks}
          value={ajax.store.data.user}
        />
      ),
      label: '用户',
    },
    {
      children: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'FLAG' },
          })}
          factory={(it) => ({ label: it.message, value: it })}
          identify={(value) => value.code}
          onChange={(value) => {
            ajax.mutate('data', 'manager', value)
          }}
          value={ajax.store.data.manager}
        />
      ),
      label: '主管',
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
