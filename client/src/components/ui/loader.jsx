import { motion } from "framer-motion"

const Spin = ({ text, radius, fontSize, letterSpacing }) => {
  const characters = text.split("")
  return (
    <motion.div className="relative aspect-square" style={{ width: radius * 2 }}>
      <p aria-label={text} />
      <p
        aria-hidden="true"
        className="absolute top-0 left-1/2 whitespace-nowrap font-bold text-[color:var(--foreground)] mix-blend-difference"
      >
        {characters.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}-${text}`}
            className="absolute top-0 left-1/2 font-Gilroy font-bold"
            style={{
              transformOrigin: `0 ${radius}px`,
              transform: `rotate(${i * letterSpacing}deg)`,
              fontSize,
            }}
          >
            {ch}
          </motion.span>
        ))}
      </p>
    </motion.div>
  )
}

export function Loader() {
  return (
    <div className="absolute inset-0 flex h-full w-screen items-center justify-center overflow-hidden bg-background">
      {/* Spinner 1 */}
      <motion.div
        className="-right-[535px] -bottom-[840px] absolute"
        initial={{ rotate: 45 }}
        animate={{ rotate: -315 }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <Spin
          text="LOADING  LOADING  LOADING  LOADING  LOADING"
          radius={800}
          fontSize="180px"
          letterSpacing={8}
        />
      </motion.div>

      {/* Spinner 2 */}
      <motion.div
        className="-right-[385px] -bottom-[695px] absolute"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <Spin
          text="LOADING  LOADING  LOADING  LOADING"
          radius={650}
          fontSize="180px"
          letterSpacing={10}
        />
      </motion.div>

      {/* Spinner 3 */}
      <motion.div
        className="-right-[200px] -bottom-[510px] absolute"
        initial={{ rotate: -5 }}
        animate={{ rotate: -365 }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <Spin text="LOADING LOADING LOADING" radius={480} fontSize="180px" letterSpacing={15} />
      </motion.div>
    </div>
  )
}
