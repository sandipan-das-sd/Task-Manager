import { useWorkspace } from '../hooks/useWorkspace'

export default function StatusLine() {
  const { loading, notice, error } = useWorkspace()

  if (!loading && !notice && !error) {
    return null
  }

  return (
    <div className={error ? 'status-line error' : 'status-line'}>
      {loading ? 'Syncing with backend...' : error || notice}
    </div>
  )
}
