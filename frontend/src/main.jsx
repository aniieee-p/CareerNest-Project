import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/axiosInstance.js' // registers Authorization header interceptor globally
import App from './App.jsx'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from 'next-themes'
import { GoogleOAuthProvider } from '@react-oauth/google'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const hasGoogleClientId = Boolean(
  googleClientId && googleClientId !== 'your_google_web_client_id'
)
const app = (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="careernest-theme">
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <Toaster richColors theme="system" />
  </ThemeProvider>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {hasGoogleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        {app}
      </GoogleOAuthProvider>
    ) : (
      app
    )}
  </StrictMode>,
)
