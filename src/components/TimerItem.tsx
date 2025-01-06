import React, { useEffect, useRef, useState } from "react";
import { Trash2, RotateCcw, Pencil } from "lucide-react";
import { Timer } from "../types/timer";
import { formatTime } from "../utils/time";
import { useTimerStore } from "../store/useTimerStore";
import { toast } from "sonner";
import { EditTimerModal } from "./EditTimerModal";
import { TimerAudio } from "../utils/audio";
import { TimerControls } from "./TimerControls";
import { TimerProgress } from "./TimerProgress";

interface TimerItemProps {
  timer: Timer;
}

export const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { deleteTimer, restartTimer } = useTimerStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Maintaining Remaining time separately for each timer
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [isRunning, setIsRunning] = useState(timer.isRunning);
  const intervalRef = useRef<number | null>(null);
  const timerAudio = TimerAudio.getInstance();
  const hasEndedRef = useRef(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        // Independent timer functionality instead of using redux
        setRemainingTime((prevTime) => {
          if (prevTime <= 1 && !hasEndedRef.current) {
            hasEndedRef.current = true;
            timerAudio.play().catch(console.error);

            toast.success(`Timer "${timer.title}" has ended!`, {
              duration: 5000,
              action: {
                label: "Dismiss",
                onClick: () => {},
              },
            });
            setIsRunning(false); // Stop the timer
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current!); // Cleanup
  }, [isRunning, timer.title, timerAudio]);

  const handleRestart = () => {
    hasEndedRef.current = false;
    setRemainingTime(timer.duration);
    setIsRunning(false);
    restartTimer(timer.id);
  };

  const handleDelete = () => {
    timerAudio.stop();
    deleteTimer(timer.id);
  };

  const handleToggle = () => {
    if (remainingTime <= 0) {
      hasEndedRef.current = false;
    }
    setIsRunning((prev) => !prev);
  };

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
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 text-blue-500 transition-colors rounded-full hover:bg-blue-50"
                title="Edit Timer"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 text-blue-500 transition-colors rounded-full hover:bg-blue-50"
                title="Restart Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 transition-colors rounded-full hover:bg-red-50"
                title="Delete Timer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center mt-6">
            <div className="mb-4 font-mono text-4xl font-bold text-gray-800">
              {formatTime(remainingTime)}
            </div>

            <TimerProgress progress={(remainingTime / timer.duration) * 100} />

            <TimerControls
              isRunning={isRunning}
              remainingTime={remainingTime}
              duration={timer.duration}
              onToggle={handleToggle}
              onRestart={handleRestart}
            />
          </div>
        </div>
      </div>

      <EditTimerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        timer={timer}
      />
    </>
  );
};
