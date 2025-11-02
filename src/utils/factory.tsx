export const createTableColumns =
  <D extends object>() =>
  <C extends XTableColumnConfig<D>>(
    columns: (C & { label: LiteralString<C['label']> })[],
  ) =>
    Object.assign(columns, {
      select: (labels: C['label'][]) =>
        labels.map(
          (label) =>
            columns.find(
              (column) => (column.label as unknown as C['label']) === label,
            )!,
        ),
    })

type AjaxGetReturn<
  U extends UrlCouldGet,
  ArrayData extends boolean,
> = 'get' extends HttpMethod & NonOptionalKeys<paths[U]>
  ? ReturnType<
      typeof createAjax<
        U,
        'get',
        ResolveRequestFromOperation<paths[U]['get']> & {
          data: ArrayData extends true
            ? ResolveResponseDataFromOperation<paths[U]['get']>[]
            : ResolveResponseDataFromOperation<paths[U]['get']>
        }
      >
    >
  : never

type TableAjax<A> = A extends { store: { data: unknown[] } } ? A : never
export const createTableRemoteColumns = <
  U extends UrlCouldGet,
  C extends XTableRemoteColumnConfig<TableAjax<AjaxGetReturn<U, true>>>,
>(
  _url: U,
  columns: (C & { label: LiteralString<C['label']> })[],
) =>
  Object.assign(columns, {
    select: (labels: C['label'][]) =>
      labels.map(
        (label) =>
          columns.find(
            (column) => (column.label as unknown as C['label']) === label,
          )!,
      ),
  })

type FormAjax<A> = A extends { store: { data: unknown } } ? A : never
export const createFormRemoteItems = <
  U extends UrlCouldGet,
  I extends XFormRemoteItemConfig<FormAjax<AjaxGetReturn<U, false>>>,
>(
  _url: U,
  items: (I & { label: LiteralString<I['label']> })[],
) => {
  const render = (item: I, ajax: FormAjax<AjaxGetReturn<U, false>>) => (
    <XFormItem {...item}>{item.children(ajax)}</XFormItem>
  )
  return Object.assign(items, {
    render: (ajax: FormAjax<AjaxGetReturn<U, false>>) =>
      items.map((item) => render(item, ajax)),
    select: (labels: I['label'][]) => {
      const selected = labels.map(
        (label) =>
          items.find(
            (item) => (item.label as unknown as I['label']) === label,
          )!,
      )
      return Object.assign(selected, {
        render: (ajax: FormAjax<AjaxGetReturn<U, false>>) =>
          selected.map((item) => render(item, ajax)),
      })
    },
  })
}
