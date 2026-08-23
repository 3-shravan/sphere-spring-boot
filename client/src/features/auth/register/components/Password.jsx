import styles from "@features/auth/shared/auth.module.css"
import { IoIosArrowBack, MdLock, MdNavigateNext } from "@lib"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { AuthButton } from "../../shared"
import RedirectToLogin from "./RedirectToLogin"

const Password = ({ handleNext, formData, handleChange, handlePrevious }) => {
  const inputRef = useRef(null)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleNext()
    }
  }
  useEffect(() => {
    inputRef.current.focus()
  }, [])
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, ease: "linear" }}
      >
        <h1 className={styles.heading1}>
          <IoIosArrowBack onClick={handlePrevious} className={styles.backIcon} />
        </h1>
        <h1 className={styles.heading2}>Create a secure password. </h1>
        <h2 className={styles.inputName}>Password</h2>
        <div className={styles.inputWrapper}>
          <MdLock className="absolute left-2.5 h-6 border-zinc-700 pr-2 text-3xl text-zinc-100" />

          <input
            ref={inputRef}
            type="password"
            placeholder=" • • • • • •"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange(e)}
            onKeyDown={handleKeyDown}
            className={styles.inputField}
          />
        </div>
      </motion.div>
      <AuthButton
        handleNext={handleNext}
        text="Next"
        type="button"
        register={true}
        icon={<MdNavigateNext />}
      />
      <RedirectToLogin />
    </>
  )
}

export default Password
