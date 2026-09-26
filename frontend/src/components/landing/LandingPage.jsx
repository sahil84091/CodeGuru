import React from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import FeatureStrip from './FeatureStrip'
import Footer from './Footer'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="cg-landing-page">
      <Navbar />
      <main>
        <HeroSection />
      </main>
      <FeatureStrip />
      <Footer />
    </div>
  )
}
