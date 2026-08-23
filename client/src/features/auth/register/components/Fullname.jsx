import styles from "@features/auth/shared/auth.module.css"
import { CgProfile, MdNavigateNext } from "@lib"
import { motion } from "framer-motion"
import { CircleCheckBig } from "lucide-react"
import { useEffect, useRef } from "react"
import { GiCrossMark } from "react-icons/gi"
import { Spinner } from "@/components"
import { useUsernameAvailability } from "@/shared"
import { AuthButton } from "../../shared"
import RedirectToLogin from "./RedirectToLogin"

const Fullname = ({ handleNext, formData, handleChange }) => {
  const inputRef = useRef(null)
  const { status, message } = useUsernameAvailability(formData.name)

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
        <h1 className={styles.heading1}>Create New Account</h1>
        <h1 className={` ${styles.heading2}`}>Join today!</h1>
        <h2 className={styles.inputName}>Your username ?</h2>
        <div className={styles.inputWrapper}>
          <CgProfile className="absolute left-2.5 mx-auto h-7 border-zinc-700 pr-2 text-3xl text-zinc-300" />
          <input
            ref={inputRef}
            type="text"
            placeholder=" e.g johndoe"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange(e)}
            onKeyDown={handleKeyDown}
            className={styles.inputField}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
        {status && (
          <p
            className={`mt-1 min-h-[1.25rem] pl-2 text-left font-Gilroy font-medium text-xs ${status === "unavailable" && "text-rose-500"}
              ${status === "available" && "text-emerald-400"}`}
          >
            {status === "checking" ? (
              <span className="flex items-center gap-2">
                Checking if username available
                <Spinner size="2" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                {message}
                {status === "available" ? (
                  <CircleCheckBig className="text-emerald-600" size={12} />
                ) : (
                  <GiCrossMark className="inline text-rose-500 text-sm" />
                )}
              </span>
            )}
          </p>
        )}
      </motion.div>
      <AuthButton
        handleNext={status === "available" && handleNext}
        text="Next"
        type="button"
        register={true}
        icon={<MdNavigateNext />}
      />
      <RedirectToLogin />
    </>
  )
}

export default Fullname
