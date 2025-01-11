import { useState, useEffect } from "react";
import { Plus, Clock } from "lucide-react";
import { TimerList } from "../src/components/TimerList/TimerList";
import { Toaster } from "sonner";
import { TimerModal } from "../src/components/TimerModal/TimerModal";
import { Button } from "../src/components/Button/Button";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior outside of render
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Single Toaster with dynamic position */}
      <Toaster position={isMobile ? "bottom-center" : "top-right"} />
      
      <div className="container px-4 py-8 mx-auto bg-red-400">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center text-3xl gap">
            <div className="flex items-center">
              <Clock className="text-blue-600 svg-size"/>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Timer App</h1>
          </div>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Timer
          </Button>
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