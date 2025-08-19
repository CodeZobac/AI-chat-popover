"use client";

import { useState } from "react";
import { TourSchedulingCalendar } from "./tour-scheduling-calendar";
import { type TourSchedulingFormData } from "@/types/validation";

export function TourSchedulingDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    referenceNumber?: string;
  } | null>(null);

  const handleSubmit = async (data: TourSchedulingFormData) => {
    setIsLoading(true);
    setSubmissionResult(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful submission
      const referenceNumber = `TOUR-${Date.now().toString().slice(-6)}`;
      
      console.log("Tour scheduling data:", data);
      
      setSubmissionResult({
        success: true,
        message: "Your campus tour has been successfully scheduled!",
        referenceNumber,
      });
    } catch (error) {
      console.error("Error scheduling tour:", error);
      setSubmissionResult({
        success: false,
        message: "There was an error scheduling your tour. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Tour scheduling cancelled");
    setSubmissionResult(null);
  };

  if (submissionResult) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className={`p-6 rounded-lg border ${
          submissionResult.success 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              {submissionResult.success ? "Tour Scheduled!" : "Scheduling Failed"}
            </h3>
            <p>{submissionResult.message}</p>
            {submissionResult.referenceNumber && (
              <p className="text-sm">
                <strong>Reference Number:</strong> {submissionResult.referenceNumber}
              </p>
            )}
            <div className="pt-3">
              <button
                onClick={() => setSubmissionResult(null)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Schedule Another Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TourSchedulingCalendar
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}