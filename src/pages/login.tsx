export default function () {
  const { execute, mutate, store } = createAjax(
    '/mailihome/business/security/authenticate',
    'post',
    { payload: { keepSignedIn: true, password: '', username: '' } },
  )

  const navigate = useNavigate()
  let form: XFormExpose
  const submit = async () => {
    if (form.validate()) {
      await execute()
      navigate(-1)
    }
  }
  return (
    <div class='flex h-full flex-col overflow-hidden px-4 py-3'>
      <XForm
        expose={(e) => {
          form = e
        }}>
        <XFormItem
          label='用户名'
          required
          validator={() => {
            if (!store.payload.username) {
              return '用户名不能为空'
            }
          }}>
          <XInput
            onInput={(value) => {
              mutate('payload', 'username', value)
            }}
            value={store.payload.username}
          />
        </XFormItem>
        <XFormItem label='密码' required>
          <XInput
            onInput={(value) => {
              mutate('payload', 'password', value)
            }}
            type='password'
            value={store.payload.password}
          />
        </XFormItem>
        <div class='flex justify-end'>
          <XButtonAsync action={submit}>提交</XButtonAsync>
        </div>
      </XForm>
    </div>
  )
}
