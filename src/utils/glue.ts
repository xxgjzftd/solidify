export const createListDetailGlue = () => {
  const [store, mutate] = createStore({ id: 0, visible: false })

  let table: undefined | XTableRemoteExpose
  let form: undefined | XFormRemoteExpose

  const glue = {
    create: () => {
      mutate({ id: 0, visible: true })
      form?.reset()
    },
    edit: (id: number) => {
      mutate({ id, visible: true })
      form?.reset()
      void form?.search()
    },
    get form() {
      return form
    },
    set form(value: undefined | XFormRemoteExpose) {
      form = value
    },
    get mutate() {
      return mutate
    },
    remove: async (request: () => PromiseLike<unknown>) => {
      await request()
      void table?.search()
    },
    save: async (request: () => PromiseLike<unknown>) => {
      if (form?.validate()) {
        await request()
        mutate({ visible: false })
        void table?.search()
      }
    },
    get store() {
      return store
    },
    get table() {
      return table
    },
    set table(value: undefined | XTableRemoteExpose) {
      table = value
    },
  }

  return glue
}

export const createListListGlue = () => {
  const [store, mutate] = createStore({ id: 0, visible: false })

  let parent: undefined | XTableRemoteExpose
  let child: undefined | XTableRemoteExpose

  const glue = {
    get child() {
      return child
    },
    set child(value: undefined | XTableRemoteExpose) {
      child = value
    },
    edit: (id: number) => {
      mutate({ id, visible: true })
      void child?.search()
    },
    get mutate() {
      return mutate
    },
    get parent() {
      return parent
    },
    set parent(value: undefined | XTableRemoteExpose) {
      parent = value
    },
    get store() {
      return store
    },
  }

  return glue
}
