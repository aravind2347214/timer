import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TimerModal } from "./TimerModal";
import { useTimerStore } from "../../store/useTimerStore";
import { Timer } from "../../types/timer";

// Mock the store
vi.mock("../../store/useTimerStore", () => ({
  useTimerStore: vi.fn(),
}));

const timer :Timer={
    id: "1",
    title: "Old Timer",
    description: "Old Description",
    duration: 3600,
    remainingTime: 0,
    isRunning: false,
    createdAt:Date.now()
}

describe("TimerModal Component", () => {
  const mockOnClose = vi.fn();
  const mockAddTimer = vi.fn();
  const mockEditTimer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTimerStore as vi.Mock).mockReturnValue({
      addTimer: mockAddTimer,
      editTimer: mockEditTimer,
    });
  });

  it("renders the modal when open", () => {
    render(
      <TimerModal isOpen={true} onClose={mockOnClose} modalType="add" timer={null} />
    );

    expect(screen.getByText("Add New Timer")).toBeInTheDocument();
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/Seconds/i)).toBeInTheDocument();
  });

  it("does not render the modal when closed", () => {
    render(<TimerModal isOpen={false} onClose={mockOnClose} modalType="add" timer={null} />);
    expect(screen.queryByText("Add New Timer")).not.toBeInTheDocument();
  });

  it("pre-fills the form in edit mode with the timer data", () => {

    const mockEditTimer :Timer={
      id: "1",
      title: "Old Timer",
      description: "Old Description",
      duration: 3600,
      remainingTime: 3600,
      isRunning: false,
      createdAt:Date.now()
  } 

    render(
      <TimerModal
        isOpen={true}
        onClose={mockOnClose}
        modalType="edit"
        timer={mockEditTimer}
      />
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Old Timer");
    expect(screen.getByLabelText("Description")).toHaveValue("Old Description");
    expect(screen.getByLabelText("Hours")).toHaveValue(1);
    expect(screen.getByLabelText("Minutes")).toHaveValue(0);
    expect(screen.getByLabelText("Seconds")).toHaveValue(0);
  });

  it("validates the form and shows error messages", () => {
    render(<TimerModal isOpen={true} onClose={mockOnClose} modalType="add" timer={null} />);

    fireEvent.click(screen.getByText("Create Timer"));

    expect(screen.getByText("Title is required and must be less than 50 characters")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid time duration.")).toBeInTheDocument();
  });

  it("calls addTimer when the form is submitted in add mode", () => {
    render(<TimerModal isOpen={true} onClose={mockOnClose} modalType="add" timer={null} />);

    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: "New Timer" } });
    fireEvent.change(screen.getByLabelText(/Hours/), { target: { value: 1 } });
    fireEvent.click(screen.getByText("Create Timer"));

    expect(mockAddTimer).toHaveBeenCalledWith({
      title: "New Timer",
      description: "",
      duration: 3600,
      remainingTime: 3600,
      isRunning: false,
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls editTimer when the form is submitted in edit mode", () => {


    render(
      <TimerModal
        isOpen={true}
        onClose={mockOnClose}
        modalType="edit"
        timer= {timer}
      />
    );

    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: "Updated Timer" } });
    fireEvent.change(screen.getByLabelText(/Minutes/), { target: { value: 30 } });
    fireEvent.change(screen.getByLabelText(/Hours/), { target: { value: 0 } })
    fireEvent.click(screen.getByText("Save Changes"));

    expect(mockEditTimer).toHaveBeenCalledWith("1", {
      title: "Updated Timer",
      description: "Old Description",
      duration: 1800, 
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  // it("calls onClose when the cancel button is clicked", () => {
  //   render(<TimerModal isOpen={true} onClose={mockOnClose} modalType="add" timer={null} />);

  //   fireEvent.click(screen.getByText("Cancel"));

  //   expect(mockOnClose).toHaveBeenCalled();
  // });
});
