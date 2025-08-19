"use client";

import { useState } from "react";
import { Calendar, Phone, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InterviewSchedulingFormWithApi,
  TourSchedulingCalendarWithApi,
  CallSchedulingFormWithApi,
} from "@/components/scheduling";

interface ChatActionButtonsProps {
  messageId: string;
  className?: string;
  isLastMessage?: boolean;
}

export function ChatActionButtons({
  messageId,
  className,
  isLastMessage = true,
}: ChatActionButtonsProps) {
  const [activeDialog, setActiveDialog] = useState<
    "interview" | "tour" | "call" | null
  >(null);

  // Only show action buttons for the last assistant message to avoid clutter
  if (!isLastMessage) {
    return null;
  }

  const handleScheduleInterview = () => {
    setActiveDialog("interview");
  };

  const handleScheduleTour = () => {
    setActiveDialog("tour");
  };

  const handleScheduleCall = () => {
    setActiveDialog("call");
  };

  const closeDialog = () => {
    setActiveDialog(null);
  };

  return (
    <>
      <div className={`flex gap-2 mt-3 ${className || ""}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleScheduleInterview}
          className="flex items-center gap-2 text-xs"
        >
          <UserCheck className="h-3 w-3" />
          Schedule Interview
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleScheduleTour}
          className="flex items-center gap-2 text-xs"
        >
          <Calendar className="h-3 w-3" />
          Schedule Tour
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleScheduleCall}
          className="flex items-center gap-2 text-xs"
        >
          <Phone className="h-3 w-3" />
          Schedule Call
        </Button>
      </div>

      {/* Interview Scheduling Dialog */}
      <Dialog open={activeDialog === "interview"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule an Interview</DialogTitle>
          </DialogHeader>
          <InterviewSchedulingFormWithApi onSuccess={closeDialog} />
        </DialogContent>
      </Dialog>

      {/* Tour Scheduling Dialog */}
      <Dialog open={activeDialog === "tour"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule a Campus Tour</DialogTitle>
          </DialogHeader>
          <TourSchedulingCalendarWithApi onSuccess={closeDialog} />
        </DialogContent>
      </Dialog>

      {/* Call Scheduling Dialog */}
      <Dialog open={activeDialog === "call"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule a Call</DialogTitle>
          </DialogHeader>
          <CallSchedulingFormWithApi onSuccess={closeDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}
