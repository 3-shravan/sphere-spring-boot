import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks"
import { showErrorToast } from "@/lib/api/api-responses"
import { useGetUsers } from "@/shared/api/useMutations"

export const useSearchUsers = (query) => {
  const { mutateAsync: getUsers, isPending: loading } = useGetUsers()
  const [users, setUsers] = useState([])
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery.trim()) {
        setUsers([])
        return
      }
      try {
        const response = await getUsers({ query: debouncedQuery })
        setUsers(response?.users || [])
      } catch (error) {
        showErrorToast(error)
        setUsers([])
      }
    }

    fetchUsers()
  }, [debouncedQuery, getUsers])

  return { users, loading }
}
