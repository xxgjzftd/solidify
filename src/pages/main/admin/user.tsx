export default function () {
  const adminUserGlue = createListDetailGlue()

  return (
    <>
      <XTableRemote
        ajax={createAjax('/mailihome/business/admin/user', 'get', {
          query: {},
        })}
        columns={[
          ...adminUserTableRemoteColumns.select([
            '昵称',
            '状态',
            '用户名',
            '类型',
            '角色',
          ]),
          {
            children: (row) => (
              <div class='flex gap-2'>
                <XReconfirm
                  confirm={() =>
                    adminUserGlue.remove(() =>
                      request('/mailihome/business/admin/user', 'delete', {
                        query: { id: row.id! },
                      }),
                    )
                  }
                />
                <XButton
                  onClick={() => {
                    adminUserGlue.edit(row.id!)
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
          adminUserGlue.table = e
        }}
        operation={() => (
          <XButton
            onClick={() => {
              adminUserGlue.create()
            }}>
            <IconHeroiconsPlus />
            <span>添加</span>
          </XButton>
        )}
        pagination
        ui={{ container: 'h-full' }}
      />

      <XDialog
        onClose={() => {
          adminUserGlue.mutate('visible', false)
        }}
        title='详情'
        visible={adminUserGlue.store.visible}>
        <div class='flex flex-1 flex-row overflow-hidden'>
          <div class='flex flex-1 flex-col overflow-hidden px-4'>
            <XTooltip title='基本信息' />
            <XFormRemote
              ajax={createAjax(
                '/mailihome/business/admin/user/{userId}',
                'get',
                { data: { accessRights: [], roles: [] }, path: { userId: 0 } },
              )}
              defer
              expose={(e) => {
                adminUserGlue.form = e
              }}
              labelWidth='100px'
              onPrepare={({ mutate }) => {
                mutate('path', 'userId', adminUserGlue.store.id)
              }}
              ui='mt-4 flex flex-1 flex-col overflow-hidden'>
              {(ajax) => (
                <>
                  <div class='flex-1 overflow-auto'>
                    {adminUserFormRemoteItems
                      .select([
                        '昵称',
                        '状态',
                        '用户名',
                        '密码',
                        '类型',
                        '角色',
                      ])
                      .render(ajax)}
                  </div>
                  <div class='mt-2 flex justify-end border-t pt-2'>
                    <XButtonAsync
                      action={() =>
                        adminUserGlue.save(() =>
                          request(
                            '/mailihome/business/admin/user',
                            ajax.store.data.id ? 'put' : 'post',
                            { payload: ajax.store.data },
                          ),
                        )
                      }>
                      保存
                    </XButtonAsync>
                  </div>
                </>
              )}
            </XFormRemote>
          </div>
        </div>
        <div class='h-4' />
      </XDialog>
    </>
  )
}
