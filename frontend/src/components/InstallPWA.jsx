import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    // Don't show install prompt if running inside Capacitor
    const isCapacitor = window.Capacitor !== undefined
    if (isCapacitor) return

    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Store the event so it can be triggered later
      setDeferredPrompt(e)
      // Show install button
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowInstall(false)
  }

  const handleDismiss = () => {
    setShowInstall(false)
  }

  if (!showInstall) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[9997]">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-2xl p-4 text-white">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
            <Download size={24} />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-semibold text-sm mb-1">Install CareerNest</h3>
            <p className="text-xs text-white/90">
              Add CareerNest to your home screen for quick access
            </p>
          </div>
        </div>
        <button
          onClick={handleInstallClick}
          className="mt-3 w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-50 transition-colors text-sm"
        >
          Install App
        </button>
      </div>
    </div>
  )
}
