import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading, setUser } from "@/redux/authSlice";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_SIGNUP_STORAGE_KEY = "careernest.googleSignup";
const hasGoogleClientId = Boolean(
  googleClientId && googleClientId !== "your_google_web_client_id"
);

export const storeGoogleSignup = (payload) => {
  sessionStorage.setItem(GOOGLE_SIGNUP_STORAGE_KEY, JSON.stringify(payload));
};

export const readGoogleSignup = () => {
  const raw = sessionStorage.getItem(GOOGLE_SIGNUP_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(GOOGLE_SIGNUP_STORAGE_KEY);
    return null;
  }
};

export const clearGoogleSignup = () => {
  sessionStorage.removeItem(GOOGLE_SIGNUP_STORAGE_KEY);
};

const GoogleAuthButton = ({ role, text = "continue_with" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [width, setWidth] = useState("320");

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) {
        return;
      }

      const nextWidth = Math.max(220, Math.floor(containerRef.current.offsetWidth));
      setWidth(String(nextWidth));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Google did not return a valid sign-in token.");
      return;
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/google`,
        {
          credential: credentialResponse.credential,
          role,
          intent: "login",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        clearGoogleSignup();
        dispatch(setUser(res.data.user));
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
        navigate(res.data.user?.role === "recruiter" ? "/admin/companies" : "/");
      }
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.requiresRegistration) {
        const pendingGoogleSignup = {
          credential: credentialResponse.credential,
          role,
          ...responseData.signupData,
        };

        storeGoogleSignup(pendingGoogleSignup);
        toast.info("Google account verified. Complete sign up to continue.");
        navigate("/signup", {
          state: { googleSignup: pendingGoogleSignup },
        });
        return;
      }

      toast.error(responseData?.message || "Google sign-in failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!hasGoogleClientId) {
    return (
      <button
        type="button"
        disabled
        className="w-full py-[0.82rem] rounded-xl border text-[0.8125rem] font-semibold mt-4 opacity-70 cursor-not-allowed"
        style={{
          background: "var(--cn-input-bg)",
          color: "var(--cn-text-2)",
          borderColor: "var(--cn-input-border)",
        }}
      >
        Add a real `VITE_GOOGLE_CLIENT_ID` to enable Google sign-in
      </button>
    );
  }

  return (
    <div ref={containerRef} className="w-full mt-4 overflow-hidden rounded-xl">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed")}
        text={text}
        theme="outline"
        size="large"
        shape="rectangular"
        width={width}
        use_fedcm_for_prompt
      />
    </div>
  );
};

export default GoogleAuthButton;
