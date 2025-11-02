export interface XPaginationProps extends UIProps<string> {
  onChange?: (pageIndex: number, pageSize: number) => void
  pageIndex?: number
  pageRange?: number
  pageSize?: number
  pageSizeOptions?: number[]
  total?: number
}

export function XPagination(props: XPaginationProps) {
  const _props = mergeProps(
    {
      pageIndex: 1,
      pageRange: 2,
      pageSize: 20,
      pageSizeOptions: [20, 50, 100] as number[],
      total: 0,
    } as const,
    props,
  )

  const pageNos = createMemo(() => {
    const pageCount = Math.ceil(_props.total / _props.pageSize)
    if (pageCount <= 0) return []

    let start = Math.max(1, _props.pageIndex - _props.pageRange)
    let end = start + _props.pageRange * 2
    if (end > pageCount) {
      end = pageCount
      start = Math.max(1, end - _props.pageRange * 2)
    }

    const middlePages = []
    for (let i = start; i <= end; i++) {
      middlePages.push(i)
    }

    const pages = [...new Set([1, pageCount, ...middlePages])].sort(
      (a, b) => a - b,
    )

    const result = []
    let prev = null
    for (const page of pages) {
      if (prev !== null) {
        if (page - prev > 1) {
          result.push('...')
        }
      }
      result.push(page)
      prev = page
    }

    return result
  })

  const isActive = createSelector(
    () => _props.pageIndex,
    (test: number | string, it) => test === it,
  )

  return (
    <div class={cx('flex items-center gap-3', props.ui)}>
      <span>共{_props.total}条</span>
      <XSelect
        data={_props.pageSizeOptions.map((it) => ({
          label: `${it.toString()} 条/页`,
          value: it,
        }))}
        factory={(it) => it}
        onChange={(value) => {
          _props.onChange?.(_props.pageIndex, value!)
        }}
        ui='!w-32'
        value={_props.pageSize}>
        {(selected) =>
          selected()
            .map((it) => it?.label)
            .join(',')
        }
      </XSelect>
      <div class='flex gap-1'>
        <For each={pageNos()}>
          {(it) => (
            <XButton
              color={isActive(it) ? 'cyan' : 'gray'}
              onClick={() => {
                if (typeof it === 'number')
                  _props.onChange?.(it, _props.pageSize)
              }}
              type='plain'>
              {it}
            </XButton>
          )}
        </For>
      </div>
    </div>
  )
}
