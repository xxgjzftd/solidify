export default function Reconfirm() {
  const confirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <div class='flex flex-col gap-4'>
      <span>基础</span>
      <div>
        <XReconfirm confirm={confirm} />
      </div>

      <span>自定义</span>
      <div>
        <XReconfirm confirm={confirm} message={<span>自定义</span>}>
          <XButton>自定义</XButton>
        </XReconfirm>
      </div>
    </div>
  )
}
