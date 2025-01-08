import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { TimerList } from "./components/TimerList";
// import { AddTimerModal } from "./components/AddTimerModal";
import { Toaster } from "sonner";
import { TimerModal } from "./components/TimerModal";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <span className="hidden md:flex">
        <Toaster position="top-right" />
      </span>
      <span className="flex md:hidden">
        <Toaster position="bottom-center" />
      </span>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row gap-3">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600 " />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Timer App</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Timer
          </button>
        </div>

        <TimerList />

        <TimerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          modalType="add"
          timer={null}
          
        />
      </div>
    </div>
  );
}

export default Home;
