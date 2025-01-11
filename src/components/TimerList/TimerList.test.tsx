import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { TimerList } from "./TimerList";
import { useTimerStore } from "../../store/useTimerStore";

// Mock the necessary dependencies
vi.mock("../../store/useTimerStore", () => ({
  useTimerStore: vi.fn(),
}));

vi.mock("../TimerItem/TimerItem", () => ({
  TimerItem: ({ timer }: { timer: { id: string } }) => (
    <div data-testid="timer-item">{timer.id}</div>
  ),
}));

vi.mock("../EmptyState/EmptyState", () => ({
  EmptyState: () => <div data-testid="empty-state">Empty State</div>,
}));

describe("TimerList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the empty state when no timers exist", () => {
    (useTimerStore as vi.Mock).mockReturnValue({ timers: [] });

    render(<TimerList />);

    // Check for the EmptyState component
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    // Check for empty state messages
    expect(
      screen.getByText("No timers yet. Add one to get started!")
    ).toBeInTheDocument();
    
    expect(
      screen.getByText(
        'Click the "Add Timer" button above to create your first timer.'
      )
    ).toBeInTheDocument();
  });

  it("renders a list of TimerItem components when timers exist", () => {
    const mockTimers = [
      { id: "timer1", name: "Timer 1" },
      { id: "timer2", name: "Timer 2" },
    ];
    (useTimerStore as vi.Mock).mockReturnValue({ timers: mockTimers });

    render(<TimerList />);

    // Check that TimerItem components are rendered
    const timerItems = screen.getAllByTestId("timer-item");
    expect(timerItems).toHaveLength(mockTimers.length);

    // Check for specific timer ids
    mockTimers.forEach((timer) => {
      expect(screen.getByText(timer.id)).toBeInTheDocument();
    });
  });
});
