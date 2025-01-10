import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "../Button/Button";

interface TimerControlsProps {
  isRunning: boolean;
  remainingTime: number;
  duration: number;
  onToggle: () => void;
  onRestart: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  remainingTime,
  // duration,
  onToggle,
  onRestart,
}) => {
  const isCompleted = remainingTime <= 0;

  if (isCompleted) {
    return (
      <Button
        onClick={onRestart}
        variant="icon"
        className="p-3 text-blue-600 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
        title="Restart Timer"
        children={<RotateCcw className="w-6 h-6" />}
      >
        
      </Button>
    );
  }

  return (
    <Button
      onClick={onToggle}
      variant="icon"
      className={`p-3 rounded-full transition-colors ${
        isRunning
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-green-100 text-green-600 hover:bg-green-200"
      }`}
      children = {
        isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />
      }
      
      title={isRunning ? "Pause Timer" : "Start Timer"}
    >
    </Button>
  );
};
