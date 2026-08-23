import { useIgnoreLenisScroll } from "@eightmay/use-custom-lenis"
import { AnimatePresence, motion } from "framer-motion"
import { SearchedUser } from "./SearchedUser"
export const SearchResults = ({ users, loading, isOpen }) => {
  useIgnoreLenisScroll(".scroll")
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dropdown"
          initial={{ opacity: 0, y: 9 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 7 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
          }}
          className="scroll absolute z-50 mt-4 max-h-[390px] w-full overflow-y-auto bg-background p-1 font-Futura md:w-1/2"
        >
          {loading ? (
            <p className="m-1 px-5 py-2 font-Poppins text-second text-xs">Searching...</p>
          ) : (
            users.map((user) => <SearchedUser key={user._id} user={user} />)
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
