import { FaGithub, FaLinkedin, FaTwitter, FaUserAstronaut } from "@lib"
import { motion } from "framer-motion"
import { HeartIcon } from "lucide-react"
import { FaInstagram } from "react-icons/fa"

export default function Menu() {
  return (
    <motion.div
      initial={{ y: -800, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -800, opacity: 0 }}
      transition={{
        delay: 0.1,
        duration: 1,
        ease: "anticipate",
      }}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 font-Gilroy"
    >
      <div className="flex h-[65vh] flex-col items-center justify-center text-center">
        <FaUserAstronaut className="mb-4 animate-pulse text-9xl text-emerald-600" />
        <div className="text-lg text-white/35 tracking-wide drop-shadow-lg">
          developed by <HeartIcon className="inline" size={17} color="red" /> <br />
          <span className="font-bold text-white text-xl">Shravan </span>
        </div>
        <p className="mt-2 font-medium text-neutral-700 text-sm">Crafting with code & creativity</p>

        <div className="mt-4 flex gap-6 text-white/80">
          <a
            href="https://github.com/3-shravan"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 hover:text-emerald-400"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com/in/shravan"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 hover:text-emerald-400"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://x.com/__9teen_"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 hover:text-emerald-400"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com/03_shravan"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 hover:text-emerald-400"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>

      <span className="absolute bottom-1 text-xs text-yellow-100">Copyright © 2025</span>
    </motion.div>
  )
}
