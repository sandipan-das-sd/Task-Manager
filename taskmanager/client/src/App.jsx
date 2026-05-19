import './App.css'
import AuthPanel from './components/AuthPanel'
import Dashboard from './components/Dashboard'
import { AuthProvider } from './context/AuthContext'
import { WorkspaceProvider } from './context/WorkspaceContext'
import { useAuth } from './hooks/useAuth'

function AppContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <AuthPanel />
  }

  return (
    <WorkspaceProvider>
      <Dashboard />
    </WorkspaceProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
