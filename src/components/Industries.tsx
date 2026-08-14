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
  { id: 'oil-gas', number: '01', label: 'OIL & GAS', webp: '/assets/industries/oil-gas.png', png: '/assets/industries/oil-gas.png' },
  { id: 'petrochemical', number: '02', label: 'PETROCHEMICAL', webp: '/assets/industries/petrochemical.png', png: '/assets/industries/petrochemical.png' },
  { id: 'refineries', number: '03', label: 'REFINERIES', webp: '/assets/industries/refineries.png', png: '/assets/industries/refineries.png' },
  { id: 'energy', number: '04', label: 'ENERGY', webp: '/assets/industries/energy.png', png: '/assets/industries/energy.png' },
  { id: 'shipyards', number: '05', label: 'SHIPYARDS & MARINE', webp: '/assets/industries/shipyards.png', png: '/assets/industries/shipyards.png' },
  { id: 'construction', number: '06', label: 'INDUSTRIAL CONSTRUCTION', webp: '/assets/industries/industrial-construction.png', png: '/assets/industries/industrial-construction.png' },
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

  const [activeMobileIndex, setActiveMobileIndex] = useState(0)

  const sectors = t('industries.sectors', { returnObjects: true }) as SectorData[]
  const finalBanner = t('industries.finalBanner', { defaultValue: 'ONE INDUSTRIAL PARTNER. MULTIPLE SECTORS.' })

  const getImageSrc = (s: IndustrySectorConfig) => {
    const stage = imageStage[s.id] || 0
    if (stage === 0) return s.webp
    if (stage === 1) return s.png
    return ''
  }

  const handleImageError = (id: string) => {
    setImageStage((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  useEffect(() => {
    const blocks = document.querySelectorAll('.ind-mobile-block')
    if (!blocks.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'))
            if (!isNaN(idx)) {
              setActiveMobileIndex(idx)
            }
          }
        })
      },
      {
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0.2,
      }
    )

    blocks.forEach((block) => observer.observe(block))
    return () => observer.disconnect()
  }, [])

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

        // Sectors 02 to 06 start hidden
        industrySectors.slice(1).forEach((_, i) => {
          const idx = i + 1
          gsap.set(`.ind-card-${idx}`, { opacity: 0, autoAlpha: 0, y: 30 })
          gsap.set(`.ind-img-${idx}`, { opacity: 0, autoAlpha: 0, scale: 1.05, clipPath: 'inset(100% 0 0 0)' })
        })

        // Master Timeline pinned for 3600px of scroll storytelling
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

        // SVG pipeline stroke draw animation synced to scroll
        const path = pathRef.current
        if (path) {
          const pathLength = path.getTotalLength()
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          })

          masterTl.to(
            path,
            {
              strokeDashoffset: 0,
              ease: 'none',
            },
            0
          )
        }

        // Sectors 0 to 5 (3600px distribution)
        const ranges = [
          { start: 0, end: 0.16 },
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

        masterTl.to(
          '.ind-progress-bar',
          { opacity: 0, autoAlpha: 0, duration: 0.02 },
          0.94
        )
        masterTl.fromTo(
          '.ind-final-banner',
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
    <section ref={sectionRef} id="industries" className="industries-scroll-section">
      {/* Desktop Sticky Viewport */}
      <div className="ind-desktop-viewport">
        <div className="site-container ind-desktop-layout">
          {/* Left Column (38-42%): Intro, Active Sector & Progress Bar */}
          <div className="ind-left-col">
            <div className="section-heading ind-heading ind-heading-intro">
              <p className="eyebrow">{t('industries.eyebrow')}</p>
              <h2>{t('industries.title')}</h2>
              <p>{t('industries.description')}</p>
            </div>

            {/* Sector Content Stage */}
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
                      <div className="ind-card-meta">
                        <span className="ind-microcopy">TARGET SECTOR</span>
                        <span className="ind-meta-sep">•</span>
                        <span className="ind-number-badge">
                          {itemConfig?.number} / 0{industrySectors.length}
                        </span>
                      </div>

                      <h3 className="ind-sector-title">{sec.title}</h3>
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
                  )
                })}
            </div>
          </div>

          {/* Right Column (58-62%): Large Dominant Media Frame */}
          <div className="ind-right-col" aria-hidden="true">
            <div className="ind-media-frame-container">
              {/* SVG Pipeline Draw Overlay */}
              <svg className="ind-svg-pipeline" viewBox="0 0 500 500" fill="none">
                <path
                  ref={pathRef}
                  d="M 20 480 L 20 20 L 480 20 L 480 480"
                  stroke="#FFB42B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

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
                            alt=""
                            loading="lazy"
                            onError={() => handleImageError(s.id)}
                          />
                          <div className="ind-media-overlay" />
                        </>
                      ) : (
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
            </div>
          </div>
        </div>

        {/* Final Section Message Banner */}
        <div className="ind-final-banner site-container">
          <p className="eyebrow">LUMINOUS INDUSTRIES</p>
          <h3>{finalBanner}</h3>
        </div>
      </div>

      {/* Mobile Sticky Storytelling Experience (< 769px) */}
      <div className="ind-mobile-list site-container">
        <div className="section-heading ind-mobile-heading">
          <p className="eyebrow">{t('industries.eyebrow')}</p>
          <h2>{t('industries.title')}</h2>
          <p>{t('industries.description')}</p>
        </div>

        {/* Sticky Mobile Image Frame */}
        <div className="ind-mobile-sticky-frame">
          {industrySectors.map((s, i) => {
            const isActive = i === activeMobileIndex
            const imgSrc = getImageSrc(s)

            return (
              <div
                key={s.id}
                className={`ind-mobile-sticky-img-wrap ${isActive ? 'active' : ''}`}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={s.label}
                    className="ind-mobile-sticky-img"
                    onError={() => handleImageError(s.id)}
                  />
                ) : (
                  <div className={`ind-placeholder-card ind-placeholder-${s.id}`}>
                    <span className="ind-placeholder-title">{s.label}</span>
                  </div>
                )}
                <div className="ind-mobile-sticky-overlay" />
              </div>
            )
          })}

          <div className="ind-mobile-sticky-badge">
            <span>INDUSTRIES</span>
            <span className="sep">•</span>
            <span className="badge-num">{industrySectors[activeMobileIndex]?.number || '01'} / 06</span>
          </div>
        </div>

        {/* 6 Mobile Content Blocks with Left Line Segment */}
        <div className="ind-mobile-blocks">
          {Array.isArray(sectors) &&
            sectors.map((sec, i) => {
              const itemConfig = industrySectors[i]
              const isActive = i === activeMobileIndex
              return (
                <div
                  key={sec.id || i}
                  data-index={i}
                  className={`ind-mobile-block ${isActive ? 'active' : ''}`}
                >
                  <p className="ind-mobile-block-num">{itemConfig?.number}</p>
                  <h3 className="ind-mobile-block-title">{sec.title}</h3>
                  <p className="ind-mobile-block-desc">{sec.description}</p>

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

        <div className="ind-mobile-final">
          <p className="eyebrow">LUMINOUS INDUSTRIES</p>
          <h3>{finalBanner}</h3>
        </div>
      </div>
    </section>
  )
}
