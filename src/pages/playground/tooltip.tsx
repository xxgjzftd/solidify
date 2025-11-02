export default function Tooltip() {
  return (
    <div class='space-y-2'>
      <XTooltip description='这是提示内容' title='提示' />
      <XTooltip color='yellow' description='这是提示内容' title='提示' />
      <XTooltip color='red' description='这是提示内容' title='提示' />
      <XTooltip color='green' description='这是提示内容' title='提示' />
      <XTooltip color='gray' title='提示' />
    </div>
  )
}
