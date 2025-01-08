import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { TimerAudio } from "./audio";

describe("TimerAudio", () => {
  let timerAudio: TimerAudio;

  beforeEach(() => {
    timerAudio = TimerAudio.getInstance();

    // Mock the AudioContext
    globalThis.AudioContext = class {
      state = "suspended";
      resume = vi.fn().mockResolvedValue(undefined);
      createOscillator = vi.fn().mockReturnValue({
        type: "",
        frequency: {
          setValueAtTime: vi.fn(),
        },
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
      });
      createGain = vi.fn().mockReturnValue({
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
      });
      close = vi.fn().mockResolvedValue(undefined);
      destination = {};
    } as unknown as typeof AudioContext;
  });

  afterEach(() => {
    // Reset mock behavior after each test
    vi.restoreAllMocks();
  });

  it("should create a singleton instance", () => {
    const anotherInstance = TimerAudio.getInstance();
    expect(timerAudio).toBe(anotherInstance);
  });

  it("should initialize an audio context for a timer ID", async () => {
    const timerId = "testTimer";
    await timerAudio.play(timerId);

    expect(timerAudio["audioContexts"].has(timerId)).toBe(true);
    const audioContext = timerAudio["audioContexts"].get(timerId);
    expect(audioContext!.resume).toHaveBeenCalled();
  });

  it("should clean up resources after stopping a timer", async () => {
    const timerId = "testTimer";
    await timerAudio.play(timerId);
    timerAudio.stop(timerId);

    expect(timerAudio["oscillators"].has(timerId)).toBe(false);
    expect(timerAudio["gainNodes"].has(timerId)).toBe(false);
    expect(timerAudio["audioContexts"].has(timerId)).toBe(false);
  });

  it("should handle errors during audio playback", async () => {
    const originalAudioContext = globalThis.AudioContext;
    globalThis.AudioContext = vi.fn().mockImplementation(() => {
      throw new Error("AudioContext error");
    });

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const timerId = "errorTestTimer";
    await timerAudio.play(timerId);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Failed to play audio for timer ${timerId}:`,
      expect.any(Error)
    );

    globalThis.AudioContext = originalAudioContext; // Restore original AudioContext
  });
});
