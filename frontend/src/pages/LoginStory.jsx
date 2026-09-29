import { useEffect, useRef } from 'react'
import { animate, createTimeline, onScroll, stagger, svg } from 'animejs'
import { ArrowDown, ArrowRight, Braces, ChartNoAxesColumnIncreasing, Flame, Gamepad2, GitBranch, Sparkles, Target, Trophy, Zap } from 'lucide-react'
import './LoginStory.css'

const story = [
  {
    id: 'learn-by-doing',
    index: '01 / LEARN',
    title: <>A learning path<br /><span>that opens as you grow.</span></>,
    copy: 'Start with one small idea. Solve a mission, earn your next step, and watch the map open up as your skills do.',
    points: ['Short, focused missions', 'New nodes unlock as you progress'],
    icon: GitBranch,
    visual: 'path',
  },
  {
    id: 'practice-by-playing',
    index: '02 / PRACTICE',
    title: <>The challenge <span>is the game.</span></>,
    copy: 'Read a problem, change the code, run it, and learn from the result. Practice is built into every interaction.',
    points: ['Debug real code in the editor', 'Build confidence one solution at a time'],
    icon: Braces,
    visual: 'code',
  },
  {
    id: 'progress-that-means-something',
    index: '03 / GROW',
    title: <>Small wins.<br /><span>Real momentum.</span></>,
    copy: 'Your solved missions add up to XP, streaks, and visible progress, so you always know how far you have come.',
    points: ['Keep a streak that belongs to you', 'See your progress and celebrate milestones'],
    icon: ChartNoAxesColumnIncreasing,
    visual: 'progress',
  },
]

function PathVisual() {
  return (
    <div className="story-visual story-path-visual" aria-hidden="true">
      <svg className="story-route-svg" viewBox="0 0 440 230" fill="none">
        <path className="story-draw-path" d="M36 164C90 164 86 64 160 64s57 105 126 105 55-89 118-89" />
        {/* Anime.js supplies the route coordinates; keep the marker origin at (0, 0). */}
        <circle className="story-runner" cx="0" cy="0" r="5" />
      </svg>
      <div className="story-node story-node-one"><span>01</span><b>Learn</b></div>
      <div className="story-node story-node-two"><span>02</span><b>Practice</b></div>
      <div className="story-node story-node-three"><span>03</span><b>Unlock</b></div>
      <div className="story-path-caption"><Sparkles size={14} /> NEXT STEP REVEALED</div>
    </div>
  )
}

function CodeVisual() {
  return (
    <div className="story-visual story-code-visual" aria-hidden="true">
      <div className="story-code-top"><span /><span /><span /><small>mission_01.py</small><span className="story-code-status">● READY</span></div>
      <div className="story-code-lines">
        <div><i>01</i><code><em>for</em> lesson <em>in</em> <b>missions</b>:</code></div>
        <div><i>02</i><code>&nbsp;&nbsp;read(lesson.problem)</code></div>
        <div className="story-code-active"><i>03</i><code>&nbsp;&nbsp;solution = <strong>your_idea</strong>()</code></div>
        <div><i>04</i><code>&nbsp;&nbsp;<em>if</em> solution.<b>works</b>():</code></div>
        <div><i>05</i><code>&nbsp;&nbsp;&nbsp;&nbsp;unlock(next_mission)</code></div>
      </div>
      <div className="story-code-footer"><span><Zap size={14} /> Learn by doing</span><span>RUN <ArrowRight size={14} /></span></div>
    </div>
  )
}

function ProgressVisual() {
  return (
    <div className="story-visual story-progress-visual" aria-hidden="true">
      <div className="story-progress-head"><span>YOUR JOURNEY</span><span>LEVEL 01</span></div>
      <div className="story-progress-track"><span data-story-progress-fill /></div>
      <div className="story-progress-numbers"><b>0</b><b>3</b><b>6</b><b>9</b><b>12</b></div>
      <div className="story-progress-stats">
        <div><span className="story-stat-icon"><Flame size={17} /></span><b>3 day streak</b><small>One day at a time</small></div>
        <div><span className="story-stat-icon"><Trophy size={17} /></span><b>+120 XP</b><small>Earned by solving</small></div>
      </div>
      <div className="story-progress-unlock"><span><Sparkles size={15} /> NEXT MISSION OPEN</span><ArrowRight size={16} /></div>
    </div>
  )
}

function StoryVisual({ type }) {
  if (type === 'path') return <PathVisual />
  if (type === 'code') return <CodeVisual />
  return <ProgressVisual />
}

export default function LoginStory({ journeyRef, orbitRef, loginPanel, scrollToTarget }) {
  const storyRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const page = journeyRef.current
    const root = storyRef.current
    if (!page || !root) return undefined

    const animations = []
    const observers = []
    const cameraObserver = onScroll({
      target: page,
      enter: 'top top',
      leave: 'bottom bottom',
      sync: 0.35,
    })
    observers.push(cameraObserver)
    const cameraMotion = { value: 0 }
    animations.push(animate(cameraMotion, {
      value: [0, 1],
      ease: 'linear',
      autoplay: cameraObserver,
      onUpdate: () => { orbitRef.current.value = cameraMotion.value },
    }))

    root.querySelectorAll('[data-story-section]').forEach((section) => {
      const observer = onScroll({
        target: section,
        enter: 'bottom 82%',
        leave: 'top 24%',
        sync: 0.24,
      })
      observers.push(observer)

      const items = section.querySelectorAll('[data-story-item]')
      const reveal = createTimeline({ autoplay: observer })
      reveal.add(items, {
        opacity: [0, 1],
        y: [34, 0],
        scale: [0.97, 1],
        duration: 780,
        ease: 'out(4)',
        delay: stagger(105),
      })
      animations.push(reveal)

      const route = section.querySelector('.story-draw-path')
      const runner = section.querySelector('.story-runner')
      if (route) {
        animations.push(animate(svg.createDrawable(route), {
          draw: ['0 0', '0 1'],
          duration: 1050,
          ease: 'inOut(2)',
          autoplay: observer,
        }))
        if (runner) {
          animations.push(animate(runner, {
            ...svg.createMotionPath(route),
            duration: 1350,
            ease: 'inOut(2)',
            autoplay: observer,
          }))
        }
      }

      const progressFill = section.querySelector('[data-story-progress-fill]')
      if (progressFill) {
        animations.push(animate(progressFill, {
          scaleX: [0, 0.64],
          duration: 1050,
          ease: 'out(3)',
          autoplay: observer,
        }))
      }
    })

    return () => {
      animations.forEach((animation) => animation.revert?.())
      observers.forEach((observer) => observer.revert?.())
    }
  }, [journeyRef, orbitRef])

  return (
    <div className="login-story" ref={storyRef}>
      <button
        type="button"
        className="story-scroll-cue"
        onClick={() => scrollToTarget ? scrollToTarget('#learn-by-doing') : null}
      >
        <span>SCROLL TO EXPLORE</span>
        <ArrowDown size={15} />
      </button>

      {story.map(({ id, index, title, copy, points, icon: Icon, visual }, i) => (
        <section key={id} id={id} className={`story-section story-section-${i + 1}`} data-story-section>
          <div className={`story-inner ${i % 2 ? 'story-inner-reverse' : ''}`}>
            <div className="story-copy">
              <div className="story-eyebrow" data-story-item><span>{index}</span><i /></div>
              <div className="story-heading-row" data-story-item><span className="story-heading-icon"><Icon size={22} strokeWidth={1.8} /></span><h2>{title}</h2></div>
              <p className="story-description" data-story-item>{copy}</p>
              <ul className="story-points" data-story-item>{points.map((point) => <li key={point}><span>↗</span>{point}</li>)}</ul>
            </div>
            <div data-story-item><StoryVisual type={visual} /></div>
          </div>
        </section>
      ))}

      <section className="story-finale" id="portal-access" data-story-section>
        <div className="story-finale-layout">
          <div className="story-finale-copy">
            <div className="story-finale-mark" data-story-item><Target size={19} /><span>YOUR NEXT STEP STARTS HERE</span></div>
            <h2 data-story-item>Curiosity in.<br /><span>Capability out.</span></h2>
            <p data-story-item>Start with one mission. See where your progress takes you.</p>
            <div className="story-finale-foot" data-story-item><Gamepad2 size={15} /> LEARN <span>·</span> PLAY <span>·</span> PRACTICE <span>·</span> GROW</div>
          </div>
          <div className="story-final-login">{loginPanel}</div>
        </div>
      </section>
    </div>
  )
}
