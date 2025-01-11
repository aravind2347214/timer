import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateTimerForm } from "./validation";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("validateTimerForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return false if title is empty", () => {
    const formData = { title: "", description: "", hours: 1, minutes: 0, seconds: 0 };
    const isValid = validateTimerForm(formData);
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Title is required");
  });

  it("should return false if title exceeds 50 characters", () => {
    const formData = {
      title: "a".repeat(51),
      description: "",
      hours: 1,
      minutes: 0,
      seconds: 0,
    };
    const isValid = validateTimerForm(formData);
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Title must be less than 50 characters");
  });

  it("should return false if time values are negative", () => {
    const formData = { title: "Test Timer", description: "", hours: -1, minutes: 0, seconds: 0 };
    const isValid = validateTimerForm(formData);
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Time values cannot be negative");
  });

  it("should return false if minutes or seconds exceed 59", () => {
    const formData = { title: "Test Timer", description: "", hours: 0, minutes: 60, seconds: 0 };
    const isValid = validateTimerForm(formData);
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Minutes and seconds must be between 0 and 59");
  });

  it("should return false if total time is 0 seconds", () => {
    const formData = { title: "Test Timer", description: "", hours: 0, minutes: 0, seconds: 0 };
    const isValid = validateTimerForm(formData);
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Please set a time greater than 0");
  });

  it("should return false if total time exceeds 24 hours", () => {
    const formData = { title: "Test Timer", description: "", hours: 24, minutes: 1, seconds: 0 };
    const isValid = validateTimerForm(formData);
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Timer cannot exceed 24 hours");
  });

  it("should return true for valid timer data", () => {
    const formData = { title: "Test Timer", description: "", hours: 1, minutes: 30, seconds: 15 };
    const isValid = validateTimerForm(formData);
    expect(isValid).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });
});
