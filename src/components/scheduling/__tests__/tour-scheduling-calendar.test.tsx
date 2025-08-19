import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TourSchedulingCalendar } from "../tour-scheduling-calendar";
import { type TourSchedulingFormData } from "@/types/validation";

// Mock the API call
global.fetch = jest.fn();

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe("TourSchedulingCalendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        bookedSlots: [],
        totalBookings: 0,
      }),
    });
  });

  it("renders the tour scheduling form", () => {
    render(
      <TourSchedulingCalendar
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Schedule Campus Tour")).toBeInTheDocument();
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
    expect(screen.getByText("Tour Details")).toBeInTheDocument();
    expect(screen.getByText("Select Date & Time")).toBeInTheDocument();
  });

  it("shows required field validation", async () => {
    render(
      <TourSchedulingCalendar
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole("button", { name: /book campus tour/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
      expect(screen.getByText("Please select a preferred date")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const mockSubmitData: TourSchedulingFormData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+351123456789",
      preferredDate: new Date("2024-12-25"),
      timePreference: "morning",
      groupSize: 2,
      specialRequirements: "Wheelchair accessible",
      notes: "Looking forward to the tour",
    };

    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <TourSchedulingCalendar
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={mockSubmitData}
      />
    );

    const submitButton = screen.getByRole("button", { name: /book campus tour/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        phone: "+351123456789",
        timePreference: "morning",
        groupSize: 2,
        specialRequirements: "Wheelchair accessible",
        notes: "Looking forward to the tour",
      }));
    });
  });

  it("shows time slots when specific time is selected", async () => {
    render(
      <TourSchedulingCalendar
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Select a date first
    const dateButton = screen.getByRole("button", { name: /pick a date/i });
    fireEvent.click(dateButton);

    // Select specific time preference
    const specificTimeRadio = screen.getByLabelText("Specific Time Slot");
    fireEvent.click(specificTimeRadio);

    await waitFor(() => {
      expect(screen.getByText("Available Time Slots *")).toBeInTheDocument();
      expect(screen.getByText("9:00 AM")).toBeInTheDocument();
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <TourSchedulingCalendar
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});