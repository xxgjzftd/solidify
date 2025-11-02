import { A } from '@solidjs/router'

export const constructionGuidanceTableRemoteColumns = createTableRemoteColumns(
  '/mailihome/construction/guidance',
  [
    {
      children: (row) => row.serialNo,
      label: '编号',
      search: (ajax) => (
        <XInput
          onInput={(value) => {
            ajax.mutate('query', 'serialNo', value)
          }}
          value={ajax.store.query.serialNo}
        />
      ),
    },
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
      children: (row) => <XTagLookup lookup={row.type!} />,
      label: '种类',
      search: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'CSTRGDTYPE' },
          })}
          factory={(it) => ({ label: it.message, value: it.code })}
          onChange={(value) => {
            ajax.mutate('query', 'type', value)
          }}
          value={ajax.store.query.type}
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
        <For each={row.attachment}>{(it) => <A href={it}>{it}</A>}</For>
      ),
      label: '附件',
    },
    {
      children: (row) => (
        <For each={row.steps}>{(it) => <XTag>{it.comment}</XTag>}</For>
      ),
      label: '步骤',
    },
    { children: (row) => row.comment, label: '备注' },
  ],
)

export const constructionGuidanceFormRemoteItems = createFormRemoteItems(
  '/mailihome/construction/guidance/{constructionGuidanceId}',
  [
    {
      children: (ajax) => (
        <XInput
          disabled
          onInput={(value) => {
            ajax.mutate('data', 'serialNo', value)
          }}
          value={ajax.store.data.serialNo}
        />
      ),
      label: '编号',
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
      label: '名称',
    },
    {
      children: (ajax) => (
        <XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'CSTRGDTYPE' },
          })}
          factory={(it) => ({ label: it.message, value: it })}
          identify={(value) => value.code}
          onChange={(value) => {
            ajax.mutate('data', 'type', value)
          }}
          value={ajax.store.data.type}
        />
      ),
      label: '种类',
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
        <XUploadAliyun
          multiple
          onChange={(value) => {
            ajax.mutate('data', 'attachment', value ?? [])
          }}
          value={ajax.store.data.attachment}
        />
      ),
      label: '附件',
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
