import { Marquee, Menu } from "@components"
import { useMenu } from "@context"
import { AnimatePresence } from "framer-motion"
import {
  Chats,
  Connect,
  Day,
  Footer,
  Gradient,
  MagnetButton,
  Nearby,
  Notificaton,
  PhoneMockup,
  Post,
  RevealLinks,
  SignUpButton,
  StackedCards,
  UnreadMessage,
  VelocityText,
} from "../components"
import styles from "../styles/page.module.css"

export default function Page() {
  const { menu } = useMenu()
  return (
    <div className={`${styles.page}`}>
      <div className={styles.marqueeTop}>
        <Marquee direction="left" />
      </div>

      <main className={styles.mainContent}>
        <AnimatePresence>{menu && <Menu />}</AnimatePresence>

        <div className={styles.heroTextWrapper}>
          <h1 className={styles.heroText}>Sphere</h1>
        </div>

        <section className={styles.sectionRevealLinks}>
          <RevealLinks />
          <div className={styles.sectionRevealLinksInner}>
            <Day />
            <SignUpButton />
          </div>
        </section>
        <section className={styles.sectionMagnetButton}>
          <MagnetButton />
        </section>

        <section className={styles.sectionGradient}>
          <Gradient />
          <PhoneMockup />
          <div className="flex w-full flex-col items-center justify-center overflow-hidden">
            <Nearby />
            <Notificaton />
            <Connect />
            <UnreadMessage />
            <Post />
            <Chats />
          </div>
        </section>

        <section className={styles.sectionVelocityText}>
          <VelocityText />
        </section>

        <div className={styles.h1Wrapper}>
          <StackedCards />
        </div>
      </main>
      <div className="flex h-screen w-full flex-col">
        <Footer />
      </div>
      <div className={styles.marqueeBottom}>
        <Marquee />
      </div>
    </div>
  )
}
