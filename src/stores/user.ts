const { execute, mutate, store } = createAjax(
  '/mailihome/business/security/user',
  'get',
  { data: { accessRights: [], roles: [] } },
)

const hasAccessRight = (code: string) => {
  return store.data.accessRights.some((it) => it.code === code)
}

const user = { execute, hasAccessRight, mutate, store }

let initialized = false

export const useUserStore = () => {
  if (!initialized) {
    void execute()
    initialized = true
  }
  return user
}
