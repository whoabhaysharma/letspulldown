"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CustomMobileLogin = () => {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const otplessSignin = useRef(null);

    const handleOtpCallback = ({ response, responseType }) => {
        switch (responseType) {
            case "ONETAP":
                console.log("successfull", response)
                router.push("/");
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
            console.log(otplessUser, 'OTP LESS USER')
            alert(JSON.stringify(otplessUser));
        };
    }, []);

    // Simple spinner component
    const Spinner = () => (
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    const initiatePhoneAuth = async() => {
        if (!phone || phone.length < 10) {
            setError("Please enter a valid phone number.");
            return;
        }
        setError("");
        setLoading(true);

        try{
            const resp = await otplessSignin.current.initiate({
                channel: "PHONE",
                phone,
                countryCode: "+91",
            });
        }catch(e){
            console.log("mobile number is wrong", e)
        }finally{
            setLoading(false);
        }

        // After initiating OTP, show the OTP input UI and stop loading
        setOtpSent(true);
    };

    const verifyPhoneOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
        setError("");
        setLoading(true);

        const resp = await otplessSignin.current.verify({
            channel: "PHONE",
            phone,
            otp,
            countryCode: "+91",
        });
        // Do not call setLoading(false) here; it will be handled in the callback
    };

    return (
        <>
            <Script
                id="otpless-sdk"
                src="https://otpless.com/v4/headless.js"
                data-appid="O5H17S69DOC7VAQQRNGK"
                onLoad={handleScriptLoad}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col justify-center items-center px-4">
                <div className="mb-10">
                    <Image
                        src="/logo.png"
                        alt="App Logo"
                        width={120}
                        height={120}
                        className="rounded-2xl shadow-sm"
                    />
                </div>

                <Card className="w-full max-w-md shadow-sm">
                    <CardHeader className="text-center">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome</h1>
                        <p className="text-slate-500">Sign in with your mobile number</p>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {!otpSent ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Mobile Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your mobile number"
                                        disabled={loading}
                                    />
                                </div>

                                <Button onClick={initiatePhoneAuth} disabled={loading} className="w-full">
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
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="otp">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="6-digit OTP"
                                        className="text-center text-xl tracking-widest"
                                        disabled={loading}
                                    />
                                </div>

                                <Button
                                    onClick={verifyPhoneOtp}
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700"
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

                                <div className="text-center text-sm text-gray-500">
                                    Didn't receive code?{" "}
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtp("");
                                        }}
                                        className="text-blue-600 hover:text-blue-700 p-0"
                                    >
                                        Resend OTP
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="mt-8 text-center text-sm text-gray-500">
                        By continuing, you agree to our{" "}
                        <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">
                            Terms
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">
                            Privacy
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default CustomMobileLogin;
