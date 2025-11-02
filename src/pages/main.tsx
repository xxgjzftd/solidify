import { A } from '@solidjs/router'

export default function Main(props: { children: JSX.Element }) {
  const menus = [
    {
      href: '/main/admin/department',
      icon: () => <IconHeroiconsBuildingOffice2 class='h-5 w-5' />,
      name: '部门管理',
    },
    {
      href: '/main/admin/user',
      icon: () => <IconHeroiconsUserGroup class='h-5 w-5' />,
      name: '用户管理',
    },
    {
      href: '/main/construction/guidance',
      icon: () => <IconHeroiconsWrench class='h-5 w-5' />,
      name: '工艺类别',
    },
  ]

  const user = useUserStore()

  return (
    <div class='flex h-screen w-screen bg-gray-100'>
      <aside class='flex w-64 flex-col bg-gray-800 text-gray-300'>
        <div class='flex h-16 items-center justify-center border-b border-gray-700 text-xl font-bold text-white'>
          <span>麦粒数字</span>
        </div>
        <nav class='flex-1 space-y-2 p-4'>
          <For each={menus}>
            {(item) => (
              <A
                activeClass='bg-gray-900 text-cyan-500'
                class='flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-700'
                end={true}
                href={item.href}
                inactiveClass='text-white'>
                <item.icon />
                <span>{item.name}</span>
              </A>
            )}
          </For>
        </nav>
      </aside>

      <main class='flex flex-1 flex-col overflow-hidden'>
        <header class='flex h-16 shrink-0 items-center justify-end border-b bg-white px-6'>
          <div class='flex items-center gap-4'>
            <span>欢迎 {user.store.data.name}</span>
            <div class='h-9 w-9 rounded-full bg-gray-300' />
          </div>
        </header>

        <div class='flex flex-1 flex-col gap-4 overflow-hidden p-6'>
          <div class='flex-1 overflow-hidden rounded-lg bg-white p-4 shadow-sm'>
            {props.children}
          </div>

          <footer class='shrink-0 text-center text-sm text-gray-400'>
            <span>Copyright © 2025 麦粒数字</span>
          </footer>
        </div>
      </main>
    </div>
  )
}
