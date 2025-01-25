"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const GymsPage = () => {
  // Dummy data for gyms
  const [gyms, setGyms] = useState([
    { id: 1, name: "Gym A", address: "123 Main St, New York, NY" },
    { id: 2, name: "Gym B", address: "456 Elm St, Los Angeles, CA" },
    { id: 3, name: "Gym C", address: "789 Oak St, Chicago, IL" },
  ]);

  // State for creating/updating a gym
  const [isEditing, setIsEditing] = useState(false);
  const [currentGym, setCurrentGym] = useState({ id: null, name: "", address: "" });

  // Handle input change for create/update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentGym({ ...currentGym, [name]: value });
  };

  // Handle form submission (create/update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentGym.name.trim() === "" || currentGym.address.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    if (isEditing) {
      // Update existing gym
      setGyms(
        gyms.map((gym) =>
          gym.id === currentGym.id ? { ...gym, name: currentGym.name, address: currentGym.address } : gym
        )
      );
    } else {
      // Add new gym
      const newGym = { ...currentGym, id: gyms.length + 1 };
      setGyms([...gyms, newGym]);
    }

    // Reset form
    setCurrentGym({ id: null, name: "", address: "" });
    setIsEditing(false);
  };

  // Handle edit gym
  const handleEdit = (gym) => {
    setCurrentGym(gym);
    setIsEditing(true);
  };

  // Handle delete gym
  const handleDelete = (id) => {
    setGyms(gyms.filter((gym) => gym.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Gyms</h1>
        <p className="text-sm text-gray-500">Manage your gyms here</p>
      </div>

      {/* Add Gym Button */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg bg-blue-600 hover:bg-blue-700">
            <Plus size={24} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{isEditing ? "Update Gym" : "Add New Gym"}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Gym Name"
                value={currentGym.name}
                onChange={handleInputChange}
                className="w-full"
              />
              <Input
                type="text"
                name="address"
                placeholder="Gym Address"
                value={currentGym.address}
                onChange={handleInputChange}
                className="w-full"
              />
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentGym({ id: null, name: "", address: "" })}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {isEditing ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>

      {/* List of Gyms */}
      <div className="space-y-4">
        {gyms.map((gym) => (
          <Card key={gym.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{gym.name}</h2>
                  <p className="text-sm text-gray-500">{gym.address}</p>
                </div>
                <div className="flex space-x-2">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(gym)}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <Edit size={16} />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Update Gym</DrawerTitle>
                      </DrawerHeader>
                      <div className="p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <Input
                            type="text"
                            name="name"
                            placeholder="Gym Name"
                            value={currentGym.name}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                          <Input
                            type="text"
                            name="address"
                            placeholder="Gym Address"
                            value={currentGym.address}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCurrentGym({ id: null, name: "", address: "" })}
                              className="w-full"
                            >
                              Cancel
                            </Button>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                              Update
                            </Button>
                          </div>
                        </form>
                      </div>
                    </DrawerContent>
                  </Drawer>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(gym.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GymsPage;