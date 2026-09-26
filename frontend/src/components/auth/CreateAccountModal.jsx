import React, { useState, useEffect } from 'react'
import AuthInput from './AuthInput'
import AuthSelect from './AuthSelect'
import SocialLoginButton from './SocialLoginButton'
import logoImg from '../../assets/codeguru_logo_transparent.png'
import robotImg from '../../assets/modal_robot_companion.png'
import terminalImg from '../../assets/modal_terminal_device.png'
import './CreateAccountModal.css'

const COURSE_OPTIONS = [
  'B.Tech',
  'B.E.',
  'BCA',
  'MCA',
  'M.Tech',
  'B.Sc',
  'M.Sc',
  'Other'
]

const BRANCH_OPTIONS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Machine Learning',
  'Data Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other'
]

export default function CreateAccountModal({
  isOpen,
  onClose,
  onOpenSignIn
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
    branch: '',
    termsAgreed: false
  })

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name'
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Please create a password'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // College
    if (!formData.college.trim()) {
      newErrors.college = 'Please enter your college or university'
    }

    // Course
    if (!formData.course) {
      newErrors.course = 'Please select your course'
    }

    // Branch
    if (!formData.branch) {
      newErrors.branch = 'Please select your branch'
    }

    // Terms
    if (!formData.termsAgreed) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      alert(`Welcome to the realm, Player ${formData.name}! Your adventurer profile has been created. (Backend registration will be integrated in the upcoming milestone)`)
    }
  }

  const handleSocialSignup = (provider) => {
    alert(`Connecting to ${provider} authentication portal... (Social OAuth will be integrated in the next milestone)`)
  }

  const handleTermsClick = (e, type) => {
    e.preventDefault()
    alert(`${type} will be published in the legal policies section soon!`)
  }

  const handleSignInClick = (e) => {
    e.preventDefault()
    if (onOpenSignIn) {
      onOpenSignIn()
    }
  }

  return (
    <div
      className="cg-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cg-create-account-title"
    >
      <div className="cg-game-modal-container cg-create-modal-container">
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
          aria-label="Close create account modal"
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
            <div className="cg-modal-panel-content cg-create-panel-content">
              {/* Header Title with Playful Gaming Accents */}
              <div className="cg-modal-header cg-create-modal-header">
                <div className="cg-modal-title-row">
                  <span className="cg-title-accent-decor">&bull; &mdash;</span>
                  <h2 id="cg-create-account-title" className="cg-modal-title cg-create-title">
                    Create an <span className="cg-title-highlight">Account</span>
                  </h2>
                  <span className="cg-title-accent-decor">&mdash; &bull;</span>
                </div>
                <p className="cg-modal-subtitle">
                  Start your coding journey with CodeGuru
                </p>
              </div>

              {/* Player Registration Form */}
              <form onSubmit={handleSubmit} className="cg-create-account-form" noValidate>
                {/* 1. Full Name */}
                <AuthInput
                  id="signup-name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  leftIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                />

                {/* 2. Email */}
                <AuthInput
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                />

                {/* 3. Password */}
                <AuthInput
                  id="signup-password"
                  isPassword
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  error={errors.password}
                  leftIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                />

                {/* 4. Confirm Password */}
                <AuthInput
                  id="signup-confirm-password"
                  isPassword
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  leftIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                />

                {/* 5. College / University */}
                <AuthInput
                  id="signup-college"
                  type="text"
                  placeholder="Enter your college / university name"
                  value={formData.college}
                  onChange={(e) => handleChange('college', e.target.value)}
                  error={errors.college}
                  leftIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                    </svg>
                  }
                />

                {/* 6. Course & Branch Row */}
                <div className="cg-form-row-2col">
                  {/* Course Dropdown */}
                  <AuthSelect
                    id="signup-course"
                    placeholder="Select course"
                    value={formData.course}
                    onChange={(e) => handleChange('course', e.target.value)}
                    options={COURSE_OPTIONS}
                    error={errors.course}
                    leftIcon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    }
                  />

                  {/* Branch Dropdown */}
                  <AuthSelect
                    id="signup-branch"
                    placeholder="Select branch"
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    options={BRANCH_OPTIONS}
                    error={errors.branch}
                    leftIcon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    }
                  />
                </div>

                {/* 7. Terms & Conditions Checkbox */}
                <div className="cg-terms-row">
                  <label className="cg-terms-label">
                    <input
                      type="checkbox"
                      id="signup-terms"
                      checked={formData.termsAgreed}
                      onChange={(e) => handleChange('termsAgreed', e.target.checked)}
                      className="cg-checkbox-input"
                    />
                    <span className="cg-custom-checkbox"></span>
                    <span className="cg-terms-text">
                      I agree to the{' '}
                      <button
                        type="button"
                        className="cg-terms-link"
                        onClick={(e) => handleTermsClick(e, 'Terms of Service')}
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        className="cg-terms-link"
                        onClick={(e) => handleTermsClick(e, 'Privacy Policy')}
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {errors.terms && <span className="cg-input-error-msg">{errors.terms}</span>}
                </div>

                {/* 8. Primary Create Account Button */}
                <button
                  type="submit"
                  className={`cg-btn-create-primary ${!formData.termsAgreed ? 'is-disabled' : ''}`}
                  id="modal-submit-create-account-btn"
                  disabled={!formData.termsAgreed}
                  title={!formData.termsAgreed ? 'Please agree to the Terms of Service and Privacy Policy to continue' : ''}
                >
                  <span className="cg-btn-signin-text">Create Account</span>
                  <span className="cg-btn-signin-arrow">&rarr;</span>
                  <div className="cg-btn-signin-sheen"></div>
                </button>
              </form>

              {/* 9. Divider: OR Continue with */}
              <div className="cg-modal-divider cg-create-divider">
                <span className="cg-divider-line"></span>
                <span className="cg-divider-text">OR</span>
                <span className="cg-divider-line"></span>
              </div>
              <p className="cg-continue-with-text">Continue with</p>

              {/* 10. Social Signup Circular Buttons (Google & GitHub) */}
              <div className="cg-social-buttons-row cg-create-social-row">
                <SocialLoginButton
                  provider="google"
                  onClick={() => handleSocialSignup('Google')}
                />
                <SocialLoginButton
                  provider="github"
                  onClick={() => handleSocialSignup('GitHub')}
                />
              </div>

              {/* 11. Footer: Already have an account? Sign In -> */}
              <div className="cg-modal-footer cg-create-footer">
                <span className="cg-footer-question">Already have an account?</span>
                <button
                  type="button"
                  className="cg-link-create-account"
                  onClick={handleSignInClick}
                >
                  Sign In &rarr;
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

        {/* Bottom Connecting Futuristic Cyan Bar */}
        <div className="cg-decor-bottom-bar" aria-hidden="true"></div>
      </div>
    </div>
  )
}
