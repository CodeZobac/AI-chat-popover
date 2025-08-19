"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";

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
  interviewSchedulingSchema,
  type InterviewSchedulingFormData,
} from "@/types/validation";

// ETIC Algarve programs based on the system prompt
const ETIC_PROGRAMS = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-app-development", label: "Mobile App Development" },
  { value: "software-engineering", label: "Software Engineering" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "motion-graphics", label: "Motion Graphics" },
  { value: "digital-illustration", label: "Digital Illustration" },
  { value: "video-production", label: "Video Production" },
  { value: "audio-engineering", label: "Audio Engineering" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "social-media-management", label: "Social Media Management" },
  { value: "game-development", label: "Game Development" },
  { value: "game-design", label: "Game Design" },
  { value: "3d-modeling-animation", label: "3D Modeling and Animation" },
  { value: "digital-entrepreneurship", label: "Digital Entrepreneurship" },
  { value: "e-commerce", label: "E-commerce" },
  { value: "project-management", label: "Project Management" },
  { value: "other", label: "Other / Not Sure" },
];

interface InterviewSchedulingFormProps {
  onSubmit: (data: InterviewSchedulingFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<InterviewSchedulingFormData>;
}

export function InterviewSchedulingForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: InterviewSchedulingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InterviewSchedulingFormData>({
    resolver: zodResolver(interviewSchedulingSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      programInterest: initialData?.programInterest || "",
      format: initialData?.format || "video",
      preferredDate: initialData?.preferredDate || undefined,
      timePreference: initialData?.timePreference || "morning",
      specificTime: initialData?.specificTime || "",
      notes: initialData?.notes || "",
    },
  });

  const handleSubmit = async (data: InterviewSchedulingFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting interview scheduling form:", error);
      // Form errors will be handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchTimePreference = form.watch("timePreference");

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Schedule Interview</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Book a one-on-one interview with our admissions team to discuss your
            educational goals and learn more about ETIC Algarve programs.
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

            {/* Program Interest Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Program Interest</h3>

              <FormField
                control={form.control}
                name="programInterest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Which program interests you most? *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ETIC_PROGRAMS.map((program) => (
                          <SelectItem key={program.value} value={program.value}>
                            {program.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Interview Format Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Interview Format</h3>

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      How would you prefer to conduct the interview? *
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="video" id="video" />
                          <label
                            htmlFor="video"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Video Call (Recommended)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="in-person" id="in-person" />
                          <label
                            htmlFor="in-person"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            In-Person at Campus
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="phone" />
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Phone Call
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Scheduling Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preferred Schedule</h3>

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
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select your preferred interview date
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="morning" id="morning" />
                          <label
                            htmlFor="morning"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Morning (9:00 AM - 12:00 PM)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="afternoon" id="afternoon" />
                          <label
                            htmlFor="afternoon"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Afternoon (1:00 PM - 5:00 PM)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="specific" id="specific" />
                          <label
                            htmlFor="specific"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Specific Time
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchTimePreference === "specific" && (
                <FormField
                  control={form.control}
                  name="specificTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Time *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="e.g., 2:30 PM or 14:30"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Please specify your preferred time
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        placeholder="Any specific questions or topics you'd like to discuss during the interview..."
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
                disabled={isSubmitting || isLoading}
                className="flex-1"
              >
                {isSubmitting || isLoading
                  ? "Scheduling..."
                  : "Schedule Interview"}
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
