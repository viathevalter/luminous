import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { openFormModal } from './FormModal'

gsap.registerPlugin(ScrollTrigger)

type CountryItem = {
  code: string
  name: string
}

type PillarItem = {
  number: string
  title: string
  description: string
}

export function EuropeanExperience() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  const eyebrow = t('europeanExperience.eyebrow')
  const title = t('europeanExperience.title')
  const description = t('europeanExperience.description')
  const countries = t('europeanExperience.countries', { returnObjects: true }) as CountryItem[]
  const pillars = t('europeanExperience.pillars', { returnObjects: true }) as PillarItem[]
  const intEyebrow = t('europeanExperience.internationalEyebrow')
  const intTitle = t('europeanExperience.internationalTitle')
  const intDesc = t('europeanExperience.internationalDescription')
  const impactStatement = t('europeanExperience.impactStatement')
  const ctaTitle = t('europeanExperience.ctaTitle')
  const ctaSupporting = t('europeanExperience.ctaSupporting')
  const ctaButton = t('europeanExperience.ctaButton')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Fade-in animation for general editorial blocks
      gsap.utils.toArray<HTMLElement>('.euro-fade-in').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        )
      })

      // Horizontal line draw animation for countries timeline (Do NOT alter countries section)
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.euro-timeline-container',
              start: 'top 85%',
            },
          }
        )
      }

      // Sequential fade-in for country items (Do NOT alter countries section)
      gsap.fromTo(
        '.euro-timeline-item',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.euro-timeline-container',
            start: 'top 85%',
          },
        }
      )

      // Capabilities Entrance Sequence: Number -> Line grows -> Title & Desc fade+translate
      gsap.utils.toArray<HTMLElement>('.euro-pillar-item').forEach((item) => {
        const num = item.querySelector('.euro-pillar-num')
        const line = item.querySelector('.euro-pillar-divider')
        const body = item.querySelectorAll('.euro-pillar-title, .euro-pillar-desc')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
        })

        // 1. Number appears first
        tl.fromTo(num, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
        // 2. Line grows left to right
        tl.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.45, ease: 'power2.out' },
          '-=0.15'
        )
        // 3. Title and description enter with fade + translateY
        tl.fromTo(
          body,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.1 },
          '-=0.25'
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="euro-section section-space">
      <div className="site-container euro-container">
        {/* Part 1: European Experience Header */}
        <div className="section-heading euro-heading euro-fade-in">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="euro-intro-desc">{description}</p>
        </div>

        {/* Part 2: Editorial 6 European Industrial Markets Timeline (APPROVED - DO NOT ALTER) */}
        <div className="euro-timeline-container euro-fade-in">
          <div className="euro-timeline-label">
            <span>EUROPEAN INDUSTRIAL MARKETS</span>
          </div>

          <div className="euro-timeline-track-wrapper">
            <div ref={lineRef} className="euro-timeline-track" />
          </div>

          <div className="euro-timeline-grid">
            {Array.isArray(countries) &&
              countries.map((c, i) => (
                <div key={c.code || i} className="euro-timeline-item">
                  <div className="euro-timeline-connector" aria-hidden="true" />
                  <div className="euro-timeline-node">
                    <span className="euro-node-dot" aria-hidden="true" />
                    <span className="euro-node-num">0{i + 1}</span>
                  </div>
                  <span className="euro-country-name">{c.name}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Part 3: 4 Strategic Capabilities (Refined 2x2 Open Editorial Layout) */}
        <div className="euro-pillars-wrapper">
          <div className="euro-pillars-heading euro-fade-in">
            <p className="eyebrow">CAPABILITIES</p>
            <h3>Built around operational capability.</h3>
          </div>
          <div className="euro-pillars-grid">
            {Array.isArray(pillars) &&
              pillars.map((pillar) => (
                <article key={pillar.number} className="euro-pillar-item">
                  <span className="euro-pillar-num">{pillar.number}</span>
                  <div className="euro-pillar-divider" />
                  <h4 className="euro-pillar-title">{pillar.title}</h4>
                  <p className="euro-pillar-desc">{pillar.description}</p>
                </article>
              ))}
          </div>
        </div>

        {/* Part 4: Open Editorial International Capability Block */}
        <div className="euro-international-block euro-fade-in">
          <div className="euro-int-content">
            <p className="eyebrow">{intEyebrow}</p>
            <h2>{intTitle}</h2>
            <p>{intDesc}</p>
          </div>
        </div>

        {/* Part 5: Big Impact Statement */}
        <div className="euro-impact-statement euro-fade-in">
          <h2>
            {impactStatement.split('\n').map((line, idx) => (
              <span key={idx} className="euro-impact-line">
                {line}
                {idx === 0 && <br />}
              </span>
            ))}
          </h2>
        </div>

        {/* Part 6: Section CTA */}
        <div className="euro-cta-block euro-fade-in">
          <div className="euro-cta-inner">
            <div className="euro-cta-text">
              <p className="eyebrow">{ctaTitle}</p>
              <p className="euro-cta-sub">{ctaSupporting}</p>
            </div>
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
      </div>
    </section>
  )
}
