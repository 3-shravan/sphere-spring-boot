import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error("Caught by ErrorBoundary:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackUi
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      )
    }
    return this.props.children
  }
}

const FallbackUi = ({ error, onReset }) => {
  const navigate = useNavigate()
  const [viewDetails, setViewDetails] = useState(false)
  const isDev = import.meta.env.VITE_MODE === "development"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-2 bg-foreground p-4 px-6 text-center text-background">
      <h1 className="font-bold text-4xl">Something went wrong 😢</h1>

      <div className="mt-6 rounded border border-red-200 bg-red-50 p-3 px-8 text-center text-red-500 text-sm">
        <pre className="whitespace-pre-wrap break-words">{error.message || "Unknown error"}</pre>
      </div>
      <div className="mt-2 flex gap-4 font-Gilroy text-sm">
        <button
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded-xl bg-neutral-800 px-5 py-2 text-white"
        >
          Reload Page
        </button>
        <button
          onClick={() => {
            onReset()
            navigate("/")
          }}
          className="cursor-pointer rounded-xl bg-neutral-800 px-5 py-2 font-medium text-neutral-500"
        >
          Go Home
        </button>
      </div>

      {isDev && (
        <>
          <button
            onClick={() => setViewDetails((prev) => !prev)}
            className="mt-6 cursor-pointer rounded-full bg-card/10 px-3 py-1 text-rose-400 text-xs hover:text-rose-700"
          >
            {viewDetails ? "Hide Details" : "View Error"}
          </button>

          {viewDetails && error.stack && (
            <pre className="w-full overflow-auto whitespace-pre-wrap break-words rounded-lg bg-rose-100 p-3 font-bold font-mono text-neutral-700 text-xs">
              {error.stack}
            </pre>
          )}
        </>
      )}
    </div>
  )
}

export default ErrorBoundary
