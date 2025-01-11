import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TimerProgress } from "./TimerProgress";

describe("TimerProgress Component", () => {
  it("renders the progress bar correctly and reflects the progress", () => {
    const progress = 50;

    render(<TimerProgress progress={progress} />);
    // Get the inner progress bar div and check its width style
    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toHaveStyle(`width: ${progress}%`);
  });
});
