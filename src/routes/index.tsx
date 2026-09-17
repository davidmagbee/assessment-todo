import { Await, createFileRoute, useRouter } from '@tanstack/react-router'
import { loadWorkspace, persistTask, removeTask } from '../tasks/functions'
import { taskSearch } from '../tasks/input'
import { Account } from '../ui/account'
import { TaskBoard } from '../ui/task-board'

export const Route = createFileRoute('/')({
  ssr: true,
  validateSearch: taskSearch,
  loaderDeps: ({search}) => search,
  loader: ({deps}) => loadWorkspace({data: deps}),
  component: Home,
})

/** Render the shell after identity is known; only the task query streams into the list boundary. */
function Home() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const router = useRouter()
  return <main>
    <header className="masthead"><a className="brand" href="/" aria-label="Small Wins home"><span aria-hidden="true">✳</span> small wins<span className="brand-dot">.</span></a><Account key={data.viewer.email} email={data.viewer.email} onSessionChange={async () => {await router.invalidate()}} /></header>
    <section className="intro"><div><p className="eyebrow">LESS NOISE. MORE MOMENTUM.</p><h1>A little focus.<br/><span>A lot of possibility.</span></h1><p>Your next idea, your next step, your next small win.</p></div><div className="orbit" aria-hidden="true">✳</div></section>
    <Await key={data.viewer.email} promise={data.tasks} fallback={<p role="status" className="loading">Finding your next steps…</p>}>{tasks => <TaskBoard tasks={tasks} search={search}
      onSearch={next => { void navigate({search: next}) }}
      onSave={async input => { const task = await persistTask({data: input}); if (!task) throw new Error('Task is no longer available'); await router.invalidate() }}
      onRemove={async id => { await removeTask({data:{id}}); await router.invalidate() }} />}</Await>
    <footer>MAKE PROGRESS. LEAVE ROOM TO PLAY.</footer>
  </main>
}
