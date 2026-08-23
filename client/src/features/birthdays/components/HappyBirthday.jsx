import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { useAuth } from "@/context"

export default function BirthdayHeader() {
  const { isBirthday, auth } = useAuth()
  const [confetti, setConfetti] = useState(true)

  useEffect(() => {
    if (isBirthday) {
      const t = setTimeout(() => setConfetti(false), 8000)
      return () => clearTimeout(t)
    }
  }, [isBirthday])

  if (!isBirthday) return null

  return (
    <div className="w-full font-Poppins">
      {confetti && (
        <Confetti
          width={document.getElementById("header-bar")?.offsetWidth || 1500}
          height={800}
          numberOfPieces={500}
          recycle={true}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="text-center font-blackout font-semibold text-xs uppercase tracking-widest md:text-sm"
      >
        Happy Birthday,{" "}
        <span className="text-rose-300">
          {" "}
          {auth?.profile?.fullName || auth?.profile?.name || "Friend"}🎉
        </span>
      </motion.div>
    </div>
  )
}
