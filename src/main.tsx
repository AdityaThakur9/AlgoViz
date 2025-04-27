import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'

// Create a simple theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#242424',
      paper: '#1e1e1e',
    },
  },
})

// Add error handling for the root render
try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  )
  
  console.log('App rendered successfully')
} catch (error) {
  console.error('Failed to render app:', error)
  
  // Create a fallback UI if rendering fails
  const fallbackElement = document.createElement('div')
  fallbackElement.style.padding = '20px'
  fallbackElement.style.color = 'white'
  fallbackElement.style.backgroundColor = '#ff4444'
  fallbackElement.innerHTML = `
    <h2>Failed to load application</h2>
    <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
  `
  document.body.appendChild(fallbackElement)
} 