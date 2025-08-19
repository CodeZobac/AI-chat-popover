"use client";

import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ClockIcon, PhoneIcon, GlobeIcon } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  callSchedulingSchema,
  type CallSchedulingFormData,
} from "@/types/validation";

// Available time slots for calls
const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM", available: true },
  { value: "10:00", label: "10:00 AM", available: true },
  { value: "11:00", label: "11:00 AM", available: true },
  { value: "14:00", label: "2:00 PM", available: true },
  { value: "15:00", label: "3:00 PM", available: true },
  { value: "16:00", label: "4:00 PM", available: true },
  { value: "17:00", label: "5:00 PM", available: true },
];

// Call purpose options
const CALL_PURPOSE_OPTIONS = [
  { value: "program-inquiry", label: "Program Information & Requirements" },
  { value: "admission-process", label: "Admission Process & Application" },
  { value: "career-guidance", label: "Career Guidance & Opportunities" },
  { value: "financial-aid", label: "Financial Aid & Scholarships" },
  { value: "international-student", label: "International Student Support" },
  {
    value: "technical-questions",
    label: "Technical Questions & Prerequisites",
  },
  { value: "general-consultation", label: "General Consultation" },
  { value: "other", label: "Other (please specify in notes)" },
];

// Common timezones for international students
const TIMEZONE_OPTIONS = [
  { value: "Europe/Lisbon", label: "Portugal (WET/WEST)" },
  { value: "Europe/London", label: "United Kingdom (GMT/BST)" },
  { value: "Europe/Paris", label: "Central Europe (CET/CEST)" },
  { value: "Europe/Madrid", label: "Spain (CET/CEST)" },
  { value: "Europe/Rome", label: "Italy (CET/CEST)" },
  { value: "Europe/Berlin", label: "Germany (CET/CEST)" },
  { value: "America/New_York", label: "Eastern Time (EST/EDT)" },
  { value: "America/Chicago", label: "Central Time (CST/CDT)" },
  { value: "America/Denver", label: "Mountain Time (MST/MDT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PST/PDT)" },
  { value: "America/Sao_Paulo", label: "Brazil (BRT/BRST)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Australia Eastern (AEST/AEDT)" },
];

interface CallSchedulingFormProps {
  onSubmit: (data: CallSchedulingFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<CallSchedulingFormData>;
}

export function CallSchedulingForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: CallSchedulingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // Detect user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const defaultTimezone =
    TIMEZONE_OPTIONS.find((tz) => tz.value === userTimezone)?.value ||
    "Europe/Lisbon";

  const form = useForm<CallSchedulingFormData>({
    resolver: zodResolver(callSchedulingSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      preferredDate: initialData?.preferredDate || undefined,
      timePreference: initialData?.timePreference || "morning",
      specificTime: initialData?.specificTime || "",
      callPurpose: initialData?.callPurpose || "",
      timezone: initialData?.timezone || defaultTimezone,
      notes: initialData?.notes || "",
    },
  });

  const handleSubmit = async (data: CallSchedulingFormData) => {
    try {
      setIsSubmitting(true);
      // If a specific time slot was selected, use that
      if (selectedTimeSlot && data.timePreference === "specific") {
        data.specificTime = selectedTimeSlot;
      }
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting call scheduling form:", error);
      // Form errors will be handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchTimePreference = form.watch("timePreference");
  const watchSelectedDate = form.watch("preferredDate");
  const watchTimezone = form.watch("timezone");

  // Check if a date is available for calls (weekdays only, not too far in advance)
  const isDateAvailable = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 90); // 3 months in advance

    return (
      !isBefore(date, today) && !isBefore(maxDate, date) && !isWeekend(date)
    );
  };

  // State for availability data
  const [availabilityData, setAvailabilityData] = useState<{
    availableSlots: string[];
    bookedSlots: string[];
    isLoading: boolean;
  }>({
    availableSlots: TIME_SLOTS.map((slot) => slot.value),
    bookedSlots: [],
    isLoading: false,
  });

  // Fetch availability when date or timezone changes
  const fetchAvailability = async (date: Date, timezone: string) => {
    setAvailabilityData((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(
        `/api/scheduling/call?date=${date.toISOString()}&timezone=${timezone}`
      );
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
          availableSlots: TIME_SLOTS.map((slot) => slot.value),
          bookedSlots: [],
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      // Fallback to default availability
      setAvailabilityData({
        availableSlots: TIME_SLOTS.map((slot) => slot.value),
        bookedSlots: [],
        isLoading: false,
      });
    }
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return TIME_SLOTS;

    return TIME_SLOTS.map((slot) => ({
      ...slot,
      available:
        availabilityData.availableSlots.includes(slot.value) &&
        !availabilityData.isLoading,
    }));
  };

  const availableTimeSlots = getAvailableTimeSlots(watchSelectedDate);

  // Fetch availability when date or timezone changes
  React.useEffect(() => {
    if (watchSelectedDate && watchTimezone) {
      fetchAvailability(watchSelectedDate, watchTimezone);
    }
  }, [watchSelectedDate, watchTimezone]);

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Schedule Phone Call</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Book a personalized phone consultation with our admissions team to
            discuss your educational goals and learn more about ETIC Algarve
            programs.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+351 123 456 789"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include country code for international numbers. This is
                      where we&apos;ll call you.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Call Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Call Details</h3>

              <FormField
                control={form.control}
                name="callPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Call *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the main topic for discussion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CALL_PURPOSE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us prepare for your call and connect you with
                      the right specialist
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Timezone *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIMEZONE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <GlobeIcon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      We&apos;ll schedule the call according to your local time
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date & Time Selection Section */}
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
                      Calls are available Monday through Friday, up to 3 months
                      in advance
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
                          <RadioGroupItem value="morning" id="call-morning" />
                          <label
                            htmlFor="call-morning"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Morning (9:00 AM - 12:00 PM)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="afternoon"
                            id="call-afternoon"
                          />
                          <label
                            htmlFor="call-afternoon"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Afternoon (2:00 PM - 6:00 PM)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="specific" id="call-specific" />
                          <label
                            htmlFor="call-specific"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Specific Time Slot
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      All times shown in your selected timezone (
                      {watchTimezone?.split("/")[1]?.replace("_", " ")})
                    </FormDescription>
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
                        variant={
                          selectedTimeSlot === slot.value
                            ? "default"
                            : "outline"
                        }
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
                          <span className="text-xs text-muted-foreground">
                            Unavailable
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                  {watchSelectedDate && (
                    <FormDescription>
                      Available time slots for{" "}
                      {format(watchSelectedDate, "EEEE, MMMM d")} in your
                      timezone
                    </FormDescription>
                  )}
                  {watchTimePreference === "specific" && !selectedTimeSlot && (
                    <p className="text-sm text-destructive">
                      Please select a time slot
                    </p>
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
                        placeholder="Any specific questions, topics you'd like to discuss, or additional information that would help us prepare for your call..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share any specific questions or topics you&apos;d like to
                      discuss (max 500 characters)
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
                disabled={
                  isSubmitting ||
                  isLoading ||
                  (watchTimePreference === "specific" && !selectedTimeSlot)
                }
                className="flex-1"
              >
                {isSubmitting || isLoading
                  ? "Scheduling Call..."
                  : "Schedule Phone Call"}
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
