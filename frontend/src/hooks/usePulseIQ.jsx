import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  identify as identifyPulseIQ,
  resetPulseIQIdentityCache,
  track as trackPulseIQ,
  trackPageView,
  trackScreenView,
} from "@/utils/pulseiq";

function buildTraits(user) {
  if (!user) {
    return {};
  }

  return {
    email: user.email || undefined,
    fullname: user.fullname || undefined,
    phoneNumber: user.phoneNumber || undefined,
    role: user.role || undefined,
  };
}

export function PulseIQRouteTracker() {
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);
  const userIdRef = useRef(user?._id || null);

  useEffect(() => {
    userIdRef.current = user?._id || null;
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      void identifyPulseIQ(user._id, buildTraits(user));
      return;
    }

    resetPulseIQIdentityCache();
  }, [user?._id, user?.email, user?.fullname, user?.phoneNumber, user?.role]);

  useEffect(() => {
    void trackPageView({
      userId: userIdRef.current,
      properties: {
        routePath: location.pathname,
      },
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

export default function usePulseIQ() {
  const user = useSelector((state) => state.auth?.user);
  const userId = user?._id || null;

  return {
    identify: (traits = {}) =>
      userId
        ? identifyPulseIQ(userId, {
            ...buildTraits(user),
            ...traits,
          })
        : false,
    pageView: (properties = {}) =>
      trackPageView({
        userId,
        properties,
      }),
    screenView: (screenName, properties = {}) =>
      trackScreenView(screenName, userId, properties),
    track: (eventName, properties = {}) => trackPulseIQ(eventName, userId, properties),
  };
}
