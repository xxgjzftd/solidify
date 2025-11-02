const { execute, mutate, store } = createAjax(
  '/mailihome/business/common/oss/signature/open',
  'post',
  { data: {} },
)

let expires = Date.now()

const oss = { execute, mutate, store }

export const useOssStore = () => {
  if (store.loading || Date.now() > expires) {
    void execute().then(() => {
      expires = Date.now() + 24 * 60 * 60 * 1000
    })
  }

  return oss
}
