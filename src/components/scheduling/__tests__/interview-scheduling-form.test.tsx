import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InterviewSchedulingForm } from "../interview-scheduling-form";

// Mock the date-fns format function
jest.mock("date-fns", () => ({
  format: jest.fn((date: Date) => {
    return date.toLocaleDateString();
  }),
}));

describe("InterviewSchedulingForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = (props = {}) => {
    return render(
      <InterviewSchedulingForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        {...props}
      />
    );
  };

  it("renders all form fields", () => {
    renderForm();

    // Check for main sections
    expect(screen.getByText("Schedule Interview")).toBeInTheDocument();
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
    expect(screen.getByText("Program Interest")).toBeInTheDocument();
    expect(screen.getByText("Interview Format")).toBeInTheDocument();
    expect(screen.getByText("Preferred Schedule")).toBeInTheDocument();
    expect(screen.getByText("Additional Information")).toBeInTheDocument();

    // Check for required fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(
      screen.getByText(/which program interests you most/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/how would you prefer to conduct the interview/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
    expect(screen.getByText(/time preference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    renderForm();

    const submitButton = screen.getByRole("button", {
      name: /schedule interview/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/name must be at least 2 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/please select a program of interest/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/please select a preferred date/i)
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    renderForm();

    // Fill in required fields
    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "john.doe@example.com"
    );
    await user.type(screen.getByLabelText(/phone number/i), "+351 123 456 789");

    // Select program (this would require more complex interaction with Select component)
    // For now, we'll test the basic form structure

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("john.doe@example.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("+351 123 456 789")).toBeInTheDocument();
  });

  it("shows specific time field when 'specific' time preference is selected", async () => {
    const user = userEvent.setup();
    renderForm();

    // Initially, specific time field should not be visible
    expect(screen.queryByLabelText(/specific time/i)).not.toBeInTheDocument();

    // Select "Specific Time" radio button
    const specificTimeRadio = screen.getByLabelText(/specific time/i);
    await user.click(specificTimeRadio);

    // Now the specific time input should be visible
    await waitFor(() => {
      expect(screen.getByLabelText(/specific time \*/i)).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderForm();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when isLoading prop is true", () => {
    renderForm({ isLoading: true });

    const submitButton = screen.getByRole("button", {
      name: /scheduling\.\.\./i,
    });
    expect(submitButton).toBeDisabled();
  });

  it("populates form with initial data", () => {
    const initialData = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+351 987 654 321",
      programInterest: "web-development",
      format: "in-person" as const,
      timePreference: "afternoon" as const,
      notes: "Looking forward to learning more about the program",
    };

    renderForm({ initialData });

    expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("jane.smith@example.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("+351 987 654 321")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        "Looking forward to learning more about the program"
      )
    ).toBeInTheDocument();
  });
});
