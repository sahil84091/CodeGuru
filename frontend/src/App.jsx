import React, { useState, useEffect } from 'react'
import LandingPage from './components/landing/LandingPage'

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (toPath) => {
    if (window.location.pathname !== toPath) {
      window.history.pushState(null, '', toPath)
      setCurrentPath(toPath)
    }
  }

  // Both / and /login and /signup render the LandingPage with respective modal open
  return (
    <LandingPage
      initialSignInOpen={currentPath === '/login'}
      initialCreateAccountOpen={currentPath === '/signup' || currentPath === '/create-account'}
      onPathChange={navigate}
    />
  )
}
