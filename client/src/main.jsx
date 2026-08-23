import "./global.css"
import { registerSW } from "virtual:pwa-register"
import { QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ContextProvider, MenuProvider, ThemeProvider } from "@/context"
import App from "./App.jsx"
import ErrorBoundary from "./components/routing/ErrorBoundary"
import { queryClient } from "./lib/services/queryQlient"

registerSW({
  onNeedRefresh() {
    console.log("New content available. Refresh!")
  },
  onOfflineReady() {
    console.log("App ready to work offline.")
  },
})
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ErrorBoundary>
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <MenuProvider>
              <App />
            </MenuProvider>
          </ThemeProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </ContextProvider>
    </ErrorBoundary>
  </BrowserRouter>,
)
