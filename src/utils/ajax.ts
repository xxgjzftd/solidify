import { getOwner } from 'solid-js'

interface AjaxQuery {
  [key: string]: AjaxQuery | boolean | number | number[] | string | string[]
}

const stringify = (query: AjaxQuery) => {
  const parts = [] as string[]

  function build(keys: string[], value: AjaxQuery['string']) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        build(keys, item)
      })
    } else if (typeof value === 'object') {
      for (const k in value) {
        build([...keys, k], value[k])
      }
    } else {
      parts.push(
        encodeURIComponent(keys.join('.')) + '=' + encodeURIComponent(value),
      )
    }
  }

  for (const key in query) {
    build([key], query[key])
  }

  return parts.join('&')
}

export const request = async <
  U extends keyof paths,
  M extends HttpMethod & NonOptionalKeys<paths[U]>,
>(
  url: U,
  method: M,
  params: ResolveRequestFromOperation<paths[U][M]>,
) => {
  let nu = url as string
  if ('path' in params && params.path) {
    nu = nu.replace(
      /{(.+?)}/g,
      (_, key: string) => (params.path as Record<string, string>)[key],
    )
  }
  if ('query' in params && params.query) {
    const qs = stringify(params.query as AjaxQuery)
    if (qs) {
      nu += '?' + qs
    }
  }
  const controller = new AbortController()
  if (getOwner()) {
    onCleanup(() => {
      controller.abort()
    })
  }

  const response = await fetch(nu, {
    body:
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      'payload' in params && params.payload
        ? JSON.stringify({
            data: ([] as ResolvePayloadDataFromOperation<paths[U][M]>[]).concat(
              params.payload,
            ),
          })
        : undefined,
    headers: { 'Content-Type': 'application/json' },
    method: method,
    signal: controller.signal,
  })

  const json = (await response.json()) as ResolveResponseFromOperation<
    paths[U][M]
  >
  if (!response.ok) {
    if (response.status === 403) {
      location.href = '/login'
    } else if (typeof json === 'object' && json) {
      if ('errors' in json) {
        const errors = json.errors as components['schemas']['ErrorDto'][]
        if (errors.length) {
          message.tooltip({
            color: 'red',
            description: errors[0].message,
            title: 'Error',
          })
        }
      } else if ('warnings' in json) {
        const warnings = json.warnings as components['schemas']['WarningDto'][]
        if (warnings.length) {
          message.tooltip({
            color: 'yellow',
            description: warnings[0].message,
            title: 'Warning',
          })
        }
      } else {
        message.tooltip({
          color: 'red',
          description: 'Unknown error',
          title: 'Error',
        })
      }
    }
  }

  return { controller, json, response }
}

export const createAjax = <
  U extends keyof paths,
  M extends HttpMethod & NonOptionalKeys<paths[U]>,
  I extends ResolveAjaxInitFromOperation<paths[U][M]>,
>(
  url: U,
  method: M,
  init: I,
) => {
  type PD = ResolvePayloadDataFromOperation<paths[U][M]>
  type RD = ResolveResponseDataFromOperation<paths[U][M]>
  type Data = 'data' extends keyof I
    ? I['data'] extends RD[]
      ? RD[]
      : RD
    : RD[]

  type Payload = 'payload' extends keyof I
    ? I['payload'] extends PD[]
      ? PD[]
      : PD
    : undefined

  const [store, mutate] = createStore({
    data: ('data' in init ? init.data : []) as Data,
    loading: false,
    method: method,
    paging: {
      itemCount: 0,
      pageCount: 1,
      pageIndex: 1,
      pageSize: 20,
    } as PagingResultDto,
    path: ('path' in init ? init.path : undefined) as 'path' extends keyof I
      ? ResolvePathFromOperation<paths[U][M]>
      : undefined,
    payload: ('payload' in init ? init.payload : undefined) as Payload,
    query: ('query' in init ? init.query : undefined) as 'query' extends keyof I
      ? ResolveQueryFromOperation<paths[U][M]>
      : undefined,
    url: url,
  })

  const execute = async () => {
    mutate('loading', true)

    const { json, response } = await request(store.url, store.method, {
      path: store.path,
      payload: store.payload,
      query: store.query,
    } as ResolveRequestFromOperation<paths[U][M]>)

    if (response.ok) {
      batch(() => {
        if (typeof json === 'object' && json) {
          if ('data' in json) {
            const data = json.data as RD[]
            mutate('data', (Array.isArray(store.data) ? data : data[0]) as Data)
          }
          if ('meta' in json) {
            const meta = json.meta as components['schemas']['MetaDto']
            if (meta.paging) {
              mutate('paging', meta.paging)
            }
          }
          mutate('loading', false)
        }
      })
    } else {
      mutate('loading', false)
    }
  }

  return { execute, mutate, store }
}
