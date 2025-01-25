"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  joiningDate: z.date({
    required_error: "Joining date is required",
  }),
});

export function AddMemberDrawer({ onAddMember }) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobile: "",
      joiningDate: new Date(),
    },
  });

  function onSubmit(values) {
    onAddMember({
      ...values,
      membershipStart: format(values.joiningDate, "yyyy-MM-dd"),
    });
    form.reset();
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* Floating Action Button */}
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-20 right-6 rounded-full w-14 h-14 shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DrawerTrigger>

      {/* Drawer Content */}
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-sm p-4">
          <DrawerHeader>
            <DrawerTitle>Add New Member</DrawerTitle>
          </DrawerHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joiningDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Joining Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="pl-3 text-left font-normal">
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Add Member
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}