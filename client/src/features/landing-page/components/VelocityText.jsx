import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion"
import { Asterisk } from "lucide-react"
import { useRef } from "react"

const VelocityText = () => {
  const targetRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const scrollVelocity = useVelocity(scrollYProgress)

  const skewXRaw = useTransform(scrollVelocity, [-0.5, 0.5], ["45deg", "-45deg"])
  const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 400, damping: 50 })

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -3000])
  const x = useSpring(xRaw, { mass: 3, stiffness: 200, damping: 50 })

  return (
    <section ref={targetRef} className="h-[700vh] text-neutral-900 md:h-[1000vh]">
      <div className="sticky top-0 flex h-[50vh] items-center overflow-hidden">
        <motion.p
          style={{ skewX, x }}
          className="flex origin-bottom-left items-center justify-center whitespace-nowrap font-Futura text-8xl text-neutral-900 leading-[0.85] tracking-tighter md:text-9xl md:leading-[0.95]"
        >
          <span className="pr-8 font-light font-mono text-neutral-800">&gt;&gt;&gt;&gt;</span> where
          moments meet trends
          <Asterisk size={150} color="grey" strokeWidth={25} absoluteStrokeWidth />
          <span className="font-Futura text-second lowercase">Join us today</span>
          <Asterisk size={150} color="grey" strokeWidth={25} absoluteStrokeWidth />
        </motion.p>
      </div>
    </section>
  )
}

export const FuzzyOverlay = () => {
  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      // You can download these PNGs here:
      // https://www.hover.dev/black-noise.png
      // https://www.hover.dev/noise.png
      style={{
        // backgroundImage: 'url("https://www.hover.dev/black-noise.png")',
        backgroundImage: 'url("https://www.hover.dev/noise.png")',
      }}
      className="-inset-[100%] pointer-events-none absolute opacity-[10%]"
    />
  )
}

export default VelocityText
