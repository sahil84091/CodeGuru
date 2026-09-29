import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import AppLayout from './layouts/AppLayout'

// Keep the editor, 3D learning map, and individual journeys out of the initial bundle.
const LoginPage3D = lazy(() => import('./pages/LoginPage3D'))
const OTPPage = lazy(() => import('./pages/OTPPage'))
const LanguageSelectionPage = lazy(() => import('./pages/LanguageSelectionPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const MissionPage = lazy(() => import('./pages/MissionPage'))
const ChallengePage = lazy(() => import('./pages/ChallengePage'))
const ResultPage = lazy(() => import('./pages/ResultPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-base text-neutral-300 flex items-center justify-center font-mono text-sm" role="status">Loading CodeGuru…</div>}>
      <Routes>
        {/* Onboarding & Authentication Flow */}
        <Route path="/" element={<LoginPage3D />} />
        <Route path="/login" element={<LoginPage3D />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/welcome" element={<LanguageSelectionPage />} />

        {/* Dedicated Focused Coding Workspace (Distraction-Free) */}
        <Route path="/challenge/:id" element={<ChallengePage />} />
        <Route path="/challenge" element={<Navigate to="/challenge/1.1" replace />} />
        
        {/* Result & Reward Screen */}
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/result" element={<Navigate to="/result/1.1" replace />} />

        {/* Authenticated Application Shell (With Sidebar & TopNav) */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/mission/:id" element={<MissionPage />} />
          <Route path="/mission" element={<Navigate to="/mission/1.1" replace />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </MotionConfig>
  )
}
