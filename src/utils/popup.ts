export const popup = {
  decrement: () => {
    popup.z--
  },
  increment: () => {
    popup.z++
  },
  z: 1000,
  get zIndex() {
    return popup.z.toString()
  },
}
