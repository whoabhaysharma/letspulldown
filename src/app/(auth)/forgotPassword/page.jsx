"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state

    // Convert Firebase error codes to human-readable messages
    const getHumanReadableError = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-email":
                return "The email address is invalid.";
            case "auth/user-not-found":
                return "No account found with this email address.";
            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";
            default:
                return "An error occurred. Please try again.";
        }
    };

    // Handle password reset
    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validate email
        if (!email) {
            setError("Email is required.");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email is invalid.");
            return;
        }

        setLoading(true); // Start loading
        setError(""); // Clear previous errors
        setSuccessMessage(""); // Clear previous success messages

        try {
            // Send password reset email
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage("A password reset link has been sent to your email.");
        } catch (error) {
            console.error("Error during password reset:", error);
            setError(getHumanReadableError(error.code)); // Show human-readable error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

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
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Forgot Password
                </h1>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm text-center">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleResetPassword} className="space-y-4">
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
                            disabled={loading} // Disable input while loading
                        />
                    </div>

                    {/* Reset Password Button */}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? "Sending reset link..." : "Reset Password"}
                    </Button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center text-sm text-gray-600 mt-6">
                    Remember your password?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 p-6">
                By continuing, you agree to our{" "}
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

export default ForgotPassword;