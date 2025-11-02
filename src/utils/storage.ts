import { getOwner } from 'solid-js'
import { type SetStoreFunction } from 'solid-js/store'

const cache = new Map<string, unknown>()
const count = new Map<string, number>()

export const createStorage = <I extends object>(id: string, init: I) => {
  if (!getOwner())
    throw new Error('createStorage must be called in a reactive context')

  if (!cache.has(id)) {
    cache.set(
      id,
      createRoot(() => {
        const string = localStorage.getItem(id)
        const _init = string ? (JSON.parse(string) as I) : undefined

        const [store, setStore] = createStore<I>(_init ?? init)
        createEffect(() => {
          localStorage.setItem(id, JSON.stringify(store))
        })

        return [store, setStore] as const
      }),
    )
  }

  count.set(id, (count.get(id) ?? 0) + 1)
  onCleanup(() => {
    count.set(id, count.get(id)! - 1)
    if (count.get(id) === 0) {
      cache.delete(id)
      count.delete(id)
    }
  })

  return cache.get(id) as [I, SetStoreFunction<I>]
}
