import { fetcher } from "@/lib/api/fetcher"
export const birthdayApi = {
  getTodaysBirthdays: () => fetcher({ endpoint: "/users/birthdays" }),
}
