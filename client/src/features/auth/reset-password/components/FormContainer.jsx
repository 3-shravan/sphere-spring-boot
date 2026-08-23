import styles from "@features/auth/shared/auth.module.css"
import { MdLock, MdLockOutline } from "@lib"

const FormContainer = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div>
      <section className={styles.space1vh}></section>
      <div className={styles.inputWrapper}>
        <MdLockOutline className="absolute left-2.5 mx-auto h-7 border-zinc-700 border-r-1 pr-2 text-3xl text-zinc-100" />

        <input
          type="password"
          placeholder=" New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={(e) => handleChange(e)}
          className={styles.inputField}
        />
      </div>

      <div className={styles.inputWrapper}>
        <MdLock className="absolute left-2.5 mx-auto h-7 border-zinc-700 border-r-1 pr-2 text-3xl text-zinc-100" />
        <input
          type="password"
          placeholder=" Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleChange(e)}
          className={styles.inputField}
        />
      </div>
    </div>
  )
}

export default FormContainer
