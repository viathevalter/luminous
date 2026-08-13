import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Careers() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  const eyebrow = t('careers.eyebrow')
  const title = t('careers.title')
  const description = t('careers.description')
  const profiles = t('careers.profiles', { returnObjects: true }) as string[]
  const cta = t('careers.cta')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.careers-fade-in',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="careers" className="careers-section section-space">
      <div className="site-container careers-container">
        <div className="section-heading careers-heading careers-fade-in">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        {/* Profiles Editorial List (NO BOXES / CARDS) */}
        <div className="careers-profiles-ticker careers-fade-in">
          <div className="careers-ticker-line" />
          <div className="careers-profiles-list">
            {Array.isArray(profiles) &&
              profiles.map((prof, i) => (
                <div key={prof || i} className="careers-profile-item">
                  <span className="careers-profile-dot" aria-hidden="true" />
                  <span className="careers-profile-text">{prof}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Careers CTA */}
        <div className="careers-cta-row careers-fade-in">
          <a className="btn btn-primary" href="#contact">
            {cta} <span className="btn-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
