# Timer App

A modern, user-friendly timer application built with React that helps you manage multiple timers simultaneously. The app features a clean, responsive design and robust state management.

![alt text](/assets/image.png)
![alt text](/assets/image-1.png)
![alt text](/assets/image-2.png)
![alt text](/assets/image-3.png)
![alt text](/assets/image-4.png)
![alt text](/assets/image-5.png)

## Features

- **Multiple Timers**: Create and run multiple countdowns simultaneously
   - ▶️ Play/Pause: Start or pause the countdown
   - 🔄 Reset: Return timer to its initial duration
   - ✏️ Edit: Modify timer title or duration
   - 🗑️ Delete: Remove the timer
- **Persistent Storage**: All timers persist across page refreshes
- **Timer Controls**:
  - Create new timers with custom duration and title
  - Edit existing timer settings
  - Pause and resume functionality
  - Reset timers to initial duration
  - Delete unwanted timers
- **Smart Notifications**:
  - Visual and audio alerts when timers complete
  - Desktop notifications appear in top-right corner
  - Mobile notifications show at bottom of screen
  - Dismissible notification system
  - Sound continues until notification is dismissed

- **Local Storage**:
  - The app automatically saves all timer data to your browser's localStorage, ensuring:
  - Timers persist between page refreshes
  - Timer states (running/paused) are preserved
  - No data loss when closing/reopening the browser

## Tech Stack

- **Frontend Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: 
  - Lucide Icons for vector graphics
  - Sonner for toast notifications
  - Custom React components

---

## **Project Setup**

1. Clone the repository:  
   ```bash
   git clone https://github.com/aravind2347214/timer.git
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Start the development server:  
   ```bash
   npm run dev
   ```

4. Run tests:  
   ```bash
   npm vitest
   ```

---


