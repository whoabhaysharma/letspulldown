"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Phone } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

// Minimal spinner component
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    ></path>
  </svg>
);

const CustomMobileLogin = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const otplessSignin = useRef(null);

  async function validateUser(respData) {
    try {
      const resp = await axios.post("/api/auth/cookieToken", {
        sessionToken: respData?.sessionInfo?.sessionToken,
      });
      if (resp.status === 200) {
        router.push("/");
      }
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  }

  const handleOtpCallback = ({ response, responseType }) => {
    switch (responseType) {
      case "ONETAP":
        validateUser(response);
        break;
      case "OTP_AUTO_READ":
        setOtp(response.otp);
        setLoading(false);
        break;
      case "FAILED":
        setError("Authentication failed. Please try again.");
        setLoading(false);
        break;
      default:
        console.log("Unhandled response type:", responseType);
        setLoading(false);
    }
  };

  const handleScriptLoad = () => {
    if (window.OTPless) {
      otplessSignin.current = new window.OTPless(handleOtpCallback);
    } else {
      setError("Failed to load authentication service.");
    }
  };

  useEffect(() => {
    window.otpless = (otplessUser) => {
      console.log(otplessUser, "OTP LESS USER");
      alert(JSON.stringify(otplessUser));
    };
  }, []);

  const initiatePhoneAuth = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await otplessSignin.current.initiate({
        channel: "PHONE",
        phone,
        countryCode: "+91",
      });
      // After sending OTP, show the OTP input UI
      setOtpSent(true);
    } catch (e) {
      console.error("Error initiating phone auth:", e);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const responseData = await otplessSignin.current.verify({
        channel: "PHONE",
        phone,
        otp,
        countryCode: "+91",
      });
      if (responseData?.response?.errorMessage) {
        setError(responseData?.response?.errorMessage);
      }
    } catch (e) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load the OTPless SDK */}
      <Script
        id="otpless-sdk"
        src="https://otpless.com/v4/headless.js"
        data-appid={process.env.NEXT_PUBLIC_APP_ID}
        onLoad={handleScriptLoad}
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 px-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Fithub</h1>
            <p className="mt-2 text-gray-500">
              Sign in with your mobile number
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {!otpSent ? (
            <>
            <div className="mb-6">
              <Label htmlFor="phone" className="block text-gray-800 text-lg font-medium mb-2">
                Mobile Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your mobile number"
                disabled={loading}
                className="w-full bg-white/80 text-gray-800 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          
            <Button
              onClick={initiatePhoneAuth}
              disabled={loading}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg p-3 transition duration-200"
            >
              {loading ? (
                <>
                  <Spinner />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5 mr-2" />
                  Send OTP
                </>
              )}
            </Button>
          
            <Link href={"/register-gym"} className="text-blue-600 hover:underline block text-center py-3">I'm a gym Owner</Link>
          </>
          
          ) : (
            <>
              <div className="mb-4">
                <Label htmlFor="otp" className="block text-gray-700 mb-2">
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  disabled={loading}
                  className="w-full text-center text-xl border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest"
                />
              </div>

              <Button
                onClick={verifyPhoneOtp}
                disabled={loading}
                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-md p-3 transition duration-200"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomMobileLogin;
