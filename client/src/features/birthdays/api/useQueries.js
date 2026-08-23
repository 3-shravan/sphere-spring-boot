import { useQuery } from "@tanstack/react-query"
import { birthdayApi } from "./birthday-api"
import { BIRTHDAY_QUERY_KEYS } from "./query-keys"

export const useTodaysBirthdays = () =>
  useQuery({
    queryKey: BIRTHDAY_QUERY_KEYS.todaysBirthdays,
    queryFn: () => birthdayApi.getTodaysBirthdays(),
    meta: { showError: true },
  })
