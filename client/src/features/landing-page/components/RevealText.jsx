import { motion } from "framer-motion"

const RevealLinks = () => {
  return (
    <section className="grid place-content-center gap-2 overflow-hidden bg-black py-14 font-Poppins font-thin text-emerald-200 md:px-10">
      {/* <FlipLink href="#">#Connect</FlipLink>
      <FlipLink href="#">Share</FlipLink>
      <FlipLink href="#">#Post</FlipLink>
      <FlipLink href="#">Message</FlipLink> */}
      <div className="font-Gilroy font-bold text-second tracking-widest">
        <FlipLink href="/login">&gt;Login</FlipLink>
      </div>
    </section>
  )
}

const DURATION = 0.25
const STAGGER = 0.025

const FlipLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-3xl uppercase sm:text-3xl md:text-2xl lg:text-2xl"
      style={{
        lineHeight: 0.75,
      }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-100%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  )
}
export default RevealLinks
