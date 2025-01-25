"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();

    // Convert Firebase error codes to human-readable messages
    const getHumanReadableError = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-email":
                return "The email address is invalid.";
            case "auth/user-not-found":
                return "No account found with this email address.";
            case "auth/wrong-password":
                return "Incorrect password. Please try again.";
            case "auth/invalid-credential":
                return "Invalid email or password. Please check your credentials.";
            case "auth/email-not-verified":
                return "Please verify your email before logging in.";
            case "auth/too-many-requests":
                return "Too many failed attempts. Please try again later.";
            default:
                return "An error occurred. Please try again.";
        }
    };

    // Handle email/password login
    const handleLogin = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true); // Start loading
        setError(""); // Clear previous errors

        try {
            // Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if email is verified
            if (!user.emailVerified) {
                setError("Please verify your email before logging in.");
                setLoading(false); // Stop loading
                return;
            }

            await axios.get('/api/auth/cookieToken', {
                headers: {
                    Authorization: `Bearer ${await user.getIdToken()}`,
                },
            })

            // Redirect to home page after successful login
            router.push("/");
            setLoading(false)
        } catch (error) {
            console.error("Error during login:", error);
            setError(getHumanReadableError(error.code)); // Show human-readable error message
        } finally {
            // setLoading(false); // Stop loading
        }
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        setLoading(true); // Start loading
        setError(""); // Clear previous errors

        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            await axios.get('/api/auth/cookieToken', {
                headers: {
                    Authorization: `Bearer ${await user.getIdToken()}`,
                },
            })

            // Redirect to home page after successful login
            router.push("/");
        } catch (error) {
            console.error("Error during Google login:", error);
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
                    Welcome Back
                </h1>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Email and Password Form */}
                <form onSubmit={handleLogin} className="space-y-4">
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
                            disabled={loading} // Disable input while loading
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <Link
                            href="/forgotPassword"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? "Logging in..." : "Login"}
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
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={loading} // Disable button while loading
                >
                    <Image
                        src="/google_logo.webp" // Replace with your Google icon path
                        alt="Google"
                        width={20}
                        height={20}
                    />
                    <span>{loading ? "Logging in..." : "Continue with Google"}</span>
                </Button>

                {/* Signup Link */}
                <div className="text-center text-sm text-gray-600 mt-6">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:underline">
                        Sign up
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

export default Login;