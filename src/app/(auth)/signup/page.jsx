"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import axios from "axios";
import { useRouter } from "next/navigation";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firebase: "",
    });

    const router = useRouter();

    // Validate form fields
    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: "", password: "", confirmPassword: "", firebase: "" };

        // Email validation
        if (!email) {
            newErrors.email = "Email is required.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid.";
            isValid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required.";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            isValid = false;
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required.";
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle signup with email and password
    const handleSignup = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!validateForm()) return;

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("User created:", user);

            // Send verification email
            await sendEmailVerification(user);
            console.log("Verification email sent to:", user.email);

            // Redirect to a page instructing the user to verify their email
            router.push("/verifyEmail");
        } catch (error) {
            console.error("Error during signup:", error);
            setErrors((prev) => ({
                ...prev,
                firebase: error.message, // Show Firebase error message
            }));
        }
    };

    // Continue with Google
    const continueWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userInfo = await signInWithPopup(auth, provider);
            const idToken = await userInfo.user.getIdToken();

            // Send the request to set a cookie
            const resp = await axios.get("/api/auth/cookieToken", {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (resp.status === 200) {
                router.push("/");
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            setErrors((prev) => ({
                ...prev,
                firebase: error.message, // Show Firebase error message
            }));
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
                    Create an Account
                </h1>

                {/* Firebase Error Message */}
                {errors.firebase && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
                        {errors.firebase}
                    </div>
                )}

                {/* Email, Password, and Confirm Password Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    {/* Email Field */}
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
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
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
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
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
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Sign Up Button */}
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
                    onClick={continueWithGoogle}
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