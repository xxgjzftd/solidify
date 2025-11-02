export default function Message() {
  return (
    <div>
      <XButton
        onClick={() => {
          message.tooltip({ title: 'tooltip' })
        }}>
        tooltip
      </XButton>
    </div>
  )
}
