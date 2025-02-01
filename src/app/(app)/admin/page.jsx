"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { z } from 'zod';
import Link from 'next/link';

// Zod validation schema
const gymSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters")
});

export default function Home() {
  const [gyms, setGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isAddingGym, setIsAddingGym] = useState(false);

  // Fetch gyms from API
  const fetchGyms = async () => {
    try {
      const response = await axios.get('/api/gyms/list');
      setGyms(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load gyms. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, []);

  // Handle form submission
  const handleAddGym = async (e) => {
    e.preventDefault();
    setIsAddingGym(true);
    setFormErrors({});

    try {
      // Validate with Zod
      const validatedData = gymSchema.parse(formData);
      
      const response = await axios.post('/api/gyms', validatedData);

      setGyms(prev => [...prev, {
        id: response.data.id,
        ...validatedData,
        verified: false,
        createdAt: new Date().toISOString()
      }]);

      setFormData({ name: '', address: '' });
      setIsDrawerOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors = error.flatten().fieldErrors;
        setFormErrors(errors);
      } else if (error.response) {
        // Handle API errors
        setError(error.response.data.error || 'Failed to add gym');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsAddingGym(false);
    }
  };

  // Handle gym deletion
  const handleDeleteGym = async (gymId) => {
    try {
      await axios.delete(`/api/gyms/${gymId}`);
      setGyms(prev => prev.filter(gym => gym.id !== gymId));
    } catch (error) {
      setError('Failed to delete gym. Please try again.');
    }
  };

  // Skeleton Loading Component
  const SkeletonLoading = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Loading and Error States */}
      {isLoading && <SkeletonLoading />}

      {error && (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Gym List */}
      {!isLoading && !error && (
        <div className="space-y-3">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    <Link href={`/members?gymId=${gym.id}`}>
                      {gym.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{gym.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {gym.verified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className={`text-sm ${gym.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {gym.verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => handleDeleteGym(gym.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Gym Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-20 right-4 rounded-full h-12 w-12 shadow-xl bg-blue-600 hover:bg-blue-700 text-white"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="text-lg">Add New Gym</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleAddGym} className="p-4 space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Gym Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm">{formErrors.address[0]}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isAddingGym}
            >
              {isAddingGym ? 'Adding Gym...' : 'Add Gym'}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}