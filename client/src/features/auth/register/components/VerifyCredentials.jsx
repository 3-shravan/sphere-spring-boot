import styles from "@features/auth/shared/auth.module.css"
import { IoIosArrowBack, MdMarkEmailUnread } from "@lib"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

const VerifyCredentials = ({ formData, handleChange, handlePrevious }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, ease: "linear" }}
    >
      <h1 className={styles.heading1}>
        <IoIosArrowBack className={styles.backIcon} onClick={handlePrevious} />
      </h1>
      <h1 className={`${styles.heading1} ${styles.heading2}`}>Let us verify you !</h1>

      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, ease: "linear" }}
        className="mt-6"
      >
        <h2 className={styles.inputName}>By Email</h2>
        <div className={styles.inputWrapper}>
          <MdMarkEmailUnread className="absolute left-3 mx-auto h-7 border-zinc-700 pr-2 text-[1.7rem] text-zinc-300" />

          <input
            ref={inputRef}
            type="email"
            placeholder=" e.g sphere@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VerifyCredentials
