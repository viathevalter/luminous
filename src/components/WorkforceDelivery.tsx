import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { openFormModal } from './FormModal'

gsap.registerPlugin(ScrollTrigger)

type StepData = {
  number: string
  title: string
  description: string
}

export function WorkforceDelivery() {
  const { t, i18n } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  const steps = t('delivery.steps', { returnObjects: true }) as StepData[]
  const eyebrow = t('delivery.eyebrow')
  const title = t('delivery.title')
  const description = t('delivery.description')
  const microcopy = t('delivery.microcopy')
  const ctaHeading = t('delivery.ctaHeading')
  const ctaButton = t('delivery.ctaButton')
  const impactHeadline = t('delivery.impactHeadline')
  const impactText = t('delivery.impactText')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop scrubbed & pinned ScrollTrigger section (>= 901px)
      mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        // Initial state: Step 01 is 100% active, steps 02..06 start with lower opacity
        gsap.set('.del-step-0', { opacity: 1, autoAlpha: 1 })
        steps.slice(1).forEach((_, i) => {
          const idx = i + 1
          gsap.set(`.del-step-${idx}`, { opacity: 0.35, autoAlpha: 1 })
        })

        // Master Timeline pinned for 2400px of scroll-driven storytelling
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 84px',
            end: '+=2400',
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress
              const rawIdx = Math.floor(p * (steps.length || 6))
              const idx = Math.min(Math.max(0, rawIdx), (steps.length || 6) - 1)
              setActiveStepIndex(idx)
            },
          },
        })

        const total = steps.length || 6
        steps.forEach((_, i) => {
          const startR = (i / total) * 0.9
          if (i > 0) {
            masterTl.to(`.del-step-${i}`, { opacity: 1, autoAlpha: 1, duration: 0.12, ease: 'power2.out' }, startR)
          }
          if (i < total - 1) {
            masterTl.to(`.del-step-${i}`, { opacity: 0.45, duration: 0.12, ease: 'power2.out' }, startR + 0.14)
          }
        })
      })

      // Mobile / Tablet stacked animation (< 901px)
      mm.add('(max-width: 900px)', () => {
        gsap.utils.toArray<HTMLElement>('.del-mobile-step').forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
              },
            }
          )
        })
      })

      setTimeout(() => ScrollTrigger.refresh(), 100)

      return () => mm.revert()
    }, section)

    return () => ctx.revert()
  }, [steps.length, i18n.language])

  return (
    <section ref={sectionRef} id="delivery" className="delivery-section section-space">
      <div className="site-container">
        {/* Desktop 3-Column Layout */}
        <div className="del-desktop-container">
          <div className="del-main-grid">
            {/* Column 1: Left B2B Positioning Header & CTA */}
            <div className="del-left-col">
              <div className="section-heading del-heading">
                <p className="eyebrow">{eyebrow}</p>
                <h2>
                  {title.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      {idx === 0 && <br />}
                    </span>
                  ))}
                </h2>
                <p className="del-description">{description}</p>
              </div>

              <div className="del-cta-box">
                <p className="del-cta-label">{ctaHeading}</p>
                <a
                  className="btn btn-primary"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    openFormModal({ mode: 'workforce' })
                  }}
                >
                  {ctaButton} <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Column 2: Right Connected 6-Step Process Flow with Integrated Golden Flame Line */}
            <div className="del-right-col">
              <div className="del-process-header">
                <span className="del-microcopy">{microcopy}</span>
                <div className="del-process-counter">
                  <span>0{activeStepIndex + 1}</span>
                  <span className="del-sep">/</span>
                  <span>0{steps.length || 6}</span>
                </div>
              </div>

              <div className="del-steps-list">
                {Array.isArray(steps) &&
                  steps.map((step, i) => {
                    const isActive = i === activeStepIndex
                    const isCompleted = i < activeStepIndex
                    return (
                      <div
                        key={step.number || i}
                        className={`del-step-card del-step-${i} ${isActive ? 'is-active' : ''} ${
                          isCompleted ? 'is-completed' : ''
                        }`}
                      >
                        {/* Vertical Golden Track: Line Starts at Step 01 and Ends at Step 06 */}
                        <div className="del-flame-track" aria-hidden="true">
                          {/* Line segment coming from previous step (steps 02 to 06) */}
                          {i > 0 && <div className="del-track-line del-track-line-top" />}

                          {/* Flame Icon Node horizontally aligned with step number badge */}
                          <div className={`del-flame-icon-wrap ${isActive ? 'is-active' : ''}`}>
                            <svg width="22" height="26" viewBox="-5 -8 10 16" fill="none">
                              <path
                                d="M 0 -6.5 C 0.6 -4.2 3.6 -2 3.6 1.8 C 3.6 4.2 2 5.8 0 5.8 C -2 5.8 -3.6 4.2 -3.6 1.8 C -3.6 -1 1.6 -4.2 0 -6.5 Z"
                                fill={isActive ? 'var(--accent)' : 'rgba(255, 180, 43, 0.35)'}
                                style={
                                  isActive
                                    ? { filter: 'drop-shadow(0 0 10px rgba(255, 180, 43, 1))' }
                                    : undefined
                                }
                              />
                              <path
                                d="M 0 -2.4 C 0.4 -1 1.4 0 1.4 1.5 C 1.4 2.5 0.8 3.2 0 3.2 C -0.8 3.2 -1.4 2.5 -1.4 1.5 C -1.4 0.4 -0.5 -1.1 0 -2.4 Z"
                                fill="#040c17"
                              />
                            </svg>
                          </div>

                          {/* Line segment going down to next step (steps 01 to 05) */}
                          {i < (steps.length || 6) - 1 && (
                            <div className="del-track-line del-track-line-bottom" />
                          )}
                        </div>

                        {/* Step Number Badge */}
                        <div className={`del-step-badge ${isActive ? 'is-active' : ''}`}>
                          {step.number}
                        </div>

                        {/* Step Content */}
                        <div className="del-step-body">
                          <h3 className="del-step-title">{step.title}</h3>
                          <p className="del-step-desc">{step.description}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* Impact Banner below entire grid */}
          <div className="del-impact-banner">
            <h3>{impactHeadline}</h3>
            <p>{impactText}</p>
          </div>
        </div>

        {/* Mobile & Tablet Stacked List (< 901px) */}
        <div className="del-mobile-list">
          <div className="section-heading">
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title.replace('\n', ' ')}</h2>
            <p>{description}</p>
          </div>

          <div className="del-mobile-steps-wrapper">
            <div className="del-mobile-line" />
            {Array.isArray(steps) &&
              steps.map((step) => (
                <div key={step.number} className="del-mobile-step">
                  <div className="del-mobile-num-badge">{step.number}</div>
                  <div className="del-mobile-step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="del-mobile-cta">
            <h3>{ctaHeading}</h3>
            <a
              className="btn btn-primary"
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                openFormModal({ mode: 'workforce' })
              }}
            >
              {ctaButton} <span className="btn-arrow">→</span>
            </a>
          </div>

          <div className="del-mobile-impact">
            <h3>{impactHeadline}</h3>
            <p>{impactText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
