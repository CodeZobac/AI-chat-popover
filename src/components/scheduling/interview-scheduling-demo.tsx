"use client";

import { useState } from "react";
import { InterviewSchedulingForm } from "./interview-scheduling-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InterviewSchedulingFormData } from "@/types/validation";

export function InterviewSchedulingDemo() {
  const [showForm, setShowForm] = useState(false);
  const [submittedData, setSubmittedData] = useState<InterviewSchedulingFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: InterviewSchedulingFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Interview scheduling data:", data);
    setSubmittedData(data);
    setShowForm(false);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const resetDemo = () => {
    setSubmittedData(null);
    setShowForm(false);
  };

  if (submittedData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">Interview Scheduled Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Submission Details:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {submittedData.name}</p>
              <p><strong>Email:</strong> {submittedData.email}</p>
              {submittedData.phone && <p><strong>Phone:</strong> {submittedData.phone}</p>}
              <p><strong>Program:</strong> {submittedData.programInterest}</p>
              <p><strong>Format:</strong> {submittedData.format}</p>
              <p><strong>Date:</strong> {submittedData.preferredDate.toDateString()}</p>
              <p><strong>Time:</strong> {submittedData.timePreference === "specific" ? submittedData.specificTime : submittedData.timePreference}</p>
              {submittedData.notes && <p><strong>Notes:</strong> {submittedData.notes}</p>}
            </div>
          </div>
          <Button onClick={resetDemo} className="w-full">
            Schedule Another Interview
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showForm) {
    return (
      <InterviewSchedulingForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Interview Scheduling Form Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          This is a demo of the interview scheduling form component. Click the button below to test the form.
        </p>
        <Button onClick={() => setShowForm(true)} className="w-full">
          Open Interview Scheduling Form
        </Button>
      </CardContent>
    </Card>
  );
}