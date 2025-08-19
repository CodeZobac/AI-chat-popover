"use client";

import { useState } from "react";
import { InterviewSchedulingForm } from "./interview-scheduling-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import type { InterviewSchedulingFormData } from "@/types/validation";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    referenceNumber: string;
    schedulingRequest: {
      id: number;
      type: string;
      status: string;
      preferredDate: string;
      timePreference: string;
      format: string;
      programInterest: string;
    };
  };
  error?: string;
  details?: unknown[];
}

interface InterviewSchedulingFormWithApiProps {
  onSuccess?: (referenceNumber: string) => void;
  onCancel?: () => void;
  initialData?: Partial<InterviewSchedulingFormData>;
}

export function InterviewSchedulingFormWithApi({
  onSuccess,
  onCancel,
  initialData,
}: InterviewSchedulingFormWithApiProps) {
  const [submissionState, setSubmissionState] = useState<{
    status: "idle" | "submitting" | "success" | "error";
    message?: string;
    referenceNumber?: string;
    error?: string;
  }>({ status: "idle" });

  const handleSubmit = async (data: InterviewSchedulingFormData) => {
    setSubmissionState({ status: "submitting" });

    try {
      const response = await fetch("/api/scheduling/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setSubmissionState({
          status: "success",
          message: result.message,
          referenceNumber: result.data.referenceNumber,
        });

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess(result.data.referenceNumber);
        }
      } else {
        setSubmissionState({
          status: "error",
          error: result.error || "Failed to schedule interview",
        });
      }
    } catch (error) {
      console.error("Error submitting interview scheduling form:", error);
      setSubmissionState({
        status: "error",
        error: "Network error. Please check your connection and try again.",
      });
    }
  };

  const handleReset = () => {
    setSubmissionState({ status: "idle" });
  };

  // Success state
  if (submissionState.status === "success") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-600">
              Interview Scheduled Successfully!
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200 mb-2">
              {submissionState.message}
            </p>
            {submissionState.referenceNumber && (
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Reference Number:{" "}
                <span className="font-mono">
                  {submissionState.referenceNumber}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>What happens next:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You&apos;ll receive a confirmation email within 5 minutes</li>
              <li>
                Our admissions team will contact you within 24 hours to confirm
                your interview time
              </li>
              <li>
                You&apos;ll receive calendar invitation and meeting details
              </li>
              <li>
                If you have any questions, please contact us with your reference
                number
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Schedule Another Interview
            </Button>
            {onCancel && (
              <Button onClick={onCancel} className="flex-1">
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (submissionState.status === "error") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircleIcon className="h-6 w-6 text-red-600" />
            <CardTitle className="text-red-600">Scheduling Failed</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              {submissionState.error}
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleReset} className="flex-1">
              Try Again
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Form state (idle or submitting)
  return (
    <InterviewSchedulingForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={submissionState.status === "submitting"}
      initialData={initialData}
    />
  );
}
