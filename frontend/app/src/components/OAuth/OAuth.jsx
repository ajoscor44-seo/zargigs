import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../config/supabase.config";
import { FaSpinner } from "react-icons/fa6";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";

const GOOGLE_CLIENT_ID = "1084349323934-jraui4goae74n2ka28d3ejgqe8bdtfbp.apps.googleusercontent.com";

const OAuth = ({ setError, text = "Continue with Google" }) => {
  const [disabledBtn, setDisabledBtn] = useState(false);
  const googleBtnRef = useRef(null);
  const history = useHistory();
  const { fetchUserData } = useAuth();

  // Handle direct Google ID token callback from Google Identity Services
  const handleCredentialResponse = async (response) => {
    try {
      setDisabledBtn(true);
      if (!response.credential) {
        throw new Error("No Google ID token received.");
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });

      if (error) throw error;

      await fetchUserData();
      setDisabledBtn(false);
      history.push("/dashboard");
    } catch (err) {
      setDisabledBtn(false);
      if (setError) setError(err.message || "Failed to authenticate with Google.");
      console.error("Google ID Token Error:", err);
    }
  };

  useEffect(() => {
    // Initialize Google Identity Services when script is loaded
    const initGoogleIdentity = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: googleBtnRef.current.offsetWidth || 340,
          });
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleIdentity();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGoogleIdentity();
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, []);

  const triggerGooglePrompt = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // Fallback to Supabase OAuth redirect
      handleOAuthFallback();
    }
  };

  const handleOAuthFallback = async () => {
    try {
      setDisabledBtn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });
      if (error) throw error;
    } catch (error) {
      setDisabledBtn(false);
      if (setError) setError(error.message || "Failed to authenticate with Google.");
    }
  };

  return (
    <div className="w-full">
      <div className="relative my-3.5 flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-2.5 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider absolute">
          Or continue with
        </span>
      </div>

      {/* Google Identity Services Render Container */}
      <div className="w-full flex justify-center">
        <div ref={googleBtnRef} className="w-full max-w-sm flex justify-center min-h-[40px]" />
      </div>

      {/* Custom styled backup button in case Google button iframe is loading */}
      <noscript>
        <button
          type="button"
          onClick={handleOAuthFallback}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2"
        >
          <span>{text}</span>
        </button>
      </noscript>
    </div>
  );
};

export default OAuth;
