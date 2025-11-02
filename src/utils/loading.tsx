export const useLoading = (
  loading: Accessor<boolean>,
  element: Accessor<HTMLElement>,
) => {
  createEffect(
    on(loading, (loading) => {
      const container = element()
      const mask = (container.querySelector('.x-loading-mask') ?? (
        <div class='x-loading-mask invisible'>
          <IconHeroiconsArrowPath class='h-8 w-8 animate-spin' />
        </div>
      )) as HTMLDivElement
      if (!container.querySelector('.x-loading-mask')) {
        container.append(mask)
      }
      container.classList.toggle('relative', loading)
      mask.hidden = !loading
    }),
  )
}
