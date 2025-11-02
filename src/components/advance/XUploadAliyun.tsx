import { XUpload, type XUploadProps } from '../basic/XUpload'

export function XUploadAliyun<M extends boolean>(props: XUploadProps<M>) {
  const oss = useOssStore()

  const uploadSingleFile = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const data = oss.store.data
      const formData = new FormData()
      const key = `${data.dir!}/${Date.now().toString()}/${file.name}`

      formData.append('key', key)
      formData.append('policy', data.policy!)
      formData.append('success_action_status', '200')

      formData.append('x-oss-signature', data.signature!)
      formData.append('x-oss-signature-version', data.ossSignatureVersion!)
      formData.append('x-oss-credential', data.ossCredential!)
      formData.append('x-oss-date', data.ossDate!)
      formData.append('x-oss-security-token', data.securityToken!)

      formData.append('file', file)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', data.host!, true)

      // xhr.upload.onprogress = (event) => {
      //   if (event.lengthComputable) {
      //     const percentComplete = (event.loaded / event.total) * 100
      //     onProgress(percentComplete)
      //   }
      // }

      xhr.onload = () => {
        if (xhr.status === 200) {
          // onProgress(100)
          resolve(`${data.host!}/${key}`)
        } else {
          try {
            const parsed: unknown = JSON.parse(xhr.responseText)
            if (
              parsed &&
              typeof parsed === 'object' &&
              'Message' in parsed &&
              typeof (parsed as { Message?: unknown }).Message === 'string'
            ) {
              reject(new Error((parsed as { Message: string }).Message))
            } else {
              reject(new Error('Upload failed'))
            }
          } catch {
            reject(
              new Error(`Upload failed with status: ${xhr.status.toString()}`),
            )
          }
        }
      }

      xhr.onerror = () => {
        reject(new Error('An error occurred during the upload'))
      }

      xhr.send(formData)
    })
  }

  const uploader = ((files: File | File[]) => {
    if (Array.isArray(files)) {
      return Promise.all(files.map((file) => uploadSingleFile(file)))
    }
    return uploadSingleFile(files as unknown as File)
  }) as unknown as (
    file: M extends true ? File[] : File,
  ) => Promise<M extends true ? string[] : string>

  return <XUpload {...props} disabled={oss.store.loading} uploader={uploader} />
}
