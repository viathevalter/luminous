import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Header } from './components/Header'
import { HeroScroll } from './components/HeroScroll'
import { WorkforceScroll } from './components/WorkforceScroll'
import { Industries } from './components/Industries'
import { WorkforceDelivery } from './components/WorkforceDelivery'
import { EuropeanExperience } from './components/EuropeanExperience'
import { AboutLuminous } from './components/AboutLuminous'
import { WorkersPage } from './components/WorkersPage'
import { Careers } from './components/Careers'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { ChatWidget } from './components/ChatWidget'
import { FormModal } from './components/FormModal'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash
      if (hash) {
        setTimeout(() => {
          const targetId = hash.replace('#', '')
          const el = document.getElementById(targetId)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }, 150)
      }
    }

    if (document.readyState === 'complete') {
      handleInitialHash()
    } else {
      window.addEventListener('load', handleInitialHash, { once: true })
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <HeroScroll />
        <WorkforceScroll />
        <Industries />
        <WorkforceDelivery />
        <EuropeanExperience />
        <AboutLuminous />
        <WorkersPage />
        <Careers />
        <FinalCTA />
      </main>
      <Footer />
      <ChatWidget />
      <FormModal />
    </>
  )
}
