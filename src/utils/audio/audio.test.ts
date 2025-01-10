import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TimerAudio } from "./audio"

describe("TimerAudio", () => {

  // Mock the HTMLAudioElement
  let mockAudioPlay: ReturnType<typeof vi.fn<[], Promise<void>>>;
  let mockAudioPause: ReturnType<typeof vi.fn<[], void>>;
  let mockAudio: Partial<HTMLAudioElement>;

  beforeEach(() => {
    mockAudioPlay = vi.fn(() => Promise.resolve());
    mockAudioPause = vi.fn();
    mockAudio = {
      play: mockAudioPlay,
      pause: mockAudioPause,
      loop: false,
      currentTime: 0,
    };

    vi.spyOn(globalThis, "Audio").mockImplementation(() => mockAudio as HTMLAudioElement);
  });

  it("should create a singleton instance", () => {
    const instance1 = TimerAudio.getInstance();
    const instance2 = TimerAudio.getInstance();

    expect(instance1).toBe(instance2);
  });

  it("should play continuous audio for a given id", async () => {
    const timerAudio = TimerAudio.getInstance();

    await timerAudio.playContinuous("test-id");

    const audio = timerAudio["audioMap"].get("test-id");
    expect(audio).toBeDefined();
    expect(audio?.loop).toBe(true);
    expect(mockAudioPlay).toHaveBeenCalledTimes(1);
  });


  it("should stop and clear audio for a given id", async () => {
    const timerAudio = TimerAudio.getInstance();

    await timerAudio.playContinuous("test-id");
    timerAudio.stop("test-id");

    const audio = timerAudio["audioMap"].get("test-id");
    expect(audio).toBeUndefined();
    expect(mockAudio?.currentTime).toBe(0);
  });


  afterEach(() => {
    vi.restoreAllMocks();
  });
});
