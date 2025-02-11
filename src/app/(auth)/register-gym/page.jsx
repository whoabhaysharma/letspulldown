"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import your custom OTP input components.
// These components should support controlled behavior via `value` and `onChange` props.
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function GymRegistrationMobile() {
  // React Hook Form for gym registration
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Local state to manage the registration data and OTP process.
  const [formData, setFormData] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dummy function to simulate sending an OTP.
  const sendOtp = () => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        resolve("dummy-otp-sent");
      }, 1000);
    });
  };

  // Dummy function to simulate verifying the OTP.
  const verifyOtp = (enteredOtp) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // For this dummy function, "123456" is considered valid.
        if (enteredOtp === "123456") {
          resolve("otp-verified");
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 1000);
    });
  };

  // Handle registration form submission.
  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    setFormData(data);
    setError("");
    try {
      await sendOtp();
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  // Handle OTP verification.
  const handleVerifyOtp = async () => {
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      await verifyOtp(otp);
      alert("Gym registered successfully!");
      // Optionally, reset state or navigate away.
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Render Registration Form OR OTP Verification Screen ---
  if (!otpSent) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="flex flex-row gap-4 w-full items-center border-b px-4 py-3 bg-white shadow">
          <Link href="/login">
            <ArrowLeft />
          </Link>
          <h1 className="text-lg font-bold text-gray-800">Gym Registration</h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4 p-4 flex-1 flex flex-col bg-white shadow-md rounded-lg"
        >
          <div className="space-y-4">
            {/* Gym Name */}
            <div>
              <Label htmlFor="gymName">Gym Name</Label>
              <Input
                id="gymName"
                {...register("gymName", { required: "Gym Name is required" })}
                placeholder="Enter gym name"
                className="h-10 text-sm"
              />
              {errors.gymName && (
                <p className="text-red-500 text-xs mt-1">{errors.gymName.message}</p>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                {...register("ownerName", { required: "Owner Name is required" })}
                placeholder="Enter owner name"
                className="h-10 text-sm"
              />
              {errors.ownerName && (
                <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                type="tel"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                })}
                placeholder="Enter mobile number"
                className="h-10 text-sm"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register("address", { required: "Address is required" })}
                placeholder="Enter gym address"
                className="h-24 text-sm"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            {loading ? "Submitting..." : "Register Gym"}
          </Button>
        </form>
      </div>
    );
  } else {
    // OTP Verification Screen
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="flex flex-row gap-4 w-full items-center border-b px-4 py-3 bg-white shadow">
          <Link href="/login">
            <ArrowLeft />
          </Link>
          <h1 className="text-lg font-bold text-gray-800">OTP Verification</h1>
        </div>
        <div className="w-full max-w-md p-4 flex-1 flex flex-col bg-white shadow-md rounded-lg">
          <p className="mb-4 text-center text-gray-600">
            Please enter the OTP sent to your mobile number.
          </p>
          
          {/* Using your custom OTP input component */}
          <div className="mb-6 flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button
            onClick={handleVerifyOtp}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </div>
    );
  }
}
