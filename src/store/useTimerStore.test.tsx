import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { Timer } from '../types/timer';
import { store, useTimerStore } from './useTimerStore';



// Helper function to wrap the hook with Provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('Timer Store', () => {
  let initialTimer: Omit<Timer, 'id' | 'createdAt'>;
  
  // Mock crypto.randomUUID
  const mockUUID = 'test-uuid-123';
  vi.stubGlobal('crypto', {
    randomUUID: () => mockUUID
  });

  // Mock Date.now
  const mockNow = 1642512000000;
  vi.spyOn(Date, 'now').mockImplementation(() => mockNow);

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
  };
  vi.stubGlobal('localStorage', localStorageMock);

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset store state
    store.dispatch({ type: 'timer/reset' });

    initialTimer = {
      title: 'Study Session',
      description: 'Focus time for coding',
      duration: 1800,
      remainingTime: 1800,
      isRunning: false
    };
  });

  describe('addTimer', () => {
    it('should add a new timer with generated id and timestamp', () => {
      const { result } = renderHook(() => useTimerStore(), { wrapper });
      
      act(() => {
        result.current.addTimer(initialTimer);
      });
      
      expect(result.current.timers[0]).toEqual({
        ...initialTimer,
        id: mockUUID,
        createdAt: mockNow
      });
    });

    it('should save to localStorage when adding timer', () => {
      const { result } = renderHook(() => useTimerStore(), { wrapper });
      
      act(() => {
        result.current.addTimer(initialTimer);
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'timerState',
        expect.any(String)
      );
      
      const savedState = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedState.timers[0]).toEqual({
        ...initialTimer,
        id: mockUUID,
        createdAt: mockNow
      });
    });
  });

  describe('deleteTimer', () => {
    it('should remove the timer with the specified id', () => {
      const { result } = renderHook(() => useTimerStore(), { wrapper });
      
      act(() => {
        result.current.addTimer(initialTimer);
        result.current.deleteTimer(mockUUID);
      });
      
      expect(result.current.timers).toHaveLength(0);
    });
  });

  describe('toggleTimer', () => {
    it('should toggle the isRunning state of the specified timer', () => {
      const { result } = renderHook(() => useTimerStore(), { wrapper });
      
      act(() => {
        result.current.addTimer(initialTimer);
        result.current.toggleTimer(mockUUID);
      });
      
      expect(result.current.timers[0].isRunning).toBe(true);

      act(() => {
        result.current.toggleTimer(mockUUID);
      });
      
      expect(result.current.timers[0].isRunning).toBe(false);
    });
  });

  describe('restartTimer', () => {
    it('should reset the remaining time to duration and stop the timer', () => {
      const { result } = renderHook(() => useTimerStore(), { wrapper });
      
      act(() => {
        result.current.addTimer(initialTimer);
        result.current.updateRemainingTime(mockUUID, 900);
        result.current.toggleTimer(mockUUID);
        result.current.restartTimer(mockUUID);
      });
      
      const timer = result.current.timers[0];
      expect(timer.remainingTime).toBe(timer.duration);
      expect(timer.isRunning).toBe(false);
    });
  });

  describe('updateRemainingTime', () => {
    it('should update the remaining time of the specified timer', () => {
      const { result } = renderHook(() => useTimerStore(), { wrapper });
      
      act(() => {
        result.current.addTimer(initialTimer);
        result.current.updateRemainingTime(mockUUID, 900);
      });
      
      expect(result.current.timers[0].remainingTime).toBe(900);
    });
  });
});