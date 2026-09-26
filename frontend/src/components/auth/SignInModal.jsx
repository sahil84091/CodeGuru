import React, { useState, useEffect } from 'react'
import AuthInput from './AuthInput'
import SocialLoginButton from './SocialLoginButton'
import logoImg from '../../assets/codeguru_logo_transparent.png'
import robotImg from '../../assets/modal_robot_companion.png'
import terminalImg from '../../assets/modal_terminal_device.png'
import './SignInModal.css'

export default function SignInModal({ isOpen, onClose, onCreateAccount }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState({})

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Please enter your password'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      alert(`Welcome back, Adventurer! Signing in for ${email}... (Backend authentication will be integrated in the next milestone)`)
    }
  }

  const handleSocialLogin = (provider) => {
    alert(`Connecting to ${provider} authentication portal... (Social OAuth will be integrated in the next milestone)`)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    alert('Password recovery service will be available in the upcoming milestone!')
  }

  const handleCreateAccountClick = (e) => {
    e.preventDefault()
    if (onCreateAccount) {
      onCreateAccount()
    } else {
      alert('Create Account / Signup experience is scheduled for the next milestone!')
    }
  }

  return (
    <div
      className="cg-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cg-modal-title"
    >
      <div className="cg-game-modal-container">
        {/* Floating Side Cyber Collectible Cubes */}
        <div className="cg-cyber-cube cg-cube-left-1" aria-hidden="true"></div>
        <div className="cg-cyber-cube cg-cube-left-2" aria-hidden="true"></div>
        <div className="cg-cyber-cube cg-cube-right-1" aria-hidden="true"></div>
        <div className="cg-cyber-cube cg-cube-right-2" aria-hidden="true"></div>

        {/* 3D CodeGuru Logo Crest perched on top of frame */}
        <div className="cg-modal-logo-crest">
          <img src={logoImg} alt="CodeGuru" className="cg-modal-logo-img" />
        </div>

        {/* Circular Red 3D Gaming Close Button */}
        <button
          type="button"
          className="cg-modal-close-btn"
          onClick={onClose}
          aria-label="Close sign in modal"
        >
          <span className="cg-close-x">&#x2715;</span>
          <div className="cg-close-glow"></div>
        </button>

        {/* Main 3D Beveled Cyber-Stone Frame */}
        <div className="cg-modal-frame">
          {/* Glowing Neon Cyan Frame Insets */}
          <div className="cg-frame-edge-glow-left" aria-hidden="true"></div>
          <div className="cg-frame-edge-glow-right" aria-hidden="true"></div>

          {/* Golden Beveled Inner Lip */}
          <div className="cg-modal-inner-lip">
            {/* Warm Parchment Light Panel Interior */}
            <div className="cg-modal-panel-content">
              {/* Header Title with Playful Dots */}
              <div className="cg-modal-header">
                <div className="cg-modal-title-row">
                  <span className="cg-title-dot-decor">&bull; &bull; &bull;</span>
                  <h2 id="cg-modal-title" className="cg-modal-title">
                    Sign In
                  </h2>
                  <span className="cg-title-dot-decor">&bull; &bull; &bull;</span>
                </div>
                <p className="cg-modal-subtitle">
                  Continue your coding journey
                </p>
              </div>

              {/* Email & Password Authentication Form */}
              <form onSubmit={handleSubmit} className="cg-signin-form" noValidate>
                {/* Email Field */}
                <AuthInput
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: '' })
                  }}
                  error={errors.email}
                />

                {/* Password Field with Eye Toggle */}
                <AuthInput
                  id="signin-password"
                  isPassword
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: '' })
                  }}
                  error={errors.password}
                />

                {/* Remember Me Checkbox & Forgot Password Link */}
                <div className="cg-form-options-row">
                  <label className="cg-remember-me-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="cg-checkbox-input"
                    />
                    <span className="cg-custom-checkbox"></span>
                    <span className="cg-remember-text">Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="cg-forgot-password-link"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Primary Electric Blue Sign In Button */}
                <button
                  type="submit"
                  className="cg-btn-signin-primary"
                  id="modal-submit-signin-btn"
                >
                  <span className="cg-btn-signin-text">Sign In</span>
                  <span className="cg-btn-signin-arrow">&rarr;</span>
                  <div className="cg-btn-signin-sheen"></div>
                </button>
              </form>

              {/* Divider: OR */}
              <div className="cg-modal-divider">
                <span className="cg-divider-line"></span>
                <span className="cg-divider-text">OR</span>
                <span className="cg-divider-line"></span>
              </div>

              {/* Social Login Circular Buttons (Google & GitHub) */}
              <div className="cg-social-buttons-row">
                <SocialLoginButton
                  provider="google"
                  onClick={() => handleSocialLogin('Google')}
                />
                <SocialLoginButton
                  provider="github"
                  onClick={() => handleSocialLogin('GitHub')}
                />
              </div>

              {/* Footer: Create Account Link */}
              <div className="cg-modal-footer">
                <span className="cg-footer-question">Don't have an account?</span>
                <button
                  type="button"
                  className="cg-link-create-account"
                  onClick={handleCreateAccountClick}
                >
                  Create an account &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left 3D Terminal & Code Screen on Blocks */}
        <div className="cg-decor-bottom-left" aria-hidden="true">
          <img
            src={terminalImg}
            alt=""
            className="cg-decor-terminal-img"
          />
        </div>

        {/* Bottom Right 3D Robot Companion on Blocks */}
        <div className="cg-decor-bottom-right" aria-hidden="true">
          <img
            src={robotImg}
            alt=""
            className="cg-decor-robot-img"
          />
        </div>
      </div>
    </div>
  )
}
