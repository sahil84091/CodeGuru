import React from 'react'

export default function Footer() {
  return (
    <footer className="cg-footer">
      <div className="cg-footer-container">
        <div className="cg-footer-left">
          <p className="cg-copyright">
            &copy; 2026 <span className="cg-footer-brand">CodeGuru</span>. All rights reserved. Built with passion by SparkCoders.
          </p>
        </div>
        <div className="cg-footer-right">
          <a href="#privacy" className="cg-footer-link">Privacy</a>
          <span className="cg-footer-sep">&bull;</span>
          <a href="#terms" className="cg-footer-link">Terms</a>
          <span className="cg-footer-sep">&bull;</span>
          <a href="#help" className="cg-footer-link">Help</a>
        </div>
      </div>
    </footer>
  )
}
