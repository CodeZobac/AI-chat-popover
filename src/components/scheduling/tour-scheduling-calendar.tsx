"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon } from "lucide-react";
import { format, addDays, isWeekend, isBefore, startOfDay } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  tourSchedulingSchema,
  type TourSchedulingFormData,
} from "@/types/validation";

// Available time slots for tours
const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM", available: true },
  { value: "10:00", label: "10:00 AM", available: true },
  { value: "11:00", label: "11:00 AM", available: true },
  { value: "14:00", label: "2:00 PM", available: true },
  { value: "15:00", label: "3:00 PM", available: true },
  { value: "16:00", label: "4:00 PM", available: true },
];

// Group size options
const GROUP_SIZE_OPTIONS = [
  { value: 1, label: "Just me" },
  { value: 2, label: "2 people" },
  { value: 3, label: "3 people" },
  { value: 4, label: "4 people" },
  { value: 5, label: "5 people" },
  { value: 6, label: "6-10 people" },
  { value: 11, label: "11-15 people" },
  { value: 16, label: "16-20 people" },
];

interface TourSchedulingCalendarProps {
  onSubmit: (data: TourSchedulingFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<TourSchedulingFormData>;
}

export function TourSchedulingCalendar({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: TourSchedulingCalendarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const form = useForm<TourSchedulingFormData>({
    resolver: zodResolver(tourSchedulingSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      preferredDate: initialData?.preferredDate || undefined,
      timePreference: initialData?.timePreference || "morning",
      specificTime: initialData?.specificTime || "",
      groupSize: initialData?.groupSize || 1,
      specialRequirements: initialData?.specialRequirements || "",
      notes: initialData?.notes || "",
    },
  });

  const handleSubmit = async (data: TourSchedulingFormData) => {
    try {
      setIsSubmitting(true);
      // If a specific time slot was selected, use that
      if (selectedTimeSlot && data.timePreference === "specific") {
        data.specificTime = selectedTimeSlot;
      }
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting tour scheduling form:", error);
      // Form errors will be handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchTimePreference = form.watch("timePreference");
  const watchSelectedDate = form.watch("preferredDate");

  // Check if a date is available for tours (weekdays only, not too far in advance)
  const isDateAvailable = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 60); // 2 months in advance
    
    return (
      !isBefore(date, today) &&
      !isBefore(maxDate, date) &&
      !isWeekend(date)
    );
  };

  // State for availability data
  const [availabilityData, setAvailabilityData] = useState<{
    availableSlots: string[];
    bookedSlots: string[];
    isLoading: boolean;
  }>({
    availableSlots: TIME_SLOTS.map(slot => slot.value),
    bookedSlots: [],
    isLoading: false,
  });

  // Fetch availability when date changes
  const fetchAvailability = async (date: Date) => {
    setAvailabilityData(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetch(`/api/scheduling/tour?date=${date.toISOString()}`);
      if (response.ok) {
        const data = await response.json();
        setAvailabilityData({
          availableSlots: data.availableSlots,
          bookedSlots: data.bookedSlots,
          isLoading: false,
        });
      } else {
        // Fallback to default availability
        setAvailabilityData({
          availableSlots: TIME_SLOTS.map(slot => slot.value),
          bookedSlots: [],
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      // Fallback to default availability
      setAvailabilityData({
        availableSlots: TIME_SLOTS.map(slot => slot.value),
        bookedSlots: [],
        isLoading: false,
      });
    }
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return TIME_SLOTS;
    
    return TIME_SLOTS.map(slot => ({
      ...slot,
      available: availabilityData.availableSlots.includes(slot.value) && !availabilityData.isLoading
    }));
  };

  const availableTimeSlots = getAvailableTimeSlots(watchSelectedDate);

  // Fetch availability when date changes
  React.useEffect(() => {
    if (watchSelectedDate) {
      fetchAvailability(watchSelectedDate);
    }
  }, [watchSelectedDate]);

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Schedule Campus Tour</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Book a guided tour of our ETIC Algarve campus to explore our facilities,
            labs, and learning spaces. Tours are available Monday through Friday.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+351 123 456 789"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include country code for international numbers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tour Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tour Details</h3>
              
              <FormField
                control={form.control}
                name="groupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Size *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select group size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GROUP_SIZE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            <div className="flex items-center gap-2">
                              <UsersIcon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Large groups may require special arrangements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requirements (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Accessibility needs, specific areas of interest, language preferences..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Let us know about any accessibility needs or specific interests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Selection Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Date & Time</h3>
              
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
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
                          disabled={(date) => !isDateAvailable(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Tours are available Monday through Friday, up to 2 months in advance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timePreference"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Time Preference *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== "specific") {
                            setSelectedTimeSlot("");
                          }
                        }}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="morning" id="tour-morning" />
                          <label htmlFor="tour-morning" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Morning (9:00 AM - 12:00 PM)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="afternoon" id="tour-afternoon" />
                          <label htmlFor="tour-afternoon" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Afternoon (2:00 PM - 5:00 PM)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="specific" id="tour-specific" />
                          <label htmlFor="tour-specific" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Specific Time Slot
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchTimePreference === "specific" && (
                <div className="space-y-3">
                  <FormLabel>Available Time Slots *</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <Button
                        key={slot.value}
                        type="button"
                        variant={selectedTimeSlot === slot.value ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => {
                          setSelectedTimeSlot(slot.value);
                          form.setValue("specificTime", slot.value);
                        }}
                        className="h-auto py-3 px-4 flex flex-col items-center gap-1"
                      >
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-sm">{slot.label}</span>
                        {!slot.available && (
                          <span className="text-xs text-muted-foreground">Unavailable</span>
                        )}
                      </Button>
                    ))}
                  </div>
                  {watchSelectedDate && (
                    <FormDescription>
                      Available time slots for {format(watchSelectedDate, "EEEE, MMMM d")}
                    </FormDescription>
                  )}
                  {watchTimePreference === "specific" && !selectedTimeSlot && (
                    <p className="text-sm text-destructive">Please select a time slot</p>
                  )}
                </div>
              )}
            </div>

            {/* Additional Notes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific questions about programs, facilities, or other topics you'd like to discuss during the tour..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share any specific interests or questions (max 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || (watchTimePreference === "specific" && !selectedTimeSlot)}
                className="flex-1"
              >
                {isSubmitting || isLoading ? "Booking Tour..." : "Book Campus Tour"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting || isLoading}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}