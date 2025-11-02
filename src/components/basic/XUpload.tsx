const getFileName = (url: string) => {
  try {
    const urlObject = new URL(url)
    const pathname = urlObject.pathname
    return pathname.substring(pathname.lastIndexOf('/') + 1)
  } catch {
    return url.substring(url.lastIndexOf('/') + 1)
  }
}

export interface XUploadProps<
  M extends boolean,
  MV = M extends true ? string[] : string,
> extends UIProps<string> {
  accept?: string
  children?: (props: {
    disabled: Accessor<boolean>
    trigger: () => void
  }) => JSX.Element
  disabled?: boolean
  enabled?: boolean
  error?: string
  multiple?: M
  onChange?: (value?: MV) => void
  uploaded?: (props: XUploadUploadedProps) => JSX.Element
  uploader?: (file: M extends true ? File[] : File) => Promise<MV>
  uploading?: (props: XUploadUploadingProps) => JSX.Element
  value?: MV
}

interface UploadingFile {
  id: number
  name: string
}

interface XUploadUploadedProps {
  disabled: Accessor<boolean>
  remove: (url: string) => void
  urls: string[]
}

interface XUploadUploadingProps {
  files: UploadingFile[]
}

export function XUploadUploadedFileList(props: XUploadUploadedProps) {
  return (
    <div class='flex flex-wrap gap-2'>
      <For each={props.urls}>
        {(url) => (
          <XTag
            closable={!props.disabled()}
            color='cyan'
            onClick={() => window.open(url)}
            onClose={() => {
              props.remove(url)
            }}>
            <div class='flex items-center gap-1'>
              <IconHeroiconsPhoto class='h-4 w-4' />
              <span>{getFileName(url)}</span>
            </div>
          </XTag>
        )}
      </For>
    </div>
  )
}

export function XUploadUploadedImageList(props: XUploadUploadedProps) {
  return (
    <div class='flex flex-wrap gap-2'>
      <For each={props.urls}>
        {(url) => (
          <div class='group relative h-20 w-20 overflow-hidden rounded-md border border-gray-300'>
            <img
              alt={getFileName(url)}
              class='h-full w-full object-cover'
              src={url}
            />
            <div class='bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity group-hover:opacity-100'>
              {!props.disabled() && (
                <IconHeroiconsXMark
                  class='absolute top-1 right-1 h-4 w-4 text-white'
                  onClick={() => {
                    props.remove(url)
                  }}
                />
              )}
            </div>
          </div>
        )}
      </For>
    </div>
  )
}

export function XUploadUploadingList(props: XUploadUploadingProps) {
  return (
    <For each={props.files}>
      {(file) => (
        <XTag color='gray'>
          <div class='flex items-center gap-2'>
            <IconHeroiconsArrowPath class='h-4 w-4 animate-spin' />
            <span>{file.name}</span>
          </div>
        </XTag>
      )}
    </For>
  )
}

let fileIdCounter = 0

export function XUpload<M extends boolean = false>(props: XUploadProps<M>) {
  type MV = M extends true ? string[] : string

  let input: HTMLInputElement

  const [uploadingFiles, setUploadingFiles] = createSignal<UploadingFile[]>([])

  const trigger = () => {
    if (!disabled()) {
      input.click()
    }
  }

  const onRemove = (urlToRemove: string) => {
    if (disabled()) return
    if (props.multiple) {
      const newValue = ((props.value as string[] | undefined) ?? []).filter(
        (url) => url !== urlToRemove,
      )
      props.onChange?.(newValue as MV)
    } else {
      props.onChange?.(undefined)
    }
  }

  const _props = mergeProps(
    {
      children: (props: {
        disabled: Accessor<boolean>
        trigger: () => void
      }) => (
        <XButton disabled={disabled()} onClick={props.trigger} type='plain'>
          点击上传
        </XButton>
      ),
      disabled: false,
      multiple: false,
      uploaded: (props: XUploadUploadedProps) => (
        <XUploadUploadedFileList {...props} />
      ),
      uploading: (props: XUploadUploadingProps) => (
        <XUploadUploadingList {...props} />
      ),
    },
    props,
  )

  const fic = useContext(XFormItemContext)
  const disabled = createMemo(() =>
    _props.enabled ? false : _props.disabled || !!fic?.disabled,
  )
  const error = createMemo(() => props.error ?? fic?.error)

  const onChange = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0 || !_props.uploader) {
      return
    }

    const currentFiles = Array.from(files).map((file) => ({
      id: fileIdCounter++,
      name: file.name,
    }))

    setUploadingFiles((uf) => [...uf, ...currentFiles])

    try {
      const result = await _props.uploader(
        (_props.multiple ? Array.from(files) : files[0]) as M extends true
          ? File[]
          : File,
      )

      if (_props.multiple) {
        const existing = (_props.value as string[] | undefined) ?? []
        _props.onChange?.([...existing, ...(result as string[])] as MV)
      } else {
        _props.onChange?.(result as MV)
      }
    } catch (err) {
      console.error(err)
      message.tooltip({
        color: 'red',
        description: String(err),
        title: 'Upload failed',
      })
    } finally {
      const currentFileIds = currentFiles.map((f) => f.id)
      setUploadingFiles((uf) =>
        uf.filter((f) => !currentFileIds.includes(f.id)),
      )
      input.value = ''
    }
  }

  const values = createMemo<string[]>(() => {
    if (!_props.value) return [] as string[]
    return Array.isArray(_props.value) ? _props.value : [_props.value]
  })

  return (
    <div class={_props.ui}>
      {_props.children({ disabled, trigger })}
      <input
        accept={_props.accept}
        disabled={disabled()}
        multiple={_props.multiple}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange={onChange}
        ref={(el) => (input = el)}
        style={{ display: 'none' }}
        type='file'
      />
      <div class='mt-2 space-y-2'>
        {_props.uploading({ files: uploadingFiles() })}
        {_props.uploaded({ disabled, remove: onRemove, urls: values() })}
      </div>
      <Show when={error()}>
        <div class='mt-1 text-xs text-red-500'>{error()}</div>
      </Show>
    </div>
  )
}
