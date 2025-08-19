import { InterviewSchedulingFormWithApi } from "@/components/scheduling";

export default function TestInterviewFormPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Interview Scheduling Form Test</h1>
          <p className="text-muted-foreground">
            This is a test page for the interview scheduling form component.
          </p>
        </div>
        
        <InterviewSchedulingFormWithApi
          onSuccess={(referenceNumber) => {
            console.log("Interview scheduled with reference:", referenceNumber);
          }}
        />
      </div>
    </div>
  );
}