import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function PWAUpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('CareerNest PWA registered')
    },
    onRegisterError(error) {
      console.log('CareerNest PWA registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <>
      {(offlineReady || needRefresh) && (
        <div className="fixed bottom-4 right-4 z-[9999] max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {offlineReady ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    CareerNest is ready for offline use
                  </p>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    New version available!
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {needRefresh && (
                  <button
                    onClick={() => updateServiceWorker(true)}
                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Update
                  </button>
                )}
                <button
                  onClick={close}
                  className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
