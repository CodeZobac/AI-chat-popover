"use client";

import { useState } from "react";
import { CallSchedulingForm } from "./call-scheduling-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CallSchedulingFormData } from "@/types/validation";

export function CallSchedulingDemo() {
  const [showForm, setShowForm] = useState(false);
  const [submittedData, setSubmittedData] =
    useState<CallSchedulingFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CallSchedulingFormData) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Call scheduling data:", data);
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
      other: "Other",
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

  if (submittedData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">
            Call Scheduled Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Call Details:</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {submittedData.name}
              </p>
              <p>
                <strong>Email:</strong> {submittedData.email}
              </p>
              {submittedData.phone && (
                <p>
                  <strong>Phone:</strong> {submittedData.phone}
                </p>
              )}
              <p>
                <strong>Purpose:</strong>{" "}
                {getCallPurposeLabel(submittedData.callPurpose)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {submittedData.preferredDate.toDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {submittedData.timePreference === "specific"
                  ? submittedData.specificTime
                  : submittedData.timePreference}
              </p>
              <p>
                <strong>Timezone:</strong>{" "}
                {getTimezoneLabel(submittedData.timezone || "Europe/Lisbon")}
              </p>
              {submittedData.notes && (
                <p>
                  <strong>Notes:</strong> {submittedData.notes}
                </p>
              )}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>You&apos;ll receive a confirmation email within 24 hours</li>
              <li>Our admissions team will call you at the scheduled time</li>
              <li>The call typically lasts 20-30 minutes</li>
              <li>
                You can reschedule if needed by replying to the confirmation
                email
              </li>
            </ul>
          </div>
          <Button onClick={resetDemo} className="w-full">
            Schedule Another Call
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showForm) {
    return (
      <CallSchedulingForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Call Scheduling Form Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          This is a demo of the call scheduling form component. Click the button
          below to test the form.
        </p>
        <Button onClick={() => setShowForm(true)} className="w-full">
          Open Call Scheduling Form
        </Button>
      </CardContent>
    </Card>
  );
}
