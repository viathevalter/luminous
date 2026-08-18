import { useTranslation } from 'react-i18next'
import { openFormModal } from './FormModal'

export function Footer() {
  const { t } = useTranslation()

  const navTitle = t('footer.navTitle', { defaultValue: 'NAVIGATION' })
  const indTitle = t('footer.indTitle', { defaultValue: 'INDUSTRIES' })
  const contactTitle = t('footer.contactTitle', { defaultValue: 'CONTACT' })
  const rights = t('footer.rights', { defaultValue: '© 2026 Luminous. All rights reserved.' })
  const privacy = t('footer.privacy', { defaultValue: 'Privacy Policy' })
  const terms = t('footer.terms', { defaultValue: 'Terms of Service' })
  const cookies = t('footer.cookies', { defaultValue: 'Cookies' })

  return (
    <footer className="footer-premium">
      <div className="site-container footer-grid">
        {/* Col 1: Brand & Subtitle */}
        <div className="footer-col brand-col">
          <a className="footer-brand" href="#top" aria-label="Luminous home">
            <img
              src="/assets/logo/luminous-logo.svg"
              alt="Luminous"
              className="footer-logo"
              width="175"
              height="75"
            />
          </a>
          <p className="footer-tagline">{t('footer.tagline', { defaultValue: 'Industrial Workforce Solutions' })}</p>
          <p className="footer-subtext">{t('footer.subtext', { defaultValue: 'European experience. International capability.' })}</p>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">{navTitle}</h4>
          <ul className="footer-nav-list">
            <li>
              <a href="#top">{t('nav.home')}</a>
            </li>
            <li>
              <a href="#industries">{t('nav.industries')}</a>
            </li>
            <li>
              <a href="#workforce">{t('nav.workforce')}</a>
            </li>
            <li>
              <a href="#about">{t('nav.about')}</a>
            </li>
            <li>
              <a href="#trabalhadores">
                {t('nav.workers', { defaultValue: 'Trabalhadores' })}
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  openFormModal({ mode: 'contact' })
                }}
              >
                {t('nav.contact')}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Industries Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">{indTitle}</h4>
          <ul className="footer-nav-list">
            {Array.isArray(t('industries.sectors', { returnObjects: true })) &&
              (t('industries.sectors', { returnObjects: true }) as Array<{ id: string; title: string }>).map((sec, i) => (
                <li key={sec.id || i}>
                  <a href="#industries">{sec.title}</a>
                </li>
              ))}
          </ul>
        </div>

        {/* Col 4: Centralized Contact Details */}
        <div className="footer-col contact-col">
          <h4 className="footer-col-title">{contactTitle}</h4>
          <div className="footer-contact-details">
            <div className="footer-contact-item">
              <span className="contact-label">EMAIL</span>
              <a
                className="contact-link"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  openFormModal({ mode: 'contact' })
                }}
              >
                mkt@luminousalley.com
              </a>
            </div>
            <div className="footer-contact-item">
              <span className="contact-label">OPERATIONS</span>
              <span className="contact-value">{t('footer.operationsVal', { defaultValue: 'European Markets' })}</span>
            </div>
            <div className="footer-contact-item">
              <span className="contact-label">RESPONSE TIME</span>
              <span className="contact-value">{t('footer.responseTimeVal', { defaultValue: '24h Operational Response' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="site-container footer-bottom">
        <span className="footer-rights">{rights}</span>
        <div className="footer-legal-links">
          <a href="#contact">{privacy}</a>
          <span className="footer-sep">·</span>
          <a href="#contact">{terms}</a>
          <span className="footer-sep">·</span>
          <a href="#contact">{cookies}</a>
        </div>
      </div>
    </footer>
  )
}
