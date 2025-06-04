import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { ThemeProvider } from "./components/theme-provider.tsx"

// Update the initializeApp function to handle the error more gracefully
// and check for alternative root element IDs

function initializeApp() {
  // Try to find the root element with different possible IDs
  let rootElement = document.getElementById("root")

  // If not found, try alternative IDs or create the element
  if (!rootElement) {
    console.warn("Root element with id='root' not found, trying alternatives...")

    // Try common alternative IDs
    rootElement =
      document.getElementById("app") ||
      document.getElementById("react-root") ||
      document.querySelector("main") ||
      document.querySelector("div")

    // If still not found, create a new div element
    if (!rootElement) {
      console.warn("Creating new root element...")
      rootElement = document.createElement("div")
      rootElement.id = "root"
      document.body.appendChild(rootElement)
    }
  }

  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  )
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp)
} else {
  // DOM is already ready
  initializeApp()
}
