import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// TODO: replace industry placeholders with final Luminous industry assets.
interface IndustrySectorConfig {
  id: string
  number: string
  label: string
  webp: string
  png: string
}

const industrySectors: IndustrySectorConfig[] = [
  { id: 'oil-gas', number: '01', label: 'OIL & GAS', webp: '/assets/industries/oil-gas.webp', png: '/assets/industries/oil-gas.png' },
  { id: 'petrochemical', number: '02', label: 'PETROCHEMICAL', webp: '/assets/industries/petrochemical.webp', png: '/assets/industries/petrochemical.png' },
  { id: 'refineries', number: '03', label: 'REFINERIES', webp: '/assets/industries/refineries.webp', png: '/assets/industries/refineries.png' },
  { id: 'energy', number: '04', label: 'ENERGY', webp: '/assets/industries/energy.webp', png: '/assets/industries/energy.png' },
  { id: 'shipyards', number: '05', label: 'SHIPYARDS & MARINE', webp: '/assets/industries/shipyards.webp', png: '/assets/industries/shipyards.png' },
  { id: 'construction', number: '06', label: 'INDUSTRIAL CONSTRUCTION', webp: '/assets/industries/industrial-construction.webp', png: '/assets/industries/industrial-construction.png' },
]

type SectorData = {
  id: string
  number: string
  title: string
  description: string
  tags: string[]
}

export function Industries() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageStage, setImageStage] = useState<Record<string, number>>({})

  const sectors = t('industries.sectors', { returnObjects: true }) as SectorData[]
  const finalBanner = t('industries.finalBanner', { defaultValue: 'ONE INDUSTRIAL PARTNER. MULTIPLE SECTORS.' })

  const getImageSrc = (s: IndustrySectorConfig) => {
    const stage = imageStage[s.id] || 0
    if (stage === 0) return s.webp
    if (stage === 1) return s.png
    return ''
  }

  const handleImageError = (id: string) => {
    setImageStage((prev) => {
      const current = prev[id] || 0
      return { ...prev, [id]: current + 1 }
    })
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop scrubbed ScrollTrigger pinned section (>= 901px)
      mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        // Deterministic initial state: Sector 01 (OIL & GAS) is 100% visible immediately from pixel 0
        gsap.set('.ind-card-0', { opacity: 1, autoAlpha: 1, y: 0 })
        gsap.set('.ind-img-0', { opacity: 1, autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0 0 0)' })

        // Sectors 02 to 06 start hidden for scroll transition
        industrySectors.slice(1).forEach((_, i) => {
          const idx = i + 1
          gsap.set(`.ind-card-${idx}`, { opacity: 0, autoAlpha: 0, y: 30 })
          gsap.set(`.ind-img-${idx}`, { opacity: 0, autoAlpha: 0, scale: 1.04, clipPath: 'inset(100% 0 0 0)' })
        })

        // Prepare SVG pipeline stroke-dasharray animation
        if (pathRef.current) {
          const pathLength = pathRef.current.getTotalLength() || 1000
          gsap.set(pathRef.current, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          })
        }

        // Single Master Timeline pinned for 3600px of industry sector storytelling
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

        // Animate SVG pipeline stroke-dashoffset along the entire timeline
        if (pathRef.current) {
          const pathLength = pathRef.current.getTotalLength() || 1000
          masterTl.to(
            pathRef.current,
            { strokeDashoffset: 0, ease: 'none', duration: 1 },
            0
          )
        }

        // 0. Intro heading fade-out coexisting with Sector 01 (0.00 to 0.08)
        masterTl.to('.ind-heading-intro', { opacity: 0.15, y: -15, duration: 0.05 }, 0.02)

        // Sectors 0 to 5 (3600px distribution)
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

          // Reveal phase (for Sectors 02 to 06)
          if (!isFirst) {
            masterTl.fromTo(
              `.ind-card-${i}`,
              { opacity: 0, autoAlpha: 0, y: 30 },
              { opacity: 1, autoAlpha: 1, y: 0, duration: transitionTime },
              r.start
            )
            masterTl.fromTo(
              `.ind-img-${i}`,
              { opacity: 0, autoAlpha: 0, scale: 1.05, clipPath: 'inset(100% 0 0 0)' },
              { opacity: 1, autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0 0 0)', duration: transitionTime },
              r.start
            )
          }

          // Exit phase (for Sectors 01 to 06)
          masterTl.to(
            `.ind-card-${i}`,
            { opacity: 0, autoAlpha: 0, y: -20, duration: transitionTime },
            r.end - transitionTime
          )
          masterTl.to(
            `.ind-img-${i}`,
            { opacity: isLast ? 1 : 0, autoAlpha: isLast ? 1 : 0, scale: 1.03, duration: transitionTime },
            r.end - transitionTime
          )
        })

        // Final message banner (0.96 to 1.00)
        masterTl.fromTo(
          '.ind-final-banner',
          { opacity: 0, autoAlpha: 0, y: 35 },
          { opacity: 1, autoAlpha: 1, y: 0, duration: 0.03 },
          0.96
        )
      })

      // Mobile / Tablet stacked list animation (< 901px)
      mm.add('(max-width: 900px)', () => {
        gsap.utils.toArray<HTMLElement>('.ind-mobile-item').forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
              },
            }
          )
        })
      })

      setTimeout(() => ScrollTrigger.refresh(), 100)

      return () => mm.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="industries" className="industries-scroll-section">
      {/* Desktop Sticky Viewport */}
      <div className="ind-desktop-viewport">
        <div className="site-container ind-desktop-layout">
          {/* Left Column (38-42%): Intro, Active Sector & Progress Indicator */}
          <div className="ind-left-col">
            <div className="section-heading ind-heading ind-heading-intro">
              <p className="eyebrow">{t('industries.eyebrow')}</p>
              <h2>{t('industries.title')}</h2>
              <p>{t('industries.description')}</p>
            </div>

            {/* Sector Content Stage (Strict Single Active Card Visible) */}
            <div className="ind-cards-stage">
              {Array.isArray(sectors) &&
                sectors.map((sec, i) => {
                  const itemConfig = industrySectors[i]
                  const isActive = i === activeIndex
                  return (
                    <div
                      key={sec.id || i}
                      className={`ind-card-item ind-card-${i} ${isActive ? 'is-active' : ''}`}
                    >
                      {/* Background Watermark Number */}
                      <span className="ind-watermark-num" aria-hidden="true">
                        {sec.number || itemConfig?.number}
                      </span>

                      <div className="ind-number-badge">
                        <span className="ind-current-num">{sec.number || itemConfig?.number}</span>
                        <span className="ind-num-sep">/</span>
                        <span className="ind-total-num">0{industrySectors.length}</span>
                      </div>

                      <h3 className="ind-sector-title">{sec.title}</h3>
                      <p className="ind-sector-desc">{sec.description}</p>

                      {/* Sector Technical Tags */}
                      {Array.isArray(sec.tags) && (
                        <div className="ind-tags-list">
                          {sec.tags.map((tag) => (
                            <span key={tag} className="ind-tag-pill">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>

            {/* Progress Line Indicator */}
            <div className="ind-progress-bar" aria-hidden="true">
              {industrySectors.map((s, i) => (
                <div
                  key={s.id}
                  className={`ind-progress-step ${i === activeIndex ? 'active' : ''} ${
                    i < activeIndex ? 'completed' : ''
                  }`}
                >
                  <span>{s.number}</span>
                  <div className="ind-step-line" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Large Dominant Media Frame + Exact Pipeline Framing Overlay */}
          <div className="ind-right-col" aria-hidden="true">
            <div className="ind-media-frame-container">
              <div className="ind-media-frame">
                {industrySectors.map((s, i) => {
                  const isActive = i === activeIndex
                  const currentStage = imageStage[s.id] || 0
                  const imgSrc = getImageSrc(s)

                  return (
                    <div
                      key={s.id}
                      className={`ind-media-item ind-img-${i} ${isActive ? 'active' : ''}`}
                    >
                      {currentStage < 2 ? (
                        <>
                          <img
                            className="ind-media-img"
                            src={imgSrc}
                            alt={s.label}
                            loading="lazy"
                            onError={() => handleImageError(s.id)}
                          />
                          <div className="ind-media-overlay" />
                        </>
                      ) : (
                        // TODO: replace industry placeholders with final Luminous industry assets.
                        <div className={`ind-placeholder-card ind-placeholder-${s.id}`}>
                          <div className="ind-placeholder-center">
                            <span className="ind-placeholder-title">{s.label}</span>
                            <span className="ind-placeholder-sub">FINAL LUMINOUS INDUSTRY ASSET PENDING</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Technical Industrial SVG Pipeline - Fits EXACTLY to Image Frame Borders */}
              <div className="ind-pipeline-overlay" aria-hidden="true">
                <svg viewBox="0 0 500 450" fill="none" preserveAspectRatio="none">
                  {/* Background Technical Path */}
                  <path
                    className="ind-pipe-bg"
                    d="M -380 225 H 0 V 12 Q 0 0 12 0 H 488 Q 500 0 500 12 V 438 Q 500 450 488 450 H 12 Q 0 450 0 438 V 235"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Active Highlighted Gold Path */}
                  <path
                    ref={pathRef}
                    className="ind-pipe-active"
                    d="M -380 225 H 0 V 12 Q 0 0 12 0 H 488 Q 500 0 500 12 V 438 Q 500 450 488 450 H 12 Q 0 450 0 438 V 235"
                    stroke="var(--accent)"
                    strokeWidth="3.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(215, 168, 90, 0.7))' }}
                  />
                  {/* Technical Nodes along exact outer image border */}
                  <circle cx="-380" cy="225" r="4.5" fill={activeIndex >= 0 ? 'var(--accent)' : 'rgba(255,255,255,0.2)'} />
                  <circle cx="0" cy="12" r="4.5" fill={activeIndex >= 0 ? 'var(--accent)' : 'rgba(255,255,255,0.2)'} />
                  <circle cx="250" cy="0" r="4.5" fill={activeIndex >= 1 ? 'var(--accent)' : 'rgba(255,255,255,0.2)'} />
                  <circle cx="500" cy="12" r="4.5" fill={activeIndex >= 2 ? 'var(--accent)' : 'rgba(255,255,255,0.2)'} />
                  <circle cx="500" cy="438" r="4.5" fill={activeIndex >= 3 ? 'var(--accent)' : 'rgba(255,255,255,0.2)'} />
                  <circle cx="12" cy="450" r="4.5" fill={activeIndex >= 4 ? 'var(--accent)' : 'rgba(255,255,255,0.2)'} />
                  <circle cx="0" cy="235" r="4.5" fill={activeIndex >= 5 ? 'var(--accent)' : 'rgba(255,255,255,0.2)'} />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Final Section Message Banner */}
        <div className="ind-final-banner site-container">
          <p className="eyebrow">LUMINOUS INDUSTRIES</p>
          <h3>{finalBanner}</h3>
        </div>
      </div>

      {/* Mobile & Tablet Stacked List (< 901px) */}
      <div className="ind-mobile-list site-container">
        <div className="section-heading">
          <p className="eyebrow">{t('industries.eyebrow')}</p>
          <h2>{t('industries.title')}</h2>
          <p>{t('industries.description')}</p>
        </div>

        {Array.isArray(sectors) &&
          sectors.map((sec, i) => {
            const itemConfig = industrySectors[i]
            const currentStage = imageStage[itemConfig?.id || i] || 0
            const imgSrc = itemConfig ? getImageSrc(itemConfig) : ''
            return (
              <article key={sec.id || i} className="ind-mobile-item">
                <div className="ind-mobile-media">
                  {currentStage < 2 && itemConfig ? (
                    <>
                      <img
                        src={imgSrc}
                        alt={sec.title}
                        loading="lazy"
                        onError={() => handleImageError(itemConfig.id)}
                      />
                      <div className="ind-media-overlay" />
                    </>
                  ) : (
                    <div className={`ind-placeholder-card ind-placeholder-${itemConfig?.id || 'oil-gas'}`}>
                      <div className="ind-placeholder-center">
                        <span className="ind-placeholder-title">{itemConfig?.label}</span>
                        <span className="ind-placeholder-sub">FINAL LUMINOUS INDUSTRY ASSET PENDING</span>
                      </div>
                    </div>
                  )}
                  <span className="ind-mobile-num">{itemConfig?.number}</span>
                </div>
                <div className="ind-mobile-content">
                  <span className="ind-mobile-badge">{itemConfig?.number} / 06</span>
                  <h3>{sec.title}</h3>
                  <p className="ind-sector-desc">{sec.description}</p>

                  {Array.isArray(sec.tags) && (
                    <div className="ind-tags-list">
                      {sec.tags.map((tag) => (
                        <span key={tag} className="ind-tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}

        <div className="ind-mobile-final">
          <p className="eyebrow">LUMINOUS INDUSTRIES</p>
          <h3>{finalBanner}</h3>
        </div>
      </div>
    </section>
  )
}
