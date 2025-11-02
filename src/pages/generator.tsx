import type {
  ArraySubtype,
  ObjectSubtype,
  OpenAPI3,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  ResponseObject,
  SchemaObject,
} from 'openapi-typescript'

interface Field {
  multiple: boolean
  prop: string
  title: string
  type: string
}

export default function () {
  const [api, setApi] = createSignal<OpenAPI3>({
    info: { title: '', version: '' },
    openapi: '',
  })
  void fetch('/v3/api-docs').then((res) => res.json().then(setApi))

  const paths = createMemo(() =>
    Object.entries(api().paths ?? {})
      .filter(([, operations]: [string, PathItemObject]) => operations.get)
      .map(([path]) => path),
  )

  const [path, setPath] = createSignal<string>()
  const pascal = createMemo(() =>
    path() ? resolvePascalCaseFromPath(path()!) : '',
  )
  const camel = createMemo(() =>
    path() ? resolveCamelCaseFromPath(path()!) : '',
  )
  const idName = createMemo(() =>
    path() ? resolveIdNameFromPath(path()!) : '',
  )

  const resolvePathFromDtoName = (dtoName: string) =>
    Object.entries(api().paths!).find(
      ([path, operations]: [string, PathItemObject]) =>
        operations.get?.operationId?.startsWith('list') &&
        resolveDtoNameFromPath(path) === dtoName,
    )?.[0]

  const resolveSchemaNameFromRef = (ref: string): string =>
    ref.replace(/.+\//, '')

  const resolveDtoNameFromPath = (path: string) =>
    resolveSchemaNameFromRef(
      (
        (
          ((api().paths![path] as PathItemObject).get as OperationObject)
            .responses?.['200'] as ResponseObject
        ).content?.['*/*']?.schema as ReferenceObject
      ).$ref,
    ).replace('DataResponse', '')

  const resolveSearchingRequestNameFromPath = (path: string) =>
    resolveSchemaNameFromRef(
      (
        (
          ((api().paths![path] as PathItemObject).get as OperationObject)
            .parameters?.[0] as ParameterObject
        ).schema as unknown as ReferenceObject
      ).$ref,
    )

  const resolveDtoFromPath = (path: string) =>
    api().components?.schemas?.[resolveDtoNameFromPath(path)]

  const resolveSearchingRequestFromPath = (path: string) =>
    api().components?.schemas?.[resolveSearchingRequestNameFromPath(path)]

  const resolveFieldTypeFromPropConfig: (
    config: ReferenceObject | SchemaObject,
  ) => string = (config) =>
    (config as ReferenceObject).$ref
      ? resolveSchemaNameFromRef((config as ReferenceObject).$ref)
      : (config as { type: string }).type === 'array'
        ? resolveFieldTypeFromPropConfig((config as ArraySubtype).items)
        : (config as SchemaObject).format?.startsWith('date')
          ? 'date'
          : (config as { type: string }).type === 'integer'
            ? 'number'
            : (config as { type: string }).type

  const convertObjectSubtype2Fields = (dto: ObjectSubtype) =>
    Object.entries(dto.properties ?? {}).map(([prop, config]) => ({
      multiple: (config as { type: string }).type === 'array',
      prop,
      title: (config as SchemaObject).title ?? prop,
      type: resolveFieldTypeFromPropConfig(config),
    }))

  const fields = createMemo(() =>
    path()
      ? convertObjectSubtype2Fields(
          resolveDtoFromPath(path()!) as ObjectSubtype,
        )
      : [],
  )
  const [checkedProps, setCheckedProps] = createSignal<string[]>([])
  const defaultIgnoredProps = [
    'id',
    'preparedBy',
    'preparedDatetime',
    'modifiedBy',
    'modifiedDatetime',
  ]
  createEffect(
    on(fields, () => {
      setCheckedProps(
        fields()
          .filter((item) => !defaultIgnoredProps.includes(item.prop))
          .map((item) => item.prop),
      )
    }),
  )
  const checkedFields = createMemo(() =>
    fields().filter((item) => checkedProps().includes(item.prop)),
  )

  const [output, setOutput] = createSignal<string>()

  const resolveCamelCaseFromPath = (path: string) =>
    path
      .replace('/mailihome/', '')
      .replace(/\/(\S)/g, (_, s: string) => s.toUpperCase())

  const resolvePascalCaseFromPath = (path: string) =>
    resolveCamelCaseFromPath(path).replace(/^\S/, (s) => s.toUpperCase())

  const resolveIdNameFromPath = (path: string) =>
    resolveDtoNameFromPath(path)
      .replace(/Dto$/, 'Id')
      .replace(/^\S/, (s) => s.toLowerCase())

  const generateTableRemoteColumns =
    () => `export const ${camel()}TableRemoteColumns = createTableRemoteColumns('${path()!}', [
    ${checkedFields().map(generateTableRemoteColumn).join(',\n  ')}
  ])`

  const generateFormRemoteItems =
    () => `export const ${camel()}FormRemoteItems = createFormRemoteItems('${path()!}/{${idName()}}', [
    ${checkedFields().map(generateFormRemoteItem).join(',\n  ')}
  ])`

  const generateBusinessTsx = () => `${generateTableRemoteColumns()}
  
  ${generateFormRemoteItems()}
`

  const generateClassicalPage = () => `export default function () {
  const ${camel()}Glue = createListDetailGlue()

  return (
    <>
      <XTableRemote
        ajax={createAjax('${path()!}', 'get', { query: {} })}
        columns={[
          ...${camel()}TableRemoteColumns.select([]),
          {
            children: (row) => (
              <div class='flex gap-2'>
                <XReconfirm
                  confirm={() =>
                    ${camel()}Glue.remove(() =>
                      request('${path()!}', 'delete', {
                        query: { id: row.id! },
                      }),
                    )
                  }
                />
                <XButton
                  onClick={() => {
                    ${camel()}Glue.edit(row.id!)
                  }}
                  type='text'>
                  编辑
                </XButton>
              </div>
            ),
            label: '操作',
          },
        ]}
        expose={(e) => {
          ${camel()}Glue.table = e
        }}
        operation={() => (
          <XButton
            onClick={() => {
              ${camel()}Glue.create()
            }}>
            <IconHeroiconsPlus />
            <span>添加</span>
          </XButton>
        )}
        pagination
        ui={{ container: 'flex-1' }}
      />

      <XDialog
        onClose={() => {
          ${camel()}Glue.mutate('visible', false)
        }}
        title='详情'
        visible={${camel()}Glue.store.visible}>
        <div class='flex flex-1 flex-row overflow-hidden'>
          <div class='flex flex-1 flex-col overflow-hidden px-4'>
            <XTooltip title='基本信息' />
            <XFormRemote
              ajax={createAjax('${path()!}/{${idName()}}', 'get', {
                data: { },
                path: { ${idName()}: 0 },
              })}
              defer
              expose={(e) => {
                ${camel()}Glue.form = e
              }}
              labelWidth='100px'
              onPrepare={({ mutate }) => {
                mutate('path', '${idName()}', ${camel()}Glue.store.id)
              }}
              ui='mt-4 flex flex-1 flex-col overflow-hidden'>
              {(ajax) => (
                <>
                  <div class='flex-1 overflow-auto'>
                    {${camel()}FormRemoteItems
                      .select([])
                      .render(ajax)}
                  </div>
                  <div class='mt-2'>
                    <div class='h-px bg-gray-300' />
                    <div class='flex justify-end pt-2'>
                      <XButtonAsync
                        action={() =>
                          ${camel()}Glue.save(() =>
                            request(
                              '${path()!}',
                              ajax.store.data.id ? 'put' : 'post',
                              { payload: ajax.store.data },
                            ),
                          )
                        }>
                        保存
                      </XButtonAsync>
                    </div>
                  </div>
                </>
              )}
            </XFormRemote>
          </div>
          <div class='flex flex-1 flex-col overflow-hidden px-4' />
        </div>
        <div class='h-4' />
      </XDialog>
    </>
  )
}
`

  // todo
  const generateBatchPage = () => {
    if (!candidateField() || !parentField()) return ``

    const candidatePath = resolvePathFromDtoName(candidateField()!.type)!
    const candidateCamel = resolveCamelCaseFromPath(candidatePath)
    const candidatePascal = resolvePascalCaseFromPath(candidatePath)

    return `
  const ${camel()}Glue = useBatchGlue<components['schemas']['${pascal()}Dto'], components['schemas']['${candidateField()!.type}']>()
  
  const ${pascal()}TableRemote = () => (
    <XTableRemote
      pagination
      ref={${camel()}Glue.table}
      ajax={() => useAjax('${path()!}', 'get', { query: {} }, { immediate: false })}
      onPrepare={({ query }) => (query.${parentField()!.prop}Id = id.value)}
      columns={[
        ...${camel()}TableRemoteColumns.select([]),
        {
          label: '操作',
          width: 300,
          content: ({ row }) => (
            <>
              {['P'].includes(dto.value?.status?.code!) && (
                <XReconfirm
                  confirm={() =>
                    ${camel()}Glue.remove(() =>
                      useAjax('${path()!}', 'delete', { query: { id: row.id! } })
                    )
                  }
                />
              )}
            </>
          )
        }
      ]}
      operation={() => (
        <XButton
          type="primary"
          onClick={() => ${camel()}Glue.create()}
          disabled={!['P'].includes(dto.value?.status?.code!)}
        >
          <ElIcon>
            <Plus />
          </ElIcon>
          <span>添加</span>
        </XButton>
      )}
    />
  )
  
  const ${candidatePascal}TableRemote = () => (
    <XTableRemote
      pagination
      ref={${camel()}Glue.candidate}
      ajax={() => useAjax('${candidatePath}', 'get', { query: {} }, { immediate: false })}
      onPrepare={({ query }) => {
        query.exclude${parentField()!.prop.replace(/^\S/, (s) => s.toUpperCase())}Id = id.value
        query.excludeId = ${camel()}Glue.payload.value.map((item) => item.${
          candidateField()!.prop
        }?.id!)
      }}
      onSelectionChange={${camel()}Glue.onSelectionChange}
      columns={[
        { label: 'selection', type: 'selection' },
        ...${candidateCamel}TableRemoteColumns.select([])
      ]}
      operation={() => (
        <XButton
          type="primary"
          onClick={() =>
            ${camel()}Glue.payload.value.push(
              ...${camel()}Glue.selection.value.map((item) => ({ ${
                candidateField()!.prop
              }: item, ${parentField()!.prop}: { id: id.value } }))
            )
          }
        >
          <ElIcon>
            <Plus />
          </ElIcon>
          <span>添加</span>
        </XButton>
      )}
    />
  )
  
  const ${pascal()}ButtonSave = () => (
    <XButtonAsync
      type="primary"
      action={() =>
        ${camel()}Glue.save(() =>
          useAjax('${path()!}', 'post', { payload: ${camel()}Glue.payload })
        )
      }
    >
      保存
    </XButtonAsync>
  )
  
  const ${pascal()}TableEdit = () => (
    <XTable
      id="${path()!}"
      data={${camel()}Glue.payload.value}
      columns={[
        ${checkedFields().map(generateTableColumn).join(',\n')},
        {
          label: '操作',
          content: ({ index }) => (
            <XButton link type="danger" onClick={() => ${camel()}Glue.payload.value.splice(index, 1)}>
              删除
            </XButton>
          )
        }
      ]}
    />
  )`
  }

  const [candidateField, setCandidateField] = createSignal<Field>()
  const [parentField, setParentField] = createSignal<Field>()
  const GenerateBatchPageButton = () => (
    <XReconfirm
      confirm={() => {
        generate(generateBatchPage)
      }}
      message={
        <>
          <span>candidate field:</span>
          <XSelect
            data={fields()}
            factory={(it) => ({ label: it.title, value: it })}
            identify={(value) => value.prop}
            onChange={(value) => setCandidateField(value)}
            value={candidateField()}
          />
          <span>parent field:</span>
          <XSelect
            data={fields()}
            factory={(item) => ({ label: item.title, value: item })}
            identify={(value) => value.prop}
            onChange={(value) => setParentField(value)}
            value={parentField()}
          />
        </>
      }>
      <XButton>生成batch页面</XButton>
    </XReconfirm>
  )

  const generate = (generator: () => string) => {
    setOutput(generator())
    void navigator.clipboard.writeText(output()!).then(() => {
      message.tooltip({ title: '生成内容已复制' })
    })
  }

  const generateTableColumn = (field: Field) => {
    let jsx = ''
    switch (field.type) {
      case 'date':
        // todo
        jsx = `row.${field.prop} && useDateFormat(row.${field.prop}, 'YYYY-MM-DD HH:mm:ss').value`
        break
      case 'LookupDto':
        // todo
        jsx = `<XSelectRemote
          ajax={() =>
            createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
              path: { lookupType: 'lookupType' },
            })
          }
          factory={(it) => ({ label: it.message, value: it.code })}
          onChange={(value) => {
            ajax.mutate('query', 'type', value)
          }}
          value={ajax.store.query.type}
        />`
        break
      case 'number':
        // todo
        jsx = `<XInputNumber size="small" value={row.${field.prop}} onChange={(value) => (row.${field.prop} = value)} />`
        break
      default:
        jsx = `row.${field.prop}`
    }
    return `{ children: (row) => ${jsx}, label: '${field.title}' },`
  }

  const generateTableRemoteColumn = (field: Field) => {
    let jsx = ''
    if (field.multiple) {
      jsx = `<For each={row.${field.prop}}>{(it) => <XTag>{it.name}</XTag>}</For>`
    } else {
      switch (field.type) {
        case 'date':
          // todo
          jsx = `row.${field.prop} && useDateFormat(row.${field.prop}, 'YYYY-MM-DD HH:mm:ss').value`
          break
        case 'LookupDto':
          jsx = `<XTagLookup lookup={row.${field.prop}!} />`
          break
        default:
          jsx = `row.${field.prop}`
          break
      }
    }
    const searchFields = convertObjectSubtype2Fields(
      resolveSearchingRequestFromPath(path()!) as ObjectSubtype,
    )
    const searchField = searchFields.find(
      (item) => item.prop.replace(/(Id|Start|End)$/, '') === field.prop,
    )
    let searchJsx = ''
    if (searchField) {
      switch (field.type) {
        case 'date':
          // todo
          searchJsx = `<XDatePickerRange type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期" start={query.${field.prop}Start} onUpdate:start={(value) => (query.${field.prop}Start = value)} end={query.${field.prop}End} onUpdate:end={(value) => (query.${field.prop}End = value)} />`
          break
        case 'LookupDto':
          searchJsx = `<XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'lookupType' },
          })}
          factory={(it) => ({ label: it.message, value: it.code })}
          onChange={(value) => {
            ajax.mutate('query', '${field.prop}', value)
          }}
          value={ajax.store.query.${field.prop}}
        />`
          break
        case 'string':
          searchJsx = `<XInput
          onInput={(value) => {
            ajax.mutate('query', '${field.prop}', value)
          }}
          value={ajax.store.query.${field.prop}}
        />`
          break
        default:
          searchJsx = `<XSelectRemote
          ajax={createAjax('${resolvePathFromDtoName(
            field.type,
          )!}', 'get', { query: {} })}
          factory={(it) => ({ label: it.name, value: it.id! })}
          onChange={(value) => {
            ajax.mutate('query', '${field.prop}Id', value)
          }}
          onPrepare={({ mutate }, input) => {
            mutate('query', 'quickSearch', input)
          }}
          value={ajax.store.query.${field.prop}Id}
        />`
          break
      }
    }
    const search = searchField ? `(ajax) => (${searchJsx})` : ''
    return `{ children: (row) => ${jsx}, label: '${field.title}'${
      search ? ', search: ' + search : ''
    } }`
  }

  const generateFormRemoteItem = (field: Field) => {
    let jsx = ''
    switch (field.type) {
      case 'date':
        // todo
        jsx = `<XDatePicker value-format="YYYY-MM-DD" value={data.${field.prop}} onChange={(value) => (data.${field.prop} = value)} />`
        break
      case 'LookupDto':
        jsx = `<XSelectRemote
          ajax={createAjax('/mailihome/common/lookup/{lookupType}', 'get', {
            path: { lookupType: 'lookupType' },
          })}
          factory={(it) => ({ label: it.message, value: it })}
          identify={(value) => value.code}
          onChange={(value) => {
            ajax.mutate('data', '${field.prop}', value)
          }}
          value={ajax.store.data.${field.prop}}
        />`
        break
      case 'number':
        // todo
        jsx = `<XInputNumber value={data.${field.prop}} onChange={(value) => (data.${field.prop} = value)} />`
        break
      case 'string':
        jsx = `<XInput
          onInput={(value) => {
            ajax.mutate('data', '${field.prop}', value)
          }}
          value={ajax.store.data.${field.prop}}
        />`
        break
      default:
        jsx = `<XSelectRemote
          ajax={createAjax('${resolvePathFromDtoName(
            field.type,
          )!}', 'get', { query: {} })}
          factory={(it) => ({ label: it.name, value: it })}
          identify={(value) => value.id!}${field.multiple ? '\nmultiple' : ''}
          onChange={(value) => {
            ajax.mutate('data', '${field.prop}', value)
          }}
          onPrepare={({ mutate }, input) => {
            mutate('query', 'quickSearch', input)
          }}
          supplement={(lacks) => lacks}
          value={ajax.store.data.${field.prop}}
        />`
        break
    }
    return `{ children: (ajax) => (${jsx}), label: '${field.title}' }`
  }

  return (
    <div class='flex h-full flex-col overflow-hidden px-4 py-3'>
      <XSelect
        data={paths()}
        factory={(it) => ({ label: it, value: it })}
        onChange={(value) => {
          setPath(value)
        }}
        value={path()}
      />

      <div class='flex gap-4'>
        <For each={fields()}>
          {(it) => (
            <label>
              <XCheckbox
                onChange={(value) => {
                  const copy = [...checkedProps()]
                  if (value) {
                    copy.push(it.prop)
                  } else {
                    copy.splice(copy.indexOf(it.prop), 1)
                  }
                  setCheckedProps(copy)
                }}
                value={checkedProps().includes(it.prop)}
              />
              {it.title}
            </label>
          )}
        </For>
      </div>

      <div class='mt-2 flex gap-2'>
        <XButton
          onClick={() => {
            generate(generateBusinessTsx)
          }}>
          生成业务组件
        </XButton>
        <XButton
          onClick={() => {
            generate(generateClassicalPage)
          }}>
          生成classical页面
        </XButton>
        <GenerateBatchPageButton />
      </div>

      <XTextarea
        onInput={(value) => setOutput(value)}
        rows={20}
        ui='mt-2'
        value={output()}
      />
    </div>
  )
}
