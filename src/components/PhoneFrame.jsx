import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function PhoneFrame({ children }) {
  const [time, setTime] = useState('');

  // Update clock in status bar to display current system time (HH:MM)
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours().toString().padStart(2, '0');
      let minutes = date.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b141a] p-0 md:p-6 select-none font-wa">
      {/* Phone chassis - only styled with bezel and shadow on medium screens and larger */}
      <div className="relative w-full h-screen md:h-[820px] md:w-[390px] bg-[#0c1317] md:rounded-[42px] md:border-[10px] md:border-[#2d383e] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Camera notch / punch-hole (top center) - desktop only */}
        <div className="hidden md:block absolute top-[12px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50"></div>
        
        {/* Status Bar (Android Style) */}
        <div className="w-full h-8 bg-[#005e54] text-white flex justify-between items-center px-6 text-xs font-semibold z-40 select-none shrink-0 pt-1">
          {/* Time on the left */}
          <span>{time || "12:00"}</span>
          
          {/* Icons on the right */}
          <div className="flex items-center gap-1.5">
            <Signal size={12} className="opacity-90" />
            <Wifi size={12} className="opacity-90" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px]">98%</span>
              <Battery size={13} className="rotate-90 origin-center opacity-90" />
            </div>
          </div>
        </div>

        {/* Dynamic content (WhatsApp replica screens) */}
        <div className="flex-1 w-full flex flex-col overflow-hidden bg-wa-bg-cream relative">
          {children}
        </div>

        {/* Android Navigation Bar (Bottom Bar) */}
        <div className="w-full h-[42px] bg-black text-[#8e999e] flex justify-around items-center px-12 z-40 shrink-0 select-none">
          {/* Back (Triangle/Left Arrow symbol) */}
          <button className="hover:text-white transition-colors duration-150 p-2 focus:outline-none">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19,20 9,12 19,4" />
            </svg>
          </button>
          
          {/* Home (Circle symbol) */}
          <button className="hover:text-white transition-colors duration-150 p-2 focus:outline-none">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-current"></div>
          </button>
          
          {/* Recent Apps (Square symbol) */}
          <button className="hover:text-white transition-colors duration-150 p-2 focus:outline-none">
            <div className="w-3.5 h-3.5 border-2 border-current rounded-[2px]"></div>
          </button>
        </div>
        
      </div>
    </div>
  );
}
