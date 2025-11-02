export default function floating() {
  const [width, setWidth] = createSignal(100)
  const [trigger, setTrigger] = createSignal<'click' | 'hover'>('click')

  return (
    <div class='flex flex-col gap-4'>
      <div class='flex gap-4'>
        <XButton
          onClick={() => setTrigger(trigger() === 'click' ? 'hover' : 'click')}>
          切换trigger {trigger()}
        </XButton>
      </div>

      <span>基础用法</span>
      <div class='flex gap-4'>
        <XFloating floating={<div>floating1</div>} trigger={trigger()}>
          <XButton>reference1</XButton>
        </XFloating>
        <XFloating floating={<div>floating2</div>} trigger={trigger()}>
          <XButton>reference2</XButton>
        </XFloating>
      </div>

      <span>不合法的reference</span>
      <div class='flex gap-4'>
        <XFloating floating={<div>floating3</div>} trigger={trigger()}>
          text
        </XFloating>
        <XFloating floating={<div>floating4</div>} trigger={trigger()}>
          <XButton>reference4</XButton>
          <XButton>reference4</XButton>
        </XFloating>
      </div>

      <span>点击二级floating，一级floating不会消失</span>
      <div class='flex gap-4'>
        <XFloating
          floating={
            <XFloating floating={<div>confirm?</div>} trigger={trigger()}>
              <XButton color='red'>danger</XButton>
            </XFloating>
          }
          trigger={trigger()}>
          <XButton>嵌套</XButton>
        </XFloating>
      </div>

      <span>floating内容动态变化，会重新计算位置</span>
      <div class='flex gap-4'>
        <XFloating
          floating={
            <div
              class='bg-red-500'
              style={{ width: `${width().toString()}px` }}>
              {width()}
            </div>
          }
          trigger={trigger()}>
          <XButton>reference5</XButton>
        </XFloating>

        <XButton onClick={() => setWidth((v) => v + 100)}>change width</XButton>
      </div>

      <span>自定义floating wrapper样式</span>
      <div class='flex gap-4'>
        <XFloating
          floating={<div>floating6</div>}
          trigger={trigger()}
          ui={{ floating: { wrapper: '!bg-red-500' } }}>
          <XButton>reference6</XButton>
        </XFloating>
      </div>

      <span>flip</span>
      <div class='flex gap-4'>
        <XFloating
          floating={<div class='w-96 bg-red-500'>floating7</div>}
          placement='left'
          trigger={trigger()}>
          <XButton>reference7</XButton>
        </XFloating>
      </div>

      <span>shift</span>
      <div class='flex gap-4'>
        <XFloating
          floating={<div class='w-[1000px] bg-red-500'>floating8</div>}
          trigger={trigger()}>
          <XButton>reference8</XButton>
        </XFloating>
      </div>

      <span>disabled</span>
      <div class='flex gap-4'>
        <XFloating disabled floating={<div>floating9</div>} trigger={trigger()}>
          <XButton disabled>reference9</XButton>
        </XFloating>
      </div>
    </div>
  )
}
