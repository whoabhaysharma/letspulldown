"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";

// 🛡️ Form Validation Schema
const gymSchema = z.object({
  gymName: z.string().min(1, "Gym Name is required"),
  ownerName: z.string().min(1, "Owner Name is required"),
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Enter a valid mobile number"),
  address: z.string().min(1, "Address is required"),
});

export default function GymRegistrationMobile() {
  // Form Handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(gymSchema) });

  // State Management for OTP, loading, and errors
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter()
  // Simulated OTP Functions
  const sendOtp = () =>
    new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        resolve("dummy-otp-sent");
      }, 1000);
    });

  const verifyOtp = (enteredOtp) =>
    new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        enteredOtp === "123456" ? resolve("otp-verified") : reject(new Error("Invalid OTP"));
      }, 1000);
    });

    const onSubmit = async (data) => {
      try {
        const resp = await axios.get(`/api/auth/check-user/${data.mobileNumber}`);
        const isAlreadyRegistered = resp.data?.data?.status;
    
        if (isAlreadyRegistered) {
          router.push('/login');
          return
        }
    
        await sendOtp();
        setOtpSent(true);
        setError("");
      } catch (error) {
        setError("Something went wrong, please try again.");
      }
    };
    

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      await verifyOtp(otp);
      alert("Gym registered successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Header */}
      <div className="flex flex-row gap-4 w-full items-center border-b px-4 py-3 bg-white shadow">
        <Link href="/login">
          <ArrowLeft />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">
          {otpSent ? "OTP Verification" : "Gym Registration"}
        </h1>
      </div>

      {/* OTP Verification Screen */}
      {otpSent ? (
        <div className="w-full max-w-md p-4 flex-1 flex flex-col bg-white shadow-md rounded-lg">
          <p className="mb-4 text-center text-gray-600">
            Please enter the OTP sent to your mobile number.
          </p>
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
            <Alert variant="destructive">
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
      ) : (
        // Registration Form
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4 p-4 flex-1 flex flex-col bg-white shadow-md rounded-lg"
        >
          {/* Gym Name */}
          <div>
            <Label htmlFor="gymName">Gym Name</Label>
            <Input
              id="gymName"
              type="text"
              {...register("gymName")}
              placeholder="Enter Gym Name"
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
              type="text"
              {...register("ownerName")}
              placeholder="Enter Owner Name"
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
              {...register("mobileNumber")}
              placeholder="Enter Mobile Number"
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
              {...register("address")}
              placeholder="Enter Address"
              className="h-24 text-sm"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            {loading ? "Submitting..." : "Register Gym"}
          </Button>
        </form>
      )}
    </div>
  );
}
