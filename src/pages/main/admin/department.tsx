export default function () {
  const departmentGlue = createListDetailGlue()
  const departmentMemberGlue = createListDetailGlue()
  const departmentDepartmentMemberGlue = createListListGlue()

  return (
    <>
      <XTableRemote
        ajax={createAjax('/mailihome/business/department', 'get', {
          query: {},
        })}
        columns={[
          ...departmentTableRemoteColumns.select(['名称', '上级部门', '备注']),
          {
            children: (row) => (
              <div class='flex gap-2'>
                <XReconfirm
                  confirm={() =>
                    departmentGlue.remove(() =>
                      request('/mailihome/business/department', 'delete', {
                        query: { id: row.id! },
                      }),
                    )
                  }
                />

                <XButton
                  onClick={() => {
                    departmentDepartmentMemberGlue.edit(row.id!)
                  }}
                  type='text'>
                  成员
                </XButton>
                <XButton
                  onClick={() => {
                    departmentGlue.edit(row.id!)
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
          departmentGlue.table = e
        }}
        operation={() => (
          <XButton
            onClick={() => {
              departmentGlue.create()
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
          departmentGlue.mutate('visible', false)
        }}
        title='详情'
        ui={{ container: 'h-2/3' }}
        visible={departmentGlue.store.visible}>
        <div class='flex flex-1 flex-col overflow-hidden'>
          <XTooltip title='基本信息' />
          <XFormRemote
            ajax={createAjax(
              '/mailihome/business/department/{departmentId}',
              'get',
              { data: {}, path: { departmentId: 0 } },
            )}
            defer
            expose={(e) => {
              departmentGlue.form = e
            }}
            labelWidth='100px'
            onPrepare={({ mutate }) => {
              mutate('path', 'departmentId', departmentGlue.store.id)
            }}
            ui='mt-4 flex flex-1 flex-col overflow-hidden'>
            {(ajax) => (
              <>
                <div class='flex-1 overflow-auto'>
                  {departmentFormRemoteItems
                    .select(['名称', '上级部门', '备注'])
                    .render(ajax)}
                </div>
                <div class='mt-2'>
                  <div class='h-px bg-gray-300' />
                  <div class='flex justify-end pt-2'>
                    <XButtonAsync
                      action={() =>
                        departmentGlue.save(() =>
                          request(
                            '/mailihome/business/department',
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
      </XDialog>

      <XDialog
        onClose={() => {
          departmentDepartmentMemberGlue.mutate('visible', false)
        }}
        title='详情'
        ui={{ container: 'h-2/3' }}
        visible={departmentDepartmentMemberGlue.store.visible}>
        <div class='flex flex-1 flex-col overflow-hidden'>
          <XTooltip title='部门成员' />
          <XTableRemote
            ajax={createAjax('/mailihome/business/department/member', 'get', {
              query: {},
            })}
            columns={[
              ...departmentMemberTableRemoteColumns.select([
                '用户',
                '主管',
                '备注',
              ]),
              {
                children: (row) => (
                  <div class='flex gap-2'>
                    <XReconfirm
                      confirm={() =>
                        departmentMemberGlue.remove(() =>
                          request(
                            '/mailihome/business/department/member',
                            'delete',
                            { query: { id: row.id! } },
                          ),
                        )
                      }
                    />
                    <XButton
                      onClick={() => {
                        departmentMemberGlue.edit(row.id!)
                      }}
                      type='text'>
                      编辑
                    </XButton>
                  </div>
                ),
                label: '操作',
              },
            ]}
            defer
            expose={(e) => {
              departmentMemberGlue.table = e
              departmentDepartmentMemberGlue.child = e
            }}
            onPrepare={({ mutate }) => {
              mutate(
                'query',
                'departmentId',
                departmentDepartmentMemberGlue.store.id,
              )
            }}
            operation={() => (
              <XButton
                onClick={() => {
                  departmentMemberGlue.create()
                }}>
                <IconHeroiconsPlus />
                <span>添加</span>
              </XButton>
            )}
            pagination
            ui={{ container: 'mt-4 flex-1' }}
          />
        </div>
      </XDialog>

      <XDialog
        onClose={() => {
          departmentMemberGlue.mutate('visible', false)
        }}
        title='详情'
        ui={{ container: 'w-8/12!' }}
        visible={departmentMemberGlue.store.visible}>
        <div class='flex flex-1 flex-col overflow-hidden'>
          <XTooltip title='基本信息' />
          <XFormRemote
            ajax={createAjax(
              '/mailihome/business/department/member/{departmentMemberId}',
              'get',
              { data: {}, path: { departmentMemberId: 0 } },
            )}
            defer
            expose={(e) => {
              departmentMemberGlue.form = e
            }}
            labelWidth='100px'
            onPrepare={({ mutate }) => {
              mutate(
                'path',
                'departmentMemberId',
                departmentMemberGlue.store.id,
              )
            }}
            ui='mt-4 flex flex-1 flex-col overflow-hidden'>
            {(ajax) => (
              <>
                <div class='flex-1 overflow-auto'>
                  {departmentMemberFormRemoteItems
                    .select(['用户', '主管', '备注'])
                    .render(ajax)}
                </div>
                <div class='mt-2'>
                  <div class='h-px bg-gray-300' />
                  <div class='flex justify-end pt-2'>
                    <XButtonAsync
                      action={() =>
                        departmentMemberGlue.save(() =>
                          request(
                            '/mailihome/business/department/member',
                            ajax.store.data.id ? 'put' : 'post',
                            {
                              payload: Object.assign(
                                {
                                  department: {
                                    id: departmentDepartmentMemberGlue.store.id,
                                  },
                                },
                                ajax.store.data,
                              ),
                            },
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
      </XDialog>
    </>
  )
}
