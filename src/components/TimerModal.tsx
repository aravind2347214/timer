import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { useTimerStore } from "../store/useTimerStore";
import { validateTimerForm } from "../utils/validation";
import { Timer } from "../types/timer";
import { Button } from "./Button";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer?: Timer | null;
  modalType: "add" | "edit";
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  timer,
  modalType,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [touched, setTouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const { addTimer, editTimer } = useTimerStore();

  // Reset form when modal opens/closes or modalType changes
  useEffect(() => {
    if (isOpen) {
      if (modalType === "edit" && timer) {
        // Populate form with timer data for edit mode
        setTitle(timer.title || "");
        setDescription(timer.description || "");
        setHours(Math.floor(timer.duration / 3600));
        setMinutes(Math.floor((timer.duration % 3600) / 60));
        setSeconds(timer.duration % 60);
      } else {
        // Reset form for add mode
        setTitle("");
        setDescription("");
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
      // Reset touched state
      setTouched({
        title: false,
        hours: false,
        minutes: false,
        seconds: false,
      });
    }
  }, [isOpen, timer, modalType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!validateTimerForm({ title, description, hours, minutes, seconds })) {
      setTouched({
        title: true,
        hours: true,
        minutes: true,
        seconds: true,
      });
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (modalType === "edit" && timer) {
      editTimer(timer.id, {
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
      });
    } else {
      addTimer({
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
        remainingTime: totalSeconds,
        isRunning: false,
      });
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
    setTouched({
      title: false,
      hours: false,
      minutes: false,
      seconds: false,
    });
  };

  const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
  const isTitleValid = title.trim().length > 0 && title.length <= 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {modalType === "edit" ? "Edit Timer" : "Add New Timer"}
            </h2>
          </div>
          <Button
            onClick={handleClose}
            className="p-1 text-gray-700 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched({ ...touched, title: true })}
              maxLength={50}
              className={`w-full p-2 border rounded-md ${
                touched.title && !isTitleValid
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter timer title"
            />
            {touched.title && !isTitleValid && (
              <p className="mt-1 text-sm text-red-500">
                Title is required and must be less than 50 characters
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {title.length}/50 characters
            </p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter timer description (optional)"
            />
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-600">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) =>
                    setHours(Math.min(23, parseInt(e.target.value) || 0))
                  }
                  onBlur={() => setTouched({ ...touched, hours: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) =>
                    setMinutes(Math.min(59, parseInt(e.target.value) || 0))
                  }
                  onBlur={() => setTouched({ ...touched, minutes: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Seconds
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) =>
                    setSeconds(Math.min(59, parseInt(e.target.value) || 0))
                  }
                  onBlur={() => setTouched({ ...touched, seconds: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {!isTimeValid &&
              touched.hours &&
              touched.minutes &&
              touched.seconds && (
                <p className="mt-1 text-sm text-red-500">
                  Please enter a valid time duration.
                </p>
              )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700"
            >
              {modalType === "edit" ? "Save Changes" : "Create Timer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};