import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface WorkforceProfileConfig {
  id: string
  number: string
  label: string
  image: string
  fallbackSvg: string
  objectPosition?: string
}

const workforceProfiles: WorkforceProfileConfig[] = [
  { id: 'welder', number: '01', label: 'WELDER', image: '/assets/workforce/welder.webp', fallbackSvg: '/assets/workforce/welder.svg', objectPosition: 'center center' },
  { id: 'pipefitter', number: '02', label: 'PIPEFITTER', image: '/assets/workforce/pipefitter.webp', fallbackSvg: '/assets/workforce/pipefitter.svg', objectPosition: 'center center' },
  { id: 'boilermaker', number: '03', label: 'BOILERMAKER', image: '/assets/workforce/boilermaker.webp', fallbackSvg: '/assets/workforce/boilermaker.svg', objectPosition: 'center center' },
  { id: 'mechanic', number: '04', label: 'INDUSTRIAL MECHANIC', image: '/assets/workforce/mechanic.webp', fallbackSvg: '/assets/workforce/mechanic.svg', objectPosition: 'center center' },
  { id: 'electrician', number: '05', label: 'ELECTRICIAN', image: '/assets/workforce/electrician.webp', fallbackSvg: '/assets/workforce/electrician.svg', objectPosition: 'center center' },
  { id: 'supervisor', number: '06', label: 'SUPERVISOR', image: '/assets/workforce/supervisor.webp', fallbackSvg: '/assets/workforce/supervisor.svg', objectPosition: 'center top' },
]

type RoleData = {
  title: string
  subtitle: string
  description: string
}

export function WorkforceScroll() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const roles = t('workforce.roles', { returnObjects: true }) as RoleData[]
  const microcopy = t('workforce.microcopy', { defaultValue: 'SKILLED WORKFORCE' })
  const finalMessage = t('workforce.finalMessage')

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }))
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop scrubbed & pinned ScrollTrigger section (>= 901px)
      mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        // Deterministic initial state: Profile 01 (WELDER) is 100% visible immediately from pixel 0
        gsap.set('.wf-card-0', { opacity: 1, autoAlpha: 1, y: 0 })
        gsap.set('.wf-img-0', { opacity: 1, autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0 0 0)' })

        // Profiles 02 to 06 start hidden for scroll transition
        workforceProfiles.slice(1).forEach((_, i) => {
          const idx = i + 1
          gsap.set(`.wf-card-${idx}`, { opacity: 0, autoAlpha: 0, y: 30 })
          gsap.set(`.wf-img-${idx}`, { opacity: 0, autoAlpha: 0, scale: 1.04, clipPath: 'inset(100% 0 0 0)' })
        })

        // Master Timeline pinned for 3600px of profile storytelling
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 84px',
            end: '+=3600',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress
              let idx = 0
              if (p < 0.16) idx = 0
              else if (p < 0.32) idx = 1
              else if (p < 0.48) idx = 2
              else if (p < 0.64) idx = 3
              else if (p < 0.80) idx = 4
              else idx = 5
              setActiveIndex(idx)
            },
          },
        })

        // 0. Intro heading fade-out coexisting with Profile 01 (0.00 to 0.08)
        masterTl.to('.wf-heading-intro', { opacity: 0.1, y: -15, duration: 0.05 }, 0.02)

        // Profiles 0 to 5 (3600px distribution)
        const ranges = [
          { start: 0.00, end: 0.16 },
          { start: 0.16, end: 0.32 },
          { start: 0.32, end: 0.48 },
          { start: 0.48, end: 0.64 },
          { start: 0.64, end: 0.80 },
          { start: 0.80, end: 0.96 },
        ]

        ranges.forEach((r, i) => {
          const isFirst = i === 0
          const isLast = i === ranges.length - 1
          const transitionTime = 0.025

          // Reveal phase (for Profiles 02 to 06)
          if (!isFirst) {
            masterTl.fromTo(
              `.wf-card-${i}`,
              { opacity: 0, autoAlpha: 0, y: 30 },
              { opacity: 1, autoAlpha: 1, y: 0, duration: transitionTime },
              r.start
            )
            masterTl.fromTo(
              `.wf-img-${i}`,
              { opacity: 0, autoAlpha: 0, scale: 1.05, clipPath: 'inset(100% 0 0 0)' },
              { opacity: 1, autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0 0 0)', duration: transitionTime },
              r.start
            )
          }

          // Exit phase (for Profiles 01 to 06)
          masterTl.to(
            `.wf-card-${i}`,
            { opacity: 0, autoAlpha: 0, y: -20, duration: transitionTime },
            r.end - transitionTime
          )
          masterTl.to(
            `.wf-img-${i}`,
            { opacity: isLast ? 1 : 0, autoAlpha: isLast ? 1 : 0, scale: 1.03, duration: transitionTime },
            r.end - transitionTime
          )
        })

        // Final message banner (0.96 to 1.00)
        masterTl.to(
          '.wf-progress-bar',
          { opacity: 0, autoAlpha: 0, duration: 0.02 },
          0.94
        )
        masterTl.fromTo(
          '.wf-final-banner',
          { opacity: 0, autoAlpha: 0, y: 20 },
          { opacity: 1, autoAlpha: 1, y: 0, duration: 0.03 },
          0.96
        )
      })

      return () => mm.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="workforce" className="workforce-section-scroll">
      {/* Desktop Sticky Viewport */}
      <div className="wf-desktop-viewport">
        <div className="site-container wf-desktop-layout">
          {/* Left Column (38-42%): Intro, Active Role & Progress Bar */}
          <div className="wf-left-col">
            <div className="section-heading wf-heading wf-heading-intro">
              <p className="eyebrow">{t('workforce.eyebrow')}</p>
              <h2>{t('workforce.title')}</h2>
              <p>{t('workforce.description')}</p>
            </div>

            {/* Profile Content Stage (Strict Single Active Card Visible) */}
            <div className="wf-cards-stage">
              {Array.isArray(roles) &&
                roles.map((role, i) => {
                  const profile = workforceProfiles[i]
                  const isActive = i === activeIndex
                  return (
                    <div
                      key={profile?.id || i}
                      className={`wf-card-item wf-card-${i} ${isActive ? 'is-active' : ''}`}
                    >
                      <div className="wf-card-meta">
                        <span className="wf-microcopy">{microcopy}</span>
                        <span className="wf-meta-sep">•</span>
                        <span className="wf-number-badge">
                          {profile?.number} / 0{workforceProfiles.length}
                        </span>
                      </div>

                      <h3 className="wf-role-title">{role.title}</h3>
                      <p className="wf-role-specs">{role.subtitle}</p>
                      <p className="wf-role-desc">{role.description}</p>
                    </div>
                  )
                })}
            </div>

            {/* Progress Line Indicator */}
            <div className="wf-progress-bar" aria-hidden="true">
              {workforceProfiles.map((p, i) => (
                <div
                  key={p.id}
                  className={`wf-progress-step ${i === activeIndex ? 'active' : ''} ${
                    i < activeIndex ? 'completed' : ''
                  }`}
                >
                  <span>{p.number}</span>
                  <div className="wf-step-line" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (58-62%): Large Dominant Media Frame */}
          <div className="wf-right-col" aria-hidden="true">
            <div className="wf-media-frame">
              {workforceProfiles.map((p, i) => {
                const isActive = i === activeIndex
                const hasImageFailed = failedImages[p.id]
                const imgSrc = hasImageFailed ? p.fallbackSvg : p.image

                return (
                  <div
                    key={p.id}
                    className={`wf-media-item wf-img-${i} ${isActive ? 'active' : ''}`}
                  >
                    {!hasImageFailed ? (
                      <>
                        <img
                          className="wf-media-img"
                          src={imgSrc}
                          alt=""
                          loading="lazy"
                          style={{ objectPosition: p.objectPosition || 'center center' }}
                          onError={() => handleImageError(p.id)}
                        />
                        <div className="wf-media-overlay" />
                      </>
                    ) : (
                      <div className={`wf-placeholder-card wf-placeholder-${p.id}`}>
                        <div className="wf-placeholder-center">
                          <span className="wf-placeholder-title">{p.label}</span>
                          <span className="wf-placeholder-sub">FINAL LUMINOUS ASSET PENDING</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Final Section Message Banner */}
        <div className="wf-final-banner site-container">
          <p className="eyebrow">LUMINOUS WORKFORCE</p>
          <h3>{finalMessage}</h3>
        </div>
      </div>

      {/* Mobile & Tablet Stacked List (< 901px) */}
      <div className="wf-mobile-list site-container">
        <div className="section-heading">
          <p className="eyebrow">{t('workforce.eyebrow')}</p>
          <h2>{t('workforce.title')}</h2>
          <p>{t('workforce.description')}</p>
        </div>

        {Array.isArray(roles) &&
          roles.map((role, i) => {
            const profile = workforceProfiles[i]
            const hasImageFailed = failedImages[profile?.id || i]
            const imgSrc = hasImageFailed ? profile?.fallbackSvg : profile?.image
            return (
              <article key={profile?.id || i} className="wf-mobile-item">
                <div className="wf-mobile-media">
                  {!hasImageFailed ? (
                    <>
                      <img
                        src={imgSrc}
                        alt={role.title}
                        loading="lazy"
                        style={{ objectPosition: profile?.objectPosition || 'center center' }}
                        onError={() => handleImageError(profile?.id || `${i}`)}
                      />
                      <div className="wf-media-overlay" />
                    </>
                  ) : (
                    <div className={`wf-placeholder-card wf-placeholder-${profile?.id || 'welder'}`}>
                      <div className="wf-placeholder-center">
                        <span className="wf-placeholder-title">{profile?.label}</span>
                        <span className="wf-placeholder-sub">FINAL LUMINOUS ASSET PENDING</span>
                      </div>
                    </div>
                  )}
                  <span className="wf-mobile-num">{profile?.number}</span>
                </div>
                <div className="wf-mobile-content">
                  <p className="wf-microcopy">{microcopy} / {profile?.number}</p>
                  <h3>{role.title}</h3>
                  <p className="wf-role-specs">{role.subtitle}</p>
                  <p className="wf-role-desc">{role.description}</p>
                </div>
              </article>
            )
          })}

        <div className="wf-mobile-final">
          <p className="eyebrow">LUMINOUS WORKFORCE</p>
          <h3>{finalMessage}</h3>
        </div>
      </div>
    </section>
  )
}
