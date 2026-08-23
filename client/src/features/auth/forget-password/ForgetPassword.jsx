import React from "react"
import "@styles/auth.css"
import { Header, Menu } from "@components"
import { useMenu } from "@context"
import { useApi } from "@hooks"
import { IoIosArrowBack, MdMotionPhotosOn } from "@lib"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"
import { errorToast, ForgetPasswordFormData, validForgetEmail } from "@/utils"
import { AuthButton, TermsCond } from "../shared"
import authStyles from "../shared/auth.module.css"
import { OtpVerify, ViaEmail } from "./components"

const RESEND_TIME = 30
const ForgetPassword = () => {
  const { menu } = useMenu()
  const [formData, setFormData] = React.useState(ForgetPasswordFormData)
  const [stage, setStage] = React.useState(0)

  const [isResend, setIsResend] = React.useState(true)
  const [resendTimer, setResendTimer] = React.useState(0)

  const { request, loading } = useApi()

  React.useEffect(() => {
    let timer
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setIsResend(true)
    }
  }, [resendTimer])

  const showError = () => errorToast(`Please wait ${resendTimer} seconds before resending OTP.`)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resendHandler = async () => {
    if (!isResend) return errorToast(`Please wait ${resendTimer} seconds before resending OTP.`)

    if (validForgetEmail(formData)) {
      return errorToast("Provide a valid Email address")
    }
    setIsResend(false)

    const response = await request({
      endpoint: "auth/forget-password",
      method: "POST",
      body: formData,
    })
    if (response?.status === 200) {
      setResendTimer(RESEND_TIME)
    } else setIsResend(true)
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!isResend) return errorToast(`Please wait ${resendTimer} seconds before resending OTP.`)

    if (validForgetEmail(formData)) return errorToast("Provide a valid Email address")

    setIsResend(false)
    const response = await request({
      endpoint: "auth/forget-password",
      method: "POST",
      body: formData,
    })
    if (response?.status === 200) {
      setResendTimer(RESEND_TIME)
    } else setIsResend(true)
  }

  return (
    <div className="main">
      <Header />

      <AnimatePresence>{menu && <Menu />}</AnimatePresence>

      {!menu && (
        <motion.div
          className="auth-container forget"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, ease: "linear" }}
        >
          <form
            action=""
            onSubmit={(e) => submitHandler(e)}
            className="auth-form auth-form-transparent"
          >
            <h1 className={authStyles.heading1}>
              <Link to={"/login"}>
                <IoIosArrowBack className={authStyles.backIcon} />
              </Link>
            </h1>
            {stage === 0 && (
              <>
                <motion.h1
                  className={authStyles.heading1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, ease: "linear" }}
                >
                  Forget Your Password ?{" "}
                </motion.h1>

                <ViaEmail handleChange={handleChange} formData={formData} />

                <AuthButton
                  text={isResend ? "Verify" : `Resend in ${resendTimer}s`}
                  type="submit"
                  handleNext={submitHandler}
                  loading={!isResend && loading}
                  icon={<MdMotionPhotosOn className="pl-1 text-black text-m" />}
                />
              </>
            )}
          </form>
          {stage === 1 && (
            <motion.div
              initial={{ opacity: 5 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, ease: "linear" }}
              className="auth-form auth-form-transparent"
            >
              <OtpVerify
                text={isResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
                resendLoading={loading}
                showError={showError}
                resendHandler={resendHandler}
                isResend={isResend}
                formData={formData}
                setStage={setStage}
              />
            </motion.div>
          )}
          <TermsCond />
        </motion.div>
      )}
    </div>
  )
}

export default ForgetPassword
