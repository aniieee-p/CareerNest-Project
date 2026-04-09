const PULSEIQ_API_KEY = process.env.PULSEIQ_API_KEY;
const PULSEIQ_PROJECT_ID =
  process.env.PULSEIQ_PROJECT_ID || "69d7b17578726b59a91928d9";
const PULSEIQ_ENDPOINT =
  process.env.PULSEIQ_ENDPOINT ||
  "https://pulseiq-ffio.onrender.com/api/ingest/event";

async function track(eventName, userId = null, properties = {}, anonymousId = "server_event") {
  if (!PULSEIQ_API_KEY) {
    console.warn("[PulseIQ] Missing backend config. Event not sent.", {
      hasApiKey: Boolean(PULSEIQ_API_KEY),
      hasProjectId: Boolean(PULSEIQ_PROJECT_ID),
      hasEndpoint: Boolean(PULSEIQ_ENDPOINT),
      eventName,
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
      body: JSON.stringify({
        projectId: PULSEIQ_PROJECT_ID,
        eventName,
        userId: userId || undefined,
        anonymousId,
        properties,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn("[PulseIQ] Backend event rejected.", {
        eventName,
        status: response.status,
        response: errorText,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.warn("[PulseIQ] Backend event failed.", {
      eventName,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export { track };

// Example
// await track("user_registered", newUser._id, { email: newUser.email });
// await track("payment_success", req.user._id, { amount: order.total });
