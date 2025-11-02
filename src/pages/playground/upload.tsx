export default function Upload() {
  const [singleUrl, setSingleUrl] = createSignal<string>()
  const [multipleUrls, setMultipleUrls] = createSignal<string[]>([])
  const [customUrls, setCustomUrls] = createSignal<string[]>([])
  const [formUrls, setFormUrls] = createSignal<string[]>([])
  const [errorUrls, setErrorUrls] = createSignal<string[]>([])
  const [customRenderUrls, setCustomRenderUrls] = createSignal<string[]>([])
  const [aliyunUrls, setAliyunUrls] = createSignal<string[]>([])

  const singleUploader = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      console.log('Uploading single file:', file.name)
      if (file.name.includes('error')) {
        setTimeout(() => {
          reject(new Error('模拟文件上传失败'))
        }, 1000)
        return
      }
      setTimeout(() => {
        resolve(
          `https://loremflickr.com/320/240/cat?random=${Math.random().toString()}`,
        )
      }, 1000)
    })
  }

  const multipleUploader = (files: File[]) => {
    return new Promise<string[]>((resolve, reject) => {
      console.log(
        'Uploading multiple files:',
        files.map((f) => f.name),
      )
      if (files.some((f) => f.name.includes('error'))) {
        setTimeout(() => {
          reject(new Error('模拟文件上传失败'))
        }, 1000)
        return
      }
      setTimeout(() => {
        const urls = files.map(
          () =>
            `https://loremflickr.com/320/240/cat?random=${Math.random().toString()}`,
        )
        resolve(urls)
      }, 1000)
    })
  }

  return (
    <div class='space-y-8 p-8'>
      <h1 class='text-2xl font-bold'>XUpload</h1>

      <div>
        <h2 class='text-lg font-bold'>单文件上传</h2>
        <p class='mb-2 text-sm text-gray-600'>
          `multiple=false` (默认)。新上传的文件将替换现有值。
        </p>
        <XUpload
          onChange={setSingleUrl}
          uploaded={(props) => <XUploadUploadedImageList {...props} />}
          uploader={singleUploader}
          value={singleUrl()}
        />
        <div class='mt-2 text-xs text-gray-500'>
          值: {singleUrl() ?? '未定义'}
        </div>
      </div>

      <div>
        <h2 class='text-lg font-bold'>多文件上传</h2>
        <p class='mb-2 text-sm text-gray-600'>
          `multiple=true`。新上传的文件将添加到列表中。
        </p>
        <XUpload
          multiple
          onChange={setMultipleUrls}
          uploader={multipleUploader}
          value={multipleUrls()}
        />
        <div class='mt-2 text-xs text-gray-500'>
          值: {JSON.stringify(multipleUrls())}
        </div>
      </div>

      <div>
        <h2 class='text-lg font-bold'>自定义触发器</h2>
        <p class='mb-2 text-sm text-gray-600'>
          通过 children render prop 提供一个子元素作为上传触发器。
        </p>
        <XUpload
          multiple
          onChange={setCustomUrls}
          uploader={multipleUploader}
          value={customUrls()}>
          {({ trigger }) => (
            <div
              class='cursor-pointer rounded-md border-2 border-dashed p-8 text-center transition hover:border-cyan-500'
              onClick={trigger}>
              <p class='font-semibold'>拖放或点击</p>
              <p class='text-sm text-gray-500'>使用此区域上传您的文件</p>
            </div>
          )}
        </XUpload>
      </div>

      <div>
        <h2 class='text-lg font-bold'>自定义渲染</h2>
        <p class='mb-2 text-sm text-gray-600'>
          使用 `uploaded` prop 自定义已上传文件的列表。
        </p>
        <XUpload
          multiple
          onChange={setCustomRenderUrls}
          uploaded={({ remove, urls }) => (
            <ul class='list-disc space-y-1 pl-5'>
              <For each={urls}>
                {(url) => (
                  <li class='flex items-center gap-2'>
                    <a
                      class='text-cyan-500 hover:underline'
                      href={url}
                      target='_blank'>
                      {url.substring(url.lastIndexOf('/') + 1, 40)}...
                    </a>
                    <IconHeroiconsXMark
                      class='h-4 w-4 cursor-pointer text-gray-500 hover:text-red-500'
                      onClick={() => {
                        remove(url)
                      }}
                    />
                  </li>
                )}
              </For>
            </ul>
          )}
          uploader={multipleUploader}
          value={customRenderUrls()}
        />
      </div>

      <div>
        <h2 class='text-lg font-bold'>错误处理</h2>
        <p class='mb-2 text-sm text-gray-600'>
          如果文件名包含 "error"，上传器将拒绝上传。
        </p>
        <XUpload
          multiple
          onChange={setErrorUrls}
          uploader={multipleUploader}
          value={errorUrls()}
        />
      </div>

      <div>
        <h2 class='text-lg font-bold'>禁用状态</h2>
        <p class='mb-2 text-sm text-gray-600'>组件处于非交互状态。</p>
        <XUpload disabled multiple uploader={multipleUploader} />
      </div>

      <div>
        <h2 class='text-lg font-bold'>aliyun</h2>
        <p class='mb-2 text-sm text-gray-600'>通常使用这个进一步封装的组件</p>
        <XUploadAliyun multiple onChange={setAliyunUrls} value={aliyunUrls()} />
        <div class='mt-2 text-xs text-gray-500'>
          值: {JSON.stringify(aliyunUrls())}
        </div>
      </div>

      <div>
        <h2 class='text-lg font-bold'>表单内使用</h2>
        <XForm>
          <XFormItem label='附件' required>
            <XUpload
              multiple
              onChange={setFormUrls}
              uploader={multipleUploader}
              value={formUrls()}
            />
          </XFormItem>
          <XFormItem label='禁用'>
            <XUpload disabled multiple uploader={multipleUploader} />
          </XFormItem>
        </XForm>
      </div>
    </div>
  )
}
