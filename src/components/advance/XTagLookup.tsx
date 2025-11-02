export type XTagLookupProps = Omit<XTagProps, 'children' | 'color'> & {
  lookup: LookupDto
}

export function XTagLookup(props: XTagLookupProps) {
  const _props = mergeProps({ size: 'small' } as const, props)
  const [tp, pp] = splitProps(_props, ['lookup'])

  const palettes = ['blue', 'cyan', 'gray', 'pink', 'purple', 'yellow']
  const color = createMemo(() =>
    tp.lookup.stage === 'FINAL'
      ? 'green'
      : tp.lookup.stage === 'ERROR'
        ? 'red'
        : (palettes[
            (tp.lookup.ordinal ?? 0) % palettes.length
          ] as XTagProps['color']),
  )
  return (
    <XTag {...pp} color={color()}>
      {tp.lookup.message}
    </XTag>
  )
}
