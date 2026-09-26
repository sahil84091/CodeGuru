import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import FeatureStrip from './FeatureStrip'
import SignInModal from '../auth/SignInModal'
import CreateAccountModal from '../auth/CreateAccountModal'
import './LandingPage.css'

export default function LandingPage({
  initialSignInOpen = false,
  initialCreateAccountOpen = false,
  onPathChange
}) {
  const [isSignInOpen, setIsSignInOpen] = useState(initialSignInOpen)
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(initialCreateAccountOpen)

  useEffect(() => {
    setIsSignInOpen(initialSignInOpen)
  }, [initialSignInOpen])

  useEffect(() => {
    setIsCreateAccountOpen(initialCreateAccountOpen)
  }, [initialCreateAccountOpen])

  const handleOpenSignIn = () => {
    setIsCreateAccountOpen(false)
    setIsSignInOpen(true)
    if (onPathChange) {
      onPathChange('/login')
    }
  }

  const handleCloseSignIn = () => {
    setIsSignInOpen(false)
    if (onPathChange) {
      onPathChange('/')
    }
  }

  const handleOpenCreateAccount = () => {
    setIsSignInOpen(false)
    setIsCreateAccountOpen(true)
    if (onPathChange) {
      onPathChange('/signup')
    }
  }

  const handleCloseCreateAccount = () => {
    setIsCreateAccountOpen(false)
    if (onPathChange) {
      onPathChange('/')
    }
  }

  return (
    <div className="cg-landing-page">
      {/* Top Translucent Navigation Bar */}
      <Navbar onOpenSignIn={handleOpenSignIn} />

      {/* Main Full-Screen Hero Viewport */}
      <HeroSection onOpenSignIn={handleOpenSignIn} />

      {/* Bottom Feature HUD */}
      <FeatureStrip />

      {/* In-Game Sign-In Modal Overlay */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={handleCloseSignIn}
        onCreateAccount={handleOpenCreateAccount}
      />

      {/* In-Game Create Account / Player Registration Modal Overlay */}
      <CreateAccountModal
        isOpen={isCreateAccountOpen}
        onClose={handleCloseCreateAccount}
        onOpenSignIn={handleOpenSignIn}
      />
    </div>
  )
}
