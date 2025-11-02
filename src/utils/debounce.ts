export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 300,
) => {
  let timer: null | ReturnType<typeof setTimeout>

  return (...args: Args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
