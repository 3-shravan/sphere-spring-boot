import styles from "@features/auth/shared/auth.module.css"
import { useNavigate } from "@lib"

const RedirectToSignup = () => {
  const navigate = useNavigate()

  const handleSignUpClick = () => {
    navigate("/signup", { replace: true })
  }

  return (
    <div className={styles.redirectLine}>
      <span>
        {" "}
        New Here ?{" "}
        <span
          onClick={handleSignUpClick}
          className={styles.redirectLink}
          style={{ cursor: "pointer" }}
        >
          SignUp.
        </span>{" "}
      </span>
    </div>
  )
}

export default RedirectToSignup
