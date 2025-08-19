"use client";

import { useState } from "react";
import { CallSchedulingForm } from "./call-scheduling-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, PhoneIcon } from "lucide-react";
import type { CallSchedulingFormData } from "@/types/validation";

interface CallSchedulingFormWithApiProps {
  onSuccess?: (data: CallSchedulingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<CallSchedulingFormData>;
}

interface SubmissionResult {
  success: boolean;
  message: string;
  referenceNumber?: string;
  scheduledDate?: Date;
  scheduledTime?: string;
  timezone?: string;
  callPurpose?: string;
}

export function CallSchedulingFormWithApi({
  onSuccess,
  onCancel,
  initialData,
}: CallSchedulingFormWithApiProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CallSchedulingFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/scheduling/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to schedule call");
      }

      setSubmissionResult(result);
      onSuccess?.(data);
    } catch (err) {
      console.error("Error submitting call scheduling form:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSubmissionResult(null);
    setError(null);
    onCancel?.();
  };

  const resetForm = () => {
    setSubmissionResult(null);
    setError(null);
  };

  // Helper function to get call purpose label
  const getCallPurposeLabel = (value: string) => {
    const purposes = {
      "program-inquiry": "Program Information & Requirements",
      "admission-process": "Admission Process & Application",
      "career-guidance": "Career Guidance & Opportunities",
      "financial-aid": "Financial Aid & Scholarships",
      "international-student": "International Student Support",
      "technical-questions": "Technical Questions & Prerequisites",
      "general-consultation": "General Consultation",
      "other": "Other",
    };
    return purposes[value as keyof typeof purposes] || value;
  };

  // Helper function to get timezone label
  const getTimezoneLabel = (value: string) => {
    const timezones = {
      "Europe/Lisbon": "Portugal (WET/WEST)",
      "Europe/London": "United Kingdom (GMT/BST)",
      "Europe/Paris": "Central Europe (CET/CEST)",
      "Europe/Madrid": "Spain (CET/CEST)",
      "Europe/Rome": "Italy (CET/CEST)",
      "Europe/Berlin": "Germany (CET/CEST)",
      "America/New_York": "Eastern Time (EST/EDT)",
      "America/Chicago": "Central Time (CST/CDT)",
      "America/Denver": "Mountain Time (MST/MDT)",
      "America/Los_Angeles": "Pacific Time (PST/PDT)",
      "America/Sao_Paulo": "Brazil (BRT/BRST)",
      "Asia/Tokyo": "Japan (JST)",
      "Asia/Shanghai": "China (CST)",
      "Asia/Kolkata": "India (IST)",
      "Australia/Sydney": "Australia Eastern (AEST/AEDT)",
    };
    return timezones[value as keyof typeof timezones] || value;
  };

  // Show success message
  if (submissionResult?.success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-600">Call Scheduled Successfully!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Call Details:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Reference Number:</strong> {submissionResult.referenceNumber}</p>
              <p><strong>Date:</strong> {submissionResult.scheduledDate?.toDateString()}</p>
              <p><strong>Time:</strong> {submissionResult.scheduledTime}</p>
              <p><strong>Timezone:</strong> {getTimezoneLabel(submissionResult.timezone || "Europe/Lisbon")}</p>
              <p><strong>Purpose:</strong> {getCallPurposeLabel(submissionResult.callPurpose || "")}</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" />
              What happens next?
            </h4>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>You'll receive a confirmation email within 24 hours with all the details</li>
              <li>Our admissions team will call you at the scheduled time</li>
              <li>The call typically lasts 20-30 minutes</li>
              <li>Please ensure your phone is available at the scheduled time</li>
              <li>You can reschedule if needed by replying to the confirmation email</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Important Notes:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Please save the reference number for your records</li>
              <li>If you need to cancel, please give us at least 24 hours notice</li>
              <li>International calls are made at no cost to you</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={resetForm} className="flex-1">
              Schedule Another Call
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error message
  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-destructive">Scheduling Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={resetForm} className="flex-1">
              Try Again
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show the form
  return (
    <CallSchedulingForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      initialData={initialData}
    />
  );
}