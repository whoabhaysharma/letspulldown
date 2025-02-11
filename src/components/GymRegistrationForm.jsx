"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function GymRegistrationMobile() {
  const [formData, setFormData] = useState({
    gymName: "",
    ownerName: "",
    mobileNumber: "",
    address: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 text-center fixed top-0 left-0 right-0 z-10">
        <h1 className="text-2xl font-bold">Gym Registration</h1>
      </header>
      <main className="flex-grow pt-20 pb-6 px-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gymName" className="text-lg">
              Gym Name
            </Label>
            <Input
              id="gymName"
              name="gymName"
              placeholder="Enter gym name"
              value={formData.gymName}
              onChange={handleChange}
              required
              className="h-12 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName" className="text-lg">
              Owner Name
            </Label>
            <Input
              id="ownerName"
              name="ownerName"
              placeholder="Enter owner name"
              value={formData.ownerName}
              onChange={handleChange}
              required
              className="h-12 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobileNumber" className="text-lg">
              Mobile Number
            </Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              placeholder="Enter mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="h-12 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-lg">
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter gym address"
              value={formData.address}
              onChange={handleChange}
              required
              className="min-h-[100px] text-lg"
            />
          </div>
        </form>
      </main>
      <footer className="py-4 px-6 bg-gray-100 fixed bottom-0 left-0 right-0">
        <Button type="submit" className="w-full h-14 text-lg font-semibold" onClick={handleSubmit}>
          Register Gym
        </Button>
      </footer>
    </div>
  )
}

