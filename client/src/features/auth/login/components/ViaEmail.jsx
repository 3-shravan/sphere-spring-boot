import styles from "@features/auth/shared/auth.module.css"
import { MdLock, MdMarkEmailUnread } from "@lib"
import { motion } from "framer-motion"

const ViaEmail = ({ handleChange, formData }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, ease: "circIn" }}
    >
      <div className={styles.inputWrapper}>
        <MdMarkEmailUnread className="absolute left-3 mx-auto h-6 border-zinc-700 border-r-1 pr-2 text-[1.7rem] text-zinc-300" />{" "}
        <input
          type="email"
          placeholder=" e.g sphere@gmail.com"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e)}
          className={styles.inputField}
        />
      </div>

      <div className={styles.inputWrapper}>
        <MdLock className="absolute left-3 mx-auto h-6 border-zinc-700 border-r-1 pr-2 text-[1.7rem] text-zinc-300" />

        <input
          type="password"
          placeholder=" password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e)}
          className={styles.inputField}
        />
      </div>
    </motion.div>
  )
}

export default ViaEmail
