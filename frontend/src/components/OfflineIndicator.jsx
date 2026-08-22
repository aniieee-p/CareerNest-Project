import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOffline, setShowOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOffline(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showOffline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] bg-yellow-500 text-white px-4 py-2">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <WifiOff size={16} />
        <span>You're offline. Some CareerNest features require an internet connection.</span>
      </div>
    </div>
  )
}
