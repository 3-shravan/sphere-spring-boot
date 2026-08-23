import { useAuth } from "@context"
import { useApi } from "@hooks"
import { IoIosArrowBack } from "@lib"
import { setTokenAndAuthenticated } from "@utils"
import { motion } from "framer-motion"
import styles from "@/features/auth/shared/auth.module.css"
import { InputOtp } from "../../shared"
import RedirectToLogin from "./RedirectToLogin"

const VerifyOTP = ({
  formData,
  handlePrevious,
  isResend,
  resendHandler,
  showError,
  resendLoading,
  text,
}) => {
  const { setAuth } = useAuth()

  const { request, loading } = useApi()

  const handleResendOtp = () => {
    isResend ? resendHandler() : showError()
  }

  const handleOtpSubmit = async (otp) => {
    const requestData = { otp, email: formData.email }

    const response = await request({
      endpoint: "auth/verify-otp",
      method: "POST",
      body: requestData,
      redirect: "/feeds",
    })

    if (response.status === 200) {
      setAuth({
        token: response.data.token,
        isAuthenticated: true,
        profile: response.data.user,
      })
      setTokenAndAuthenticated(response.data.token, true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, ease: "linear" }}
    >
      <form action="" className={styles.formContainer}>
        <h1 className={styles.heading1}>
          <IoIosArrowBack onClick={handlePrevious} className={styles.backIcon} />
        </h1>
        <h2 className={styles.inputName}>
          We sent you a Verification Code on{" "}
          <span className={styles.email}>
            {formData.email}
          </span>
        </h2>

        <InputOtp handleOtpSubmit={handleOtpSubmit} loading={loading} />
      </form>

      <button
        type="button"
        onClick={() => handleResendOtp()}
        className="resendOtp"
        disabled={resendLoading}
      >
        {resendLoading ? "..." : text}
      </button>

      <RedirectToLogin />
    </motion.div>
  )
}

export default VerifyOTP
