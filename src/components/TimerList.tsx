import React from "react";
import { TimerItem } from "./TimerItem";
import { useTimerStore } from "../store/useTimerStore";
import { EmptyState } from "./EmptyState";

export const TimerList: React.FC = () => {
  const { timers } = useTimerStore();

  return (
    <div className="space-y-4 min-h-[400px] py-8">
      {timers.length === 0 ? (
        <div className="h-[400px] flex flex-col items-center justify-center">
          <EmptyState />
          <p className="text-xl font-medium text-center text-gray-500">
            No timers yet. Add one to get started!
          </p>
          <p className="mt-2 text-center text-gray-400">
            Click the "Add Timer" button above to create your first timer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {timers.map((timer) => (
            <TimerItem key={timer.id} timer={timer} />
          ))}
        </div>
      )}
    </div>
  );
};
