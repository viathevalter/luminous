import { useTranslation } from 'react-i18next'

export function CTA() {
  const { t } = useTranslation()
  return (
    <section id="contact" className="cta-section section-space">
      <div className="site-container cta-inner">
        <p className="eyebrow">{t('cta.eyebrow')}</p>
        <h2>{t('cta.title')}</h2>
        <p>{t('cta.description')}</p>
        <a className="btn btn-primary" href="mailto:comercial@luminous.com">{t('cta.button')}</a>
      </div>
    </section>
  )
}
