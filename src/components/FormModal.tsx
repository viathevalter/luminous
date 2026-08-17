import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export type FormModalMode = 'workforce' | 'contact'

export interface FormModalEventDetail {
  mode?: FormModalMode
  sector?: string
  role?: string
}

// Global helper to trigger the modal from anywhere in the codebase
export function openFormModal(detail?: FormModalEventDetail) {
  window.dispatchEvent(
    new CustomEvent('open-form-modal', {
      detail: detail || { mode: 'workforce' },
    })
  )
}

const DESTINATION_EMAIL = 'mkt@luminousalley.com'
const WHATSAPP_NUMBER = '351912345678' // Luminous operations contact

export function FormModal() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<FormModalMode>('workforce')

  // Workforce Form State
  const [wfName, setWfName] = useState('')
  const [wfCompany, setWfCompany] = useState('')
  const [wfEmail, setWfEmail] = useState('')
  const [wfPhone, setWfPhone] = useState('')
  const [wfSector, setWfSector] = useState('')
  const [wfRoles, setWfRoles] = useState<string[]>([])
  const [wfHeadcount, setWfHeadcount] = useState('')
  const [wfLocation, setWfLocation] = useState('')
  const [wfStartDate, setWfStartDate] = useState('')
  const [wfMessage, setWfMessage] = useState('')

  // Contact Form State
  const [ctName, setCtName] = useState('')
  const [ctCompany, setCtCompany] = useState('')
  const [ctEmail, setCtEmail] = useState('')
  const [ctPhone, setCtPhone] = useState('')
  const [ctSubject, setCtSubject] = useState('')
  const [ctMessage, setCtMessage] = useState('')

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const modalRef = useRef<HTMLDivElement>(null)

  // Listen to open-form-modal events
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<FormModalEventDetail>
      if (customEvent.detail?.mode) {
        setMode(customEvent.detail.mode)
      }
      if (customEvent.detail?.role) {
        setWfRoles((prev) =>
          prev.includes(customEvent.detail!.role!) ? prev : [...prev, customEvent.detail!.role!]
        )
      }
      if (customEvent.detail?.sector) {
        setWfSector(customEvent.detail.sector)
      }
      setIsSuccess(false)
      setErrorMessage(null)
      setIsOpen(true)
    }

    window.addEventListener('open-form-modal', handleOpen)
    return () => window.removeEventListener('open-form-modal', handleOpen)
  }, [])

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setIsSuccess(false)
    setErrorMessage(null)
  }

  const toggleWfRole = (roleKey: string) => {
    setWfRoles((prev) =>
      prev.includes(roleKey) ? prev.filter((r) => r !== roleKey) : [...prev, roleKey]
    )
  }

  // Available Sector & Role Options
  const sectorOptions = [
    { value: 'Oil & Gas', label: t('chat.sectors.oilGas', { defaultValue: 'Petróleo & Gás' }) },
    { value: 'Petrochemical', label: t('chat.sectors.petro', { defaultValue: 'Petroquímica' }) },
    { value: 'Refineries', label: t('chat.sectors.refinery', { defaultValue: 'Refinarias' }) },
    { value: 'Energy', label: t('chat.sectors.energy', { defaultValue: 'Energia' }) },
    { value: 'Shipyards & Marine', label: t('chat.sectors.shipyard', { defaultValue: 'Estaleiros & Naval' }) },
    { value: 'Industrial Construction', label: 'Construção Industrial' },
    { value: 'Other', label: t('chat.sectors.other', { defaultValue: 'Outro Setor' }) },
  ]

  const technicalRoles = [
    { id: 'welders', label: t('chat.roles.welders', { defaultValue: 'Soldadores (TIG / MIG / MMA)' }) },
    { id: 'pipefitters', label: t('chat.roles.pipefitters', { defaultValue: 'Tubistas Industriais' }) },
    { id: 'boilermakers', label: t('chat.roles.boilermakers', { defaultValue: 'Caldeireiros' }) },
    { id: 'mechanics', label: t('chat.roles.mechanics', { defaultValue: 'Mecânicos Industriais' }) },
    { id: 'electricians', label: t('chat.roles.electricians', { defaultValue: 'Eletricistas' }) },
    { id: 'supervisors', label: t('chat.roles.supervisors', { defaultValue: 'Supervisores / Chefes de Equipa' }) },
    { id: 'otherRole', label: t('chat.roles.otherRole', { defaultValue: 'Outros Perfis Técnicos' }) },
  ]

  const handleWorkforceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!wfName.trim() || !wfCompany.trim() || !wfEmail.trim() || !wfPhone.trim() || !wfSector || !wfLocation.trim()) {
      setErrorMessage(t('forms.validation.required'))
      return
    }

    if (wfRoles.length === 0) {
      setErrorMessage(t('forms.validation.selectRole'))
      return
    }

    if (!/\S+@\S+\.\S+/.test(wfEmail)) {
      setErrorMessage(t('forms.validation.invalidEmail'))
      return
    }

    setIsSubmitting(true)

    const payload = {
      _subject: `[Luminous Workforce] Nova Solicitação de Mão de Obra - ${wfCompany} (${wfName})`,
      _template: 'table',
      _captcha: 'false',
      _replyto: wfEmail,
      'Formulário': 'Solicitação de Mão de Obra Industrial',
      'Nome do Responsável': wfName,
      'Empresa': wfCompany,
      'E-mail Corporativo': wfEmail,
      'Telefone / WhatsApp': wfPhone,
      'Setor Industrial': wfSector,
      'Perfis Técnicos Requeridos': wfRoles.map((r) => technicalRoles.find((tr) => tr.id === r)?.label || r).join('; '),
      'Dimensão Estimada da Equipa': wfHeadcount || 'Não especificado',
      'Localização do Projeto': wfLocation,
      'Previsão de Início': wfStartDate || 'A definir',
      'Detalhes / Requisitos Adicionais': wfMessage || 'Sem observações adicionais',
      'Idioma': i18n.language.toUpperCase(),
      'Enviado em': new Date().toLocaleString(),
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSuccess(true)
        resetWfForm()
      } else {
        throw new Error('Falha no envio do formulário')
      }
    } catch {
      // Fallback: create mailto link if ajax fails
      const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
        payload._subject
      )}&body=${encodeURIComponent(
        `Nome: ${wfName}\nEmpresa: ${wfCompany}\nEmail: ${wfEmail}\nTelefone: ${wfPhone}\nSetor: ${wfSector}\nPerfis: ${payload['Perfis Técnicos Requeridos']}\nLocalização: ${wfLocation}\nPrazo: ${wfStartDate}\nMensagem:\n${wfMessage}`
      )}`
      window.location.href = mailtoUrl
      setIsSuccess(true)
      resetWfForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!ctName.trim() || !ctEmail.trim() || !ctPhone.trim() || !ctSubject || !ctMessage.trim()) {
      setErrorMessage(t('forms.validation.required'))
      return
    }

    if (!/\S+@\S+\.\S+/.test(ctEmail)) {
      setErrorMessage(t('forms.validation.invalidEmail'))
      return
    }

    setIsSubmitting(true)

    const payload = {
      _subject: `[Luminous Contato] ${ctSubject} - ${ctName} (${ctCompany || 'Geral'})`,
      _template: 'table',
      _captcha: 'false',
      _replyto: ctEmail,
      'Formulário': 'Contacto Geral / Informações',
      'Nome Completo': ctName,
      'Empresa': ctCompany || 'Não informada',
      'E-mail': ctEmail,
      'Telefone / WhatsApp': ctPhone,
      'Assunto': ctSubject,
      'Mensagem': ctMessage,
      'Idioma': i18n.language.toUpperCase(),
      'Enviado em': new Date().toLocaleString(),
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSuccess(true)
        resetCtForm()
      } else {
        throw new Error('Falha no envio')
      }
    } catch {
      const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
        payload._subject
      )}&body=${encodeURIComponent(
        `Nome: ${ctName}\nEmpresa: ${ctCompany}\nEmail: ${ctEmail}\nTelefone: ${ctPhone}\nAssunto: ${ctSubject}\nMensagem:\n${ctMessage}`
      )}`
      window.location.href = mailtoUrl
      setIsSuccess(true)
      resetCtForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetWfForm = () => {
    setWfName('')
    setWfCompany('')
    setWfEmail('')
    setWfPhone('')
    setWfSector('')
    setWfRoles([])
    setWfHeadcount('')
    setWfLocation('')
    setWfStartDate('')
    setWfMessage('')
  }

  const resetCtForm = () => {
    setCtName('')
    setCtCompany('')
    setCtEmail('')
    setCtPhone('')
    setCtSubject('')
    setCtMessage('')
  }

  if (!isOpen) return null

  return (
    <div
      className="form-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div className="form-modal-container" ref={modalRef}>
        {/* Modal Header */}
        <div className="form-modal-header">
          <div className="form-modal-tabs">
            <button
              type="button"
              className={`form-modal-tab ${mode === 'workforce' ? 'is-active' : ''}`}
              onClick={() => {
                setMode('workforce')
                setErrorMessage(null)
                setIsSuccess(false)
              }}
            >
              <span className="tab-icon">👷</span>
              {t('forms.tabWorkforce')}
            </button>
            <button
              type="button"
              className={`form-modal-tab ${mode === 'contact' ? 'is-active' : ''}`}
              onClick={() => {
                setMode('contact')
                setErrorMessage(null)
                setIsSuccess(false)
              }}
            >
              <span className="tab-icon">✉️</span>
              {t('forms.tabContact')}
            </button>
          </div>

          <button
            type="button"
            className="form-modal-close-btn"
            onClick={handleClose}
            aria-label={t('forms.close')}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="form-modal-body">
          {isSuccess ? (
            <div className="form-success-card">
              <div className="form-success-icon-wrap">
                <svg
                  className="form-success-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h3 id="form-modal-title">
                {mode === 'workforce'
                  ? t('forms.workforce.successTitle')
                  : t('forms.contact.successTitle')}
              </h3>

              <p className="form-success-desc">
                {mode === 'workforce'
                  ? t('forms.workforce.successText')
                  : t('forms.contact.successText')}
              </p>

              <div className="form-success-meta">
                <span className="form-dest-label">Destinatário:</span>
                <span className="form-dest-value">{DESTINATION_EMAIL}</span>
              </div>

              <div className="form-success-actions">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Olá Luminous! Acabei de enviar uma solicitação via site para ${DESTINATION_EMAIL}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="form-btn form-btn-whatsapp"
                >
                  <span>💬</span>
                  {mode === 'workforce'
                    ? t('forms.workforce.whatsappAlt')
                    : t('forms.contact.whatsappAlt')}
                </a>
                <button type="button" className="form-btn form-btn-secondary" onClick={handleClose}>
                  {t('forms.close')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Form Info Header */}
              <div className="form-intro-block">
                <h3 id="form-modal-title">
                  {mode === 'workforce'
                    ? t('forms.workforce.title')
                    : t('forms.contact.title')}
                </h3>
                <p>
                  {mode === 'workforce'
                    ? t('forms.workforce.subtitle')
                    : t('forms.contact.subtitle')}
                </p>
              </div>

              {errorMessage && (
                <div className="form-error-alert" role="alert">
                  <span className="error-icon">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Workforce Mode Form */}
              {mode === 'workforce' && (
                <form className="form-grid-layout" onSubmit={handleWorkforceSubmit} noValidate>
                  {/* Row 1: Name & Company */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="wf-name">{t('forms.workforce.nameLabel')}</label>
                      <input
                        id="wf-name"
                        type="text"
                        required
                        value={wfName}
                        onChange={(e) => setWfName(e.target.value)}
                        placeholder={t('forms.workforce.namePlaceholder')}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="wf-company">{t('forms.workforce.companyLabel')}</label>
                      <input
                        id="wf-company"
                        type="text"
                        required
                        value={wfCompany}
                        onChange={(e) => setWfCompany(e.target.value)}
                        placeholder={t('forms.workforce.companyPlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="wf-email">{t('forms.workforce.emailLabel')}</label>
                      <input
                        id="wf-email"
                        type="email"
                        required
                        value={wfEmail}
                        onChange={(e) => setWfEmail(e.target.value)}
                        placeholder={t('forms.workforce.emailPlaceholder')}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="wf-phone">{t('forms.workforce.phoneLabel')}</label>
                      <input
                        id="wf-phone"
                        type="tel"
                        required
                        value={wfPhone}
                        onChange={(e) => setWfPhone(e.target.value)}
                        placeholder={t('forms.workforce.phonePlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 3: Industrial Sector & Location */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="wf-sector">{t('forms.workforce.sectorLabel')}</label>
                      <select
                        id="wf-sector"
                        required
                        value={wfSector}
                        onChange={(e) => setWfSector(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('forms.workforce.sectorPlaceholder')}</option>
                        {sectorOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="wf-location">{t('forms.workforce.locationLabel')}</label>
                      <input
                        id="wf-location"
                        type="text"
                        required
                        value={wfLocation}
                        onChange={(e) => setWfLocation(e.target.value)}
                        placeholder={t('forms.workforce.locationPlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 4: Roles Required Multi-select Chips */}
                  <div className="form-field-group">
                    <label>
                      {t('forms.workforce.rolesLabel')}{' '}
                      <span className="field-hint">({t('forms.workforce.rolesHint')})</span>
                    </label>
                    <div className="form-chips-container">
                      {technicalRoles.map((role) => {
                        const isSelected = wfRoles.includes(role.id)
                        return (
                          <button
                            type="button"
                            key={role.id}
                            className={`form-chip ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => toggleWfRole(role.id)}
                          >
                            <span className="chip-check">{isSelected ? '✓' : '+'}</span>
                            <span>{role.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Row 5: Headcount & Start Timeline */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="wf-headcount">{t('forms.workforce.headcountLabel')}</label>
                      <select
                        id="wf-headcount"
                        value={wfHeadcount}
                        onChange={(e) => setWfHeadcount(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('forms.workforce.headcountPlaceholder')}</option>
                        <option value="1-4">{t('forms.workforce.headcountOptions.opt1')}</option>
                        <option value="5-15">{t('forms.workforce.headcountOptions.opt2')}</option>
                        <option value="16-30">{t('forms.workforce.headcountOptions.opt3')}</option>
                        <option value="30+">{t('forms.workforce.headcountOptions.opt4')}</option>
                        <option value="TBD">{t('forms.workforce.headcountOptions.opt5')}</option>
                      </select>
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="wf-start">{t('forms.workforce.startDateLabel')}</label>
                      <select
                        id="wf-start"
                        value={wfStartDate}
                        onChange={(e) => setWfStartDate(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('forms.workforce.startDatePlaceholder')}</option>
                        <option value="Immediate">{t('forms.workforce.startDateOptions.immediate')}</option>
                        <option value="1 month">{t('forms.workforce.startDateOptions.month1')}</option>
                        <option value="2-3 months">{t('forms.workforce.startDateOptions.month2_3')}</option>
                        <option value="Tender">{t('forms.workforce.startDateOptions.tender')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 6: Additional Details Message */}
                  <div className="form-field-group">
                    <label htmlFor="wf-message">{t('forms.workforce.messageLabel')}</label>
                    <textarea
                      id="wf-message"
                      rows={3}
                      value={wfMessage}
                      onChange={(e) => setWfMessage(e.target.value)}
                      placeholder={t('forms.workforce.messagePlaceholder')}
                      className="form-textarea"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-btn form-btn-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="btn-spinner" />
                          <span>{t('forms.workforce.submittingBtn')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('forms.workforce.submitBtn')}</span>
                          <span className="btn-arrow">→</span>
                        </>
                      )}
                    </button>
                    <span className="form-secure-badge">🔒 {DESTINATION_EMAIL}</span>
                  </div>
                </form>
              )}

              {/* Contact Mode Form */}
              {mode === 'contact' && (
                <form className="form-grid-layout" onSubmit={handleContactSubmit} noValidate>
                  {/* Row 1: Name & Company */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="ct-name">{t('forms.contact.nameLabel')}</label>
                      <input
                        id="ct-name"
                        type="text"
                        required
                        value={ctName}
                        onChange={(e) => setCtName(e.target.value)}
                        placeholder={t('forms.contact.namePlaceholder')}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="ct-company">{t('forms.contact.companyLabel')}</label>
                      <input
                        id="ct-company"
                        type="text"
                        value={ctCompany}
                        onChange={(e) => setCtCompany(e.target.value)}
                        placeholder={t('forms.contact.companyPlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="ct-email">{t('forms.contact.emailLabel')}</label>
                      <input
                        id="ct-email"
                        type="email"
                        required
                        value={ctEmail}
                        onChange={(e) => setCtEmail(e.target.value)}
                        placeholder={t('forms.contact.emailPlaceholder')}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="ct-phone">{t('forms.contact.phoneLabel')}</label>
                      <input
                        id="ct-phone"
                        type="tel"
                        required
                        value={ctPhone}
                        onChange={(e) => setCtPhone(e.target.value)}
                        placeholder={t('forms.contact.phonePlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 3: Subject */}
                  <div className="form-field-group">
                    <label htmlFor="ct-subject">{t('forms.contact.subjectLabel')}</label>
                    <select
                      id="ct-subject"
                      required
                      value={ctSubject}
                      onChange={(e) => setCtSubject(e.target.value)}
                      className="form-select"
                    >
                      <option value="">{t('forms.contact.subjectPlaceholder')}</option>
                      <option value="Workforce Solutions">{t('forms.contact.subjectOptions.workforce')}</option>
                      <option value="Careers / CV">{t('forms.contact.subjectOptions.careers')}</option>
                      <option value="Partnerships">{t('forms.contact.subjectOptions.partnerships')}</option>
                      <option value="General Info">{t('forms.contact.subjectOptions.info')}</option>
                      <option value="Other">{t('forms.contact.subjectOptions.other')}</option>
                    </select>
                  </div>

                  {/* Row 4: Message */}
                  <div className="form-field-group">
                    <label htmlFor="ct-message">{t('forms.contact.messageLabel')}</label>
                    <textarea
                      id="ct-message"
                      rows={4}
                      required
                      value={ctMessage}
                      onChange={(e) => setCtMessage(e.target.value)}
                      placeholder={t('forms.contact.messagePlaceholder')}
                      className="form-textarea"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-btn form-btn-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="btn-spinner" />
                          <span>{t('forms.contact.submittingBtn')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('forms.contact.submitBtn')}</span>
                          <span className="btn-arrow">→</span>
                        </>
                      )}
                    </button>
                    <span className="form-secure-badge">🔒 {DESTINATION_EMAIL}</span>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
