const PULSEIQ_API_KEY = import.meta.env.VITE_PULSEIQ_API_KEY;
const PULSEIQ_PROJECT_ID =
  import.meta.env.VITE_PULSEIQ_PROJECT_ID || "69d7b17578726b59a91928d9";
const PULSEIQ_ENDPOINT =
  import.meta.env.VITE_PULSEIQ_ENDPOINT ||
  "https://pulseiq-ffio.onrender.com/api/ingest/event";

const ANONYMOUS_ID_STORAGE_KEY = "pulseiq_anonymous_id";

let lastTrackedPageUrl = null;
let lastIdentifySignature = null;

function hasPulseIQConfig() {
  return Boolean(PULSEIQ_API_KEY && PULSEIQ_PROJECT_ID && PULSEIQ_ENDPOINT);
}

function createAnonymousId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getAnonymousId() {
  if (typeof window === "undefined") {
    return "server_event";
  }

  try {
    let anonymousId = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);

    if (!anonymousId) {
      anonymousId = createAnonymousId();
      window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, anonymousId);
    }

    return anonymousId;
  } catch {
    return createAnonymousId();
  }
}

async function sendPulseIQEvent(payload) {
  if (!hasPulseIQConfig()) {
    console.warn("[PulseIQ] Missing frontend config. Event not sent.", {
      hasApiKey: Boolean(PULSEIQ_API_KEY),
      hasProjectId: Boolean(PULSEIQ_PROJECT_ID),
      hasEndpoint: Boolean(PULSEIQ_ENDPOINT),
      eventName: payload?.eventName,
    });
    return false;
  }

  try {
    const response = await fetch(PULSEIQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": PULSEIQ_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn("[PulseIQ] Frontend event rejected.", {
        eventName: payload?.eventName,
        status: response.status,
        response: errorText,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.warn("[PulseIQ] Frontend event failed.", {
      eventName: payload?.eventName,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export async function track(eventName, userId = null, properties = {}) {
  return sendPulseIQEvent({
    projectId: PULSEIQ_PROJECT_ID,
    eventName,
    userId: userId || undefined,
    anonymousId: getAnonymousId(),
    properties,
  });
}

export async function identify(userId, traits = {}) {
  if (!userId) {
    return false;
  }

  const signature = JSON.stringify({ userId, traits });
  if (signature === lastIdentifySignature) {
    return false;
  }

  lastIdentifySignature = signature;
  return track("identify", userId, traits);
}

export async function trackPageView({ userId = null, properties = {} } = {}) {
  if (typeof window === "undefined") {
    return false;
  }

  const path = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;
  const url = `${window.location.origin}${path}${search}${hash}`;

  if (url === lastTrackedPageUrl) {
    return false;
  }

  lastTrackedPageUrl = url;

  return track("page_view", userId, {
    path,
    search: search || undefined,
    hash: hash || undefined,
    route: `${path}${search}${hash}`,
    title: document.title || undefined,
    referrer: document.referrer || undefined,
    url,
    ...properties,
  });
}

export async function trackScreenView(screenName, userId = null, properties = {}) {
  return track("screen_view", userId, {
    screenName,
    ...properties,
  });
}

export function resetPulseIQIdentityCache() {
  lastIdentifySignature = null;
}

export { PULSEIQ_PROJECT_ID, PULSEIQ_ENDPOINT };
