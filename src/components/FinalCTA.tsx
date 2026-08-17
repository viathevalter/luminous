import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { openFormModal } from './FormModal'

gsap.registerPlugin(ScrollTrigger)

export function FinalCTA() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  const eyebrow = t('finalCta.eyebrow')
  const title = t('finalCta.title')
  const description = t('finalCta.description')
  const primary = t('finalCta.primary')
  const secondary = t('finalCta.secondary')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-fade-in',
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
    <section ref={sectionRef} id="contact" className="cta-section section-space">
      <div className="site-container cta-inner">
        <p className="eyebrow cta-fade-in">{eyebrow}</p>
        <h2 className="cta-fade-in">{title}</h2>
        <p className="cta-fade-in">{description}</p>
        <div className="cta-actions cta-fade-in">
          <a
            className="btn btn-primary"
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              openFormModal({ mode: 'workforce' })
            }}
          >
            {primary} <span className="btn-arrow">→</span>
          </a>
          <a
            className="btn btn-secondary"
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              openFormModal({ mode: 'contact' })
            }}
          >
            {secondary}
          </a>
        </div>
      </div>
    </section>
  )
}
