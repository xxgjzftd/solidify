/* @refresh reload */
import '@/index.css'
import routes from '~solid-pages'

const root = document.getElementById('root')

render(
  () => (
    <>
      <Router root={(props) => <Suspense>{props.children}</Suspense>}>
        {routes}
      </Router>
      <XMessage />
    </>
  ),
  root!,
)
