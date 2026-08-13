import { useTranslation } from 'react-i18next'

export function GlobalPresence() {
  const { t } = useTranslation()
  return (
    <section id="about" className="global-section section-space">
      <div className="site-container global-container">
        {/* About Luminous Block */}
        <div className="about-block">
          <div className="section-heading">
            <p className="eyebrow">{t('global.about.eyebrow')}</p>
            <h2>{t('global.about.title')}</h2>
          </div>
          <div className="about-content">
            <p>{t('global.about.p1')}</p>
            <p>{t('global.about.p2')}</p>
            <p>{t('global.about.p3')}</p>
          </div>
        </div>

        {/* Global Presence Grid: European Experience & International Capability */}
        <div className="global-grid">
          <div className="global-card europe-card">
            <p className="eyebrow">{t('global.europe.eyebrow')}</p>
            <h2>{t('global.europe.title')}</h2>
            <p>{t('global.europe.description')}</p>
            <p className="countries">{t('global.europe.markets')}</p>
          </div>
          <div className="global-card international-card">
            <p className="eyebrow">{t('global.international.eyebrow')}</p>
            <h2>{t('global.international.title')}</h2>
            <p>{t('global.international.description')}</p>
            <a className="btn btn-secondary" href="#contact">{t('global.international.cta')}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
