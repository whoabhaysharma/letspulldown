"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import axios from "axios";
import { useRouter } from "next/navigation";

const Signup = () => {
    const [step, setStep] = useState("signup");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");

    const router = useRouter()

    // Dummy function to handle signup
    const handleSignup = () => {
        console.log("Signing up with:", { email, password });
        // Simulate OTP sent to email
        setStep("otp");
    };

    // Dummy function to handle OTP verification
    const handleVerifyOtp = () => {
        console.log("Verifying OTP:", otp);
        alert("OTP verified! Account created successfully.");
        // Redirect to login or dashboard
    };

    const continueWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        try {
            const userInfo = await signInWithPopup(auth, provider);
            const idToken = await userInfo.user.getIdToken()
            // Send the request
            const resp = await axios.get(
                "/api/auth/cookieToken", // URL
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Ensure this is correct
                    },
                }
            );

            if (resp.status === 200) {
                router.push("/")
            }

        } catch (error) {
            console.log(error, 'ERROR')
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="flex items-center justify-center p-8">
                <Image
                    src="/logo.png" // Replace with your logo path
                    alt="Logo"
                    width={80}
                    height={80}
                    className="rounded-lg"
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center px-6">
                {step === "signup" ? (
                    <>
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Create an Account
                        </h1>

                        {/* Email, Password, and Confirm Password Form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSignup();
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-700">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                Sign Up
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center justify-center my-6">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="mx-4 text-sm text-gray-500">OR</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        {/* Continue with Google */}
                        <Button
                            onClick={() => continueWithGoogle()}
                            variant="outline"
                            className="w-full flex items-center justify-center space-x-2"
                        >
                            <Image
                                src="/google_logo.webp" // Replace with your Google icon path
                                alt="Google"
                                width={20}
                                height={20}
                            />
                            <span>Continue with Google</span>
                        </Button>

                        {/* Login Link */}
                        <div className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        {/* OTP Verification UI */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Verify OTP
                        </h1>
                        <p className="text-sm text-gray-600 text-center mb-6">
                            We’ve sent a 6-digit OTP to <span className="font-semibold">{email}</span>.
                        </p>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleVerifyOtp();
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-gray-700">
                                    Enter OTP
                                </Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                Verify OTP
                            </Button>
                        </form>

                        {/* Resend OTP Link */}
                        <div className="text-center text-sm text-gray-600 mt-6">
                            Didn’t receive the OTP?{" "}
                            <button
                                onClick={() => alert("OTP resent!")}
                                className="text-blue-600 hover:underline"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 p-6">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                </Link>
                .
            </div>
        </div>
    );
};

export default Signup;