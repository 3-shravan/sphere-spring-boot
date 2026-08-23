import { Link } from "@lib"

const TermsCond = () => {
  return (
    <div className="fixed bottom-1 flex w-full cursor-default items-center justify-center px-4 font-[Gilroy] font-light text-[#656565f0] text-[0.5rem] leading-3 sm:px-6 sm:text-[0.7rem] md:px-8 md:text-[0.6rem] lg:px-10">
      <div className="w-full max-w-[70%] text-center leading-2.5 sm:max-w-[70%] sm:leading-3 md:max-w-[45%] lg:max-w-[38%]">
        <span>
          <Link to="/privacy-policy" className="cursor-pointer ease-in-out hover:underline">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link to="/terms-conditions" className="cursor-pointer ease-in-out hover:underline">
            Terms & Conditions.
          </Link>
        </span>
      </div>
    </div>
  )
}

export default TermsCond
