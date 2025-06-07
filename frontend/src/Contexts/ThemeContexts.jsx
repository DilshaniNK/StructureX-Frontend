//import from "https://ui.shadcn.com/"
// Import necessary React hooks and PropTypes for type checking
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

// Define the initial state/shape of our theme context
// This serves as the default value and type definition
const initialState = {
  theme: "system", // Default theme preference
  setTheme: () => null, // Placeholder function (will be replaced)
}

// Create the React context with the initial state as default value
export const ThemeProviderContext = createContext(initialState)

// ThemeProvider component - manages theme state and applies it to the DOM
export function ThemeProvider({
  children, // Child components that will have access to theme context
  defaultTheme = "system", // Fallback theme if none is stored (defaults to "system")
  storageKey = "vite-ui-theme", // Key used to store theme preference in localStorage
  ...props // Spread operator to capture any additional props
}) {
  // Initialize theme state from localStorage or use defaultTheme as fallback
  // The function inside useState runs only once during initialization
  const [theme, setTheme] = useState(
    () => (localStorage.getItem(storageKey)) || defaultTheme
  )

  // useEffect runs whenever the 'theme' state changes
  useEffect(() => {
    // Get reference to the document's root element (html tag)
    const root = window.document.documentElement

    // Remove any existing theme classes to avoid conflicts
    root.classList.remove("light", "dark")

    // Handle "system" theme preference
    if (theme === "system") {
      // Check user's system color scheme preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches // Returns true if user prefers dark mode
        ? "dark"  // Apply dark theme
        : "light" // Apply light theme

      // Add the detected system theme class to root element
      root.classList.add(systemTheme)
      return // Exit early since we've handled the system theme
    }

    // For explicit "light" or "dark" themes, add the theme class directly
    root.classList.add(theme)
  }, [theme]) // Dependency array - effect runs when theme changes

  // Create the context value object that will be provided to children
  const value = {
    theme, // Current theme state
    setTheme: (theme) => { // Function to update theme
      localStorage.setItem(storageKey, theme) // Persist theme choice to localStorage
      setTheme(theme) // Update the React state
    },
  }

  // Render the context provider, making theme data available to all children
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// Define prop types for runtime type checking and developer documentation
// Note: Should be 'propTypes' (lowercase 'p') not 'PropTypes'
ThemeProvider.propTypes = {
  children: PropTypes.node,    // Any renderable React content
  defaultTheme: PropTypes.string, // String for default theme
  storageKey: PropTypes.string,   // String for localStorage key
};3