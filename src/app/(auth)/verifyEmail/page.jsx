"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";

const VerifyEmail = () => {
    const [email, setEmail] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const router = useRouter();

    // Get the current user's email
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email || "");
        } else {
            // If no user is logged in, redirect to the signup page
            router.push("/signup");
        }
    }, [router]);

    // Handle resending the verification email
    const handleResendEmail = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await sendEmailVerification(user);
                setIsEmailSent(true);
                console.log("Verification email resent to:", user.email);
            } catch (error) {
                console.error("Error resending verification email:", error);
                alert("Failed to resend verification email. Please try again.");
            }
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
                    Verify Your Email
                </h1>

                {/* Instructions */}
                <div className="text-center text-gray-600 mb-6">
                    <p>
                        We’ve sent a verification email to{" "}
                        <span className="font-semibold">{email}</span>.
                    </p>
                    <p>
                        Please check your inbox (and spam folder) and click the link in the email to
                        verify your account.
                    </p>
                </div>

                {/* Resend Email Button */}
                <div className="text-center">
                    <Button
                        onClick={handleResendEmail}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Resend Verification Email
                    </Button>
                    {isEmailSent && (
                        <p className="mt-2 text-sm text-green-600">
                            Verification email resent successfully!
                        </p>
                    )}
                </div>

                {/* Back to Signup Link */}
                <div className="text-center text-sm text-gray-600 mt-6">
                    <Link href="/signup" className="text-blue-600 hover:underline">
                        Back to Sign Up
                    </Link>
                </div>
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

export default VerifyEmail;