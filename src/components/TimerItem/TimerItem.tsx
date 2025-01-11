import React, { useEffect, useRef, useState } from "react";
import { Timer } from "../../types/timer";
import { formatTime } from "../../utils/time/time";
import { useTimerStore } from "../../store/useTimerStore";
import { toast } from "sonner";
import { TimerAudio } from "../../utils/audio/audio";
import { TimerControls } from "../TimerControls/TimerControls";
import { TimerProgress } from "../TimerProgress/TimerProgress";
import { TimerModal } from "../TimerModal/TimerModal";
import { Button } from "../Button/Button";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";

interface TimerItemProps {
  timer: Timer;
}

export const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { deleteTimer, restartTimer, updateRemainingTime } = useTimerStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(timer.isRunning);
  const intervalRef = useRef<number | null>(null);
  const timerAudio = TimerAudio.getInstance();
  const hasEndedRef = useRef(false);
  
  // Using a ref for remaining time to avoid re-renders
  const remainingTimeRef = useRef(timer.remainingTime);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    remainingTimeRef.current = timer.remainingTime;
  }, [timer.remainingTime]);

  useEffect(() => {
    let cleanup = false;

    const handleTimerTick = () => {
      if (cleanup) return;
      
      if (remainingTimeRef.current <= 1 && !hasEndedRef.current) {
        hasEndedRef.current = true;
        setIsRunning(false);
        updateRemainingTime(timer.id, 0);
        
        // Schedule toast outside of state update
        Promise.resolve().then(() => {
          timerAudio.playContinuous(timer.id).catch(console.error);
          toast.success(`Timer "${timer.title}" has ended!`, {
            duration: Infinity,
            action: {
              label: "Dismiss",
              onClick: () => {
                timerAudio.stop(timer.id);
              },
            },
          });
        });
        
        return;
      }

      remainingTimeRef.current -= 1;
      updateRemainingTime(timer.id, remainingTimeRef.current);
      forceUpdate({}); // Trigger re-render without state dependency
    };

    if (isRunning) {
      intervalRef.current = window.setInterval(handleTimerTick, 1000);
    }

    return () => {
      cleanup = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timer.id, timer.title, updateRemainingTime,timerAudio]);

  const handleRestart = React.useCallback(() => {
    hasEndedRef.current = false;
    remainingTimeRef.current = timer.duration;
    setIsRunning(false);
    restartTimer(timer.id);
    timerAudio.stop(timer.id);
  }, [timer.duration, timer.id, restartTimer, timerAudio]);

  const handleDelete = React.useCallback(() => {
    timerAudio.stop(timer.id);
    deleteTimer(timer.id);
  }, [timer.id, deleteTimer, timerAudio]);

  const handleToggle = React.useCallback(() => {
    if (remainingTimeRef.current <= 0) {
      hasEndedRef.current = false;
      remainingTimeRef.current = timer.duration;
      updateRemainingTime(timer.id, timer.duration);
    }
    setIsRunning(prev => !prev);
  }, [timer.duration, timer.id, updateRemainingTime]);

  return (
    <>
      <div className="relative p-6 overflow-hidden transition-transform bg-white shadow-lg rounded-xl hover:scale-102">
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {timer.title}
              </h3>
              <p className="mt-1 text-gray-600">{timer.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 text-blue-500 transition-colors rounded-full hover:bg-blue-50"
                variant="icon"
                title="Edit Button"
              >
                <Pencil className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleRestart}
                className="p-2 text-blue-500 transition-colors rounded-full hover:bg-blue-50"
                variant="icon"
                title="Restart Button"
              >
                        <RotateCcw className="w-5 h-5" />

              </Button>
              <Button
                onClick={handleDelete}
                className="p-2 text-red-500 transition-colors rounded-full hover:bg-red-50"
                variant="icon"
                title="Delete Button"
              >
              <Trash2 className="w-5 h-5" />
              </Button>
              
            </div>
          </div>
          <div className="flex flex-col items-center mt-6">
            <div className="mb-4 font-mono text-4xl font-bold text-gray-800">
              {formatTime(remainingTimeRef.current)}
            </div>

            <TimerProgress 
              progress={(remainingTimeRef.current / timer.duration) * 100} 
            />

            <TimerControls
              isRunning={isRunning}
              remainingTime={remainingTimeRef.current}
              duration={timer.duration}
              onToggle={handleToggle}
              onRestart={handleRestart}
            />
          </div>
        </div>
      </div>

      <TimerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        timer={timer}
        modalType="edit"
      />
    </>
  );
};