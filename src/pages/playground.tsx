import { A } from '@solidjs/router'

export default function Playground(props: { children: JSX.Element }) {
  return (
    <div class='flex h-full w-full gap-8 p-4'>
      <div class='flex flex-col gap-4'>
        <h2 class='text-2xl font-bold'>组件</h2>

        <A class='text-xl' href='/playground/button'>
          button
        </A>

        <A class='text-xl' href='/playground/form'>
          form
        </A>

        <A class='text-xl' href='/playground/input'>
          input
        </A>

        <A class='text-xl' href='/playground/select'>
          select
        </A>

        <A class='text-xl' href='/playground/tag'>
          tag
        </A>

        <A class='text-xl' href='/playground/table'>
          table
        </A>

        <A class='text-xl' href='/playground/floating'>
          floating
        </A>

        <A class='text-xl' href='/playground/checkbox'>
          checkbox
        </A>

        <A class='text-xl' href='/playground/tooltip'>
          tooltip
        </A>

        <A class='text-xl' href='/playground/dialog'>
          dialog
        </A>

        <A class='text-xl' href='/playground/reconfirm'>
          reconfirm
        </A>

        <A class='text-xl' href='/playground/message'>
          message
        </A>

        <A class='text-xl' href='/playground/upload'>
          upload
        </A>
      </div>

      <div class='min-w-0 flex-1'>{props.children}</div>
    </div>
  )
}
