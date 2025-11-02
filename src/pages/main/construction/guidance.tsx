export default function () {
  const constructionGuidanceGlue = createListDetailGlue()

  const [visible, setVisible] = createSignal(false)
  const [stepIndex, setStepIndex] = createSignal(0)
  const [step, setStep] = createStore(
    {} as components['schemas']['ConstructionGuidanceStepDto'],
  )
  let stepForm: undefined | XFormExpose
  const createStep = (index: number) => {
    batch(() => {
      stepForm?.reset()
      setVisible(true)
      setStep(reconcile({}))
      setStepIndex(index)
    })
  }
  const editStep = (
    _step: components['schemas']['ConstructionGuidanceStepDto'],
    index: number,
  ) => {
    batch(() => {
      stepForm?.reset()
      setVisible(true)
      setStep(_step)
      setStepIndex(index)
    })
  }

  return (
    <>
      <XTableRemote
        ajax={createAjax('/mailihome/construction/guidance', 'get', {
          query: {},
        })}
        columns={[
          ...constructionGuidanceTableRemoteColumns.select([
            '编号',
            '名称',
            '种类',
            '状态',
            '步骤',
            '附件',
            '备注',
          ]),
          {
            children: (row) => (
              <div class='flex gap-2'>
                <XReconfirm
                  confirm={() =>
                    constructionGuidanceGlue.remove(() =>
                      request('/mailihome/construction/guidance', 'delete', {
                        query: { id: row.id! },
                      }),
                    )
                  }
                />
                <XButton
                  onClick={() => {
                    constructionGuidanceGlue.edit(row.id!)
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
          constructionGuidanceGlue.table = e
        }}
        operation={() => (
          <XButton
            onClick={() => {
              constructionGuidanceGlue.create()
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
          constructionGuidanceGlue.mutate('visible', false)
        }}
        title='详情'
        visible={constructionGuidanceGlue.store.visible}>
        <XFormRemote
          ajax={createAjax(
            '/mailihome/construction/guidance/{constructionGuidanceId}',
            'get',
            {
              data: { attachment: [], steps: [] },
              path: { constructionGuidanceId: 0 },
            },
          )}
          defer
          expose={(e) => {
            constructionGuidanceGlue.form = e
          }}
          labelWidth='100px'
          onPrepare={({ mutate }) => {
            mutate(
              'path',
              'constructionGuidanceId',
              constructionGuidanceGlue.store.id,
            )
          }}
          ui='flex flex-1 flex-col overflow-hidden'>
          {(ajax) => (
            <>
              <div class='flex flex-1 flex-row overflow-hidden'>
                <div class='flex flex-1 flex-col gap-2 overflow-hidden px-4'>
                  <XTooltip title='基本信息' />
                  <div class='flex-1 overflow-auto'>
                    {constructionGuidanceFormRemoteItems
                      .select(['编号', '名称', '种类', '状态', '附件', '备注'])
                      .render(ajax)}
                  </div>
                </div>
                <div class='flex flex-1 flex-col gap-2 overflow-hidden px-4'>
                  <XTooltip title='步骤' />
                  <div class='flex justify-end'>
                    <XButton
                      onClick={() => {
                        createStep(ajax.store.data.steps.length)
                      }}>
                      添加步骤
                    </XButton>
                  </div>
                  <XTable
                    columns={[
                      { children: (row) => row.comment, label: '备注' },
                      {
                        children: (row, index) => (
                          <div class='flex gap-2'>
                            <XReconfirm
                              confirm={() => {
                                ajax.mutate('data', 'steps', (pre) =>
                                  pre.filter((_, i) => index() !== i),
                                )
                              }}
                            />
                            <XButton
                              onClick={() => {
                                editStep(row, index())
                              }}
                              type='text'>
                              编辑
                            </XButton>
                          </div>
                        ),
                        label: '操作',
                      },
                    ]}
                    data={ajax.store.data.steps}
                    id='/main/construction/guidance/steps'
                  />

                  <XDialog
                    onClose={() => setVisible(false)}
                    title='添加步骤'
                    ui={{
                      children: { wrapper: 'flex-col' },
                      container: 'w-8/12!',
                    }}
                    visible={visible()}>
                    <XTooltip title='步骤配置' />
                    <XForm
                      expose={(e) => {
                        stepForm = e
                      }}
                      labelWidth='100px'
                      ui='mt-4'>
                      <XFormItem
                        label='备注'
                        required
                        validator={() => {
                          if (!step.comment) {
                            return '备注不能为空'
                          }
                        }}>
                        <XInput
                          onInput={(value) => {
                            setStep('comment', value)
                          }}
                          value={step.comment}
                        />
                      </XFormItem>
                      <div class='flex justify-end'>
                        <XButton
                          onClick={() => {
                            if (stepForm?.validate()) {
                              batch(() => {
                                const index = stepIndex()
                                ajax.mutate('data', 'steps', index, { ...step })
                                setVisible(false)
                              })
                            }
                          }}>
                          保存
                        </XButton>
                      </div>
                    </XForm>
                  </XDialog>
                </div>
              </div>
              <div class='mt-2'>
                <div class='h-px bg-gray-300' />
                <div class='flex justify-end pt-2'>
                  <XButtonAsync
                    action={() =>
                      constructionGuidanceGlue.save(() =>
                        request(
                          '/mailihome/construction/guidance',
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
      </XDialog>
    </>
  )
}
