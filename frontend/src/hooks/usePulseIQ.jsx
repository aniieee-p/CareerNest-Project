import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PULSEIQ_PROJECT_ID = "69d7b17578726b59a91928d9";
const PULSEIQ_API_KEY = "pk_843c9dc5c77e4b95bf7c3045ef31f553";
const PULSEIQ_ENDPOINT = "https://pulseiq-ffio.onrender.com/api/ingest/event";

async function track(eventName, userId = null, properties = {}) {
  try {
    await fetch(PULSEIQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": PULSEIQ_API_KEY,
      },
      body: JSON.stringify({
        projectId: PULSEIQ_PROJECT_ID,
        eventName,
        userId: userId || undefined,
        anonymousId: "browser_" + Math.random().toString(36).substr(2, 9),
        properties,
      }),
    });
  } catch {
    // silent fail
  }
}

export default function usePulseIQ() {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    const userId = localStorage.getItem('userId') || null; // fallback from redux/localStorage
    track("page_view", userId, {
      path: location.pathname + location.search,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location.pathname, location.search]);
}
