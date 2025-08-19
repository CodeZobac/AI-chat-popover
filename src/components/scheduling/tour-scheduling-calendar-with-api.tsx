"use client";

import { useState } from "react";
import { TourSchedulingCalendar } from "./tour-scheduling-calendar";
import { type TourSchedulingFormData } from "@/types/validation";

interface TourSchedulingCalendarWithApiProps {
  onSuccess?: (data: TourSchedulingFormData & { referenceNumber: string }) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  initialData?: Partial<TourSchedulingFormData>;
}

export function TourSchedulingCalendarWithApi({
  onSuccess,
  onError,
  onCancel,
  initialData,
}: TourSchedulingCalendarWithApiProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TourSchedulingFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/scheduling/tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to schedule tour");
      }

      const result = await response.json();
      
      if (onSuccess) {
        onSuccess({
          ...data,
          referenceNumber: result.referenceNumber,
        });
      }
    } catch (error) {
      console.error("Error scheduling tour:", error);
      if (onError) {
        onError(error instanceof Error ? error : new Error("Unknown error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TourSchedulingCalendar
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      initialData={initialData}
    />
  );
}