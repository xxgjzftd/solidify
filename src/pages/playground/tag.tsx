export default function Tag() {
  return (
    <div class='flex gap-4'>
      <XTag
        closable
        onClose={() => {
          console.log('close')
        }}>
        cyan
      </XTag>
      <XTag closable color='gray'>
        gray
      </XTag>
      <XTag closable color='red'>
        red
      </XTag>
      <XTag closable color='green'>
        green
      </XTag>
      <XTag closable color='blue'>
        blue
      </XTag>
      <XTag closable color='yellow'>
        yellow
      </XTag>
      <XTag closable color='purple'>
        purple
      </XTag>
      <XTag closable color='pink'>
        pink
      </XTag>

      <XTag>cyan</XTag>
      <XTag color='gray'>gray</XTag>
      <XTag color='red'>red</XTag>
      <XTag color='green'>green</XTag>
      <XTag color='blue'>blue</XTag>
      <XTag color='yellow'>yellow</XTag>
      <XTag color='purple'>purple</XTag>
      <XTag color='pink'>pink</XTag>
    </div>
  )
}
