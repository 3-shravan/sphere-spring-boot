import { useNavigate } from "@lib"
import { motion } from "framer-motion"
import { Button } from "../ui/button"

export default function NonExistRoutes() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 text-third">
      <motion.h1
        className="mb-4 font-bold text-6xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        404
      </motion.h1>
      <motion.p
        className="mb-8 max-w-xl text-center font-Poppins font-medium text-3xl text-neutral-700 uppercase leading-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        The page you’re looking for doesn’t exist or has been moved.
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Home
        </Button>
      </motion.div>
    </div>
  )
}
