export default function Form() {
  const [inline, setInline] = createSignal(false)
  const [disabled, setDisabled] = createSignal(false)
  const [store, setStore] = createStore(
    {} as { prop1?: string; prop2?: string; prop3?: number },
  )

  let form: XFormExpose
  const submit = () => {
    if (form.validate()) {
      message.tooltip({ color: 'green', title: '提交成功' })
    }
  }
  return (
    <div class='flex flex-col gap-4'>
      <div>
        <XButton
          onClick={() => {
            setInline((v) => !v)
          }}>
          切换inline
        </XButton>
        <XButton
          onClick={() => {
            form.reset()
          }}>
          reset
        </XButton>
        <XButton
          onClick={() => {
            setDisabled((v) => !v)
          }}>
          切换disabled
        </XButton>
      </div>
      <XForm
        disabled={disabled()}
        expose={(e) => {
          form = e
        }}
        inline={inline()}>
        <XFormItem label='prop1' required>
          <XInput
            clearable
            enabled
            onInput={(v) => {
              setStore('prop1', v)
            }}
            placeholder='请输入prop1'
            value={store.prop1}
          />
        </XFormItem>
        <XFormItem
          label='prop2'
          required
          validator={() => {
            if (!store.prop2) {
              return 'prop2不能为空'
            } else if (store.prop2.length < 6) {
              return 'prop2不能少于6位'
            }
          }}>
          <XInput
            onInput={(v) => {
              setStore('prop2', v)
            }}
            value={store.prop2}
          />
        </XFormItem>
        <XFormItem
          label='prop3'
          validator={() => {
            if (
              store.prop1?.length &&
              store.prop1.length < 3 &&
              store.prop3 !== 1
            ) {
              return 'prop1长度小于3时，prop3必须为1'
            }
          }}>
          <XSelect
            data={[
              { id: 1, name: 'option 1' },
              { id: 2, name: 'option 2' },
              { id: 3, name: 'option 3' },
            ]}
            factory={(it) => ({ label: it.name, value: it.id })}
            onChange={(v) => {
              setStore('prop3', v)
            }}
            value={store.prop3}
          />
        </XFormItem>
        <XButton onClick={submit} ui={inline() ? 'ml-4' : ''}>
          提交
        </XButton>
      </XForm>

      <XFormRemote
        ajax={createAjax(
          '/mailihome/business/department/{departmentId}',
          'get',
          { data: {}, path: { departmentId: 0 } },
        )}
        onPrepare={({ mutate }) => {
          mutate('path', 'departmentId', 1)
        }}>
        {(ajax) => (
          <>
            <XFormItem label='名称' required>
              <XInput
                onInput={(value) => {
                  ajax.mutate('data', 'name', value)
                }}
                value={ajax.store.data.name}
              />
            </XFormItem>
            <XFormItem label='上级部门'>
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
            </XFormItem>
            <XFormItem label='备注'>
              <XInput
                onInput={(value) => {
                  ajax.mutate('data', 'comment', value)
                }}
                value={ajax.store.data.comment}
              />
            </XFormItem>
          </>
        )}
      </XFormRemote>
    </div>
  )
}
