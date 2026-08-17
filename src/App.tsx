import { Header } from './components/Header'
import { HeroScroll } from './components/HeroScroll'
import { WorkforceScroll } from './components/WorkforceScroll'
import { Industries } from './components/Industries'
import { WorkforceDelivery } from './components/WorkforceDelivery'
import { EuropeanExperience } from './components/EuropeanExperience'
import { AboutLuminous } from './components/AboutLuminous'
import { Careers } from './components/Careers'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { ChatWidget } from './components/ChatWidget'
import { FormModal } from './components/FormModal'

export default function App() {
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
        <Careers />
        <FinalCTA />
      </main>
      <Footer />
      <ChatWidget />
      <FormModal />
    </>
  )
}

