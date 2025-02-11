"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GymRegistrationMobile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="flex flex-row gap-4 w-full items-center border-b px-4 py-3 bg-white shadow">
        <Link href={"/login"}>
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

        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          Register Gym
        </Button>
      </form>
    </div>
  );
}
