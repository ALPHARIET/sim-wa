import React from 'react';
import { FileText, Camera, Image, Headphones, MapPin, User, BarChart2 } from 'lucide-react';

export default function AttachmentTray({ isOpen, onClose, onSendMockMedia }) {
  if (!isOpen) return null;

  const items = [
    { 
      id: 'document', 
      label: 'Dokumen', 
      icon: <FileText size={22} className="text-white" />, 
      bgColor: 'bg-[#7f66ff]' 
    },
    { 
      id: 'camera', 
      label: 'Kamera', 
      icon: <Camera size={22} className="text-white" />, 
      bgColor: 'bg-[#ff2e74]' 
    },
    { 
      id: 'gallery', 
      label: 'Galeri', 
      icon: <Image size={22} className="text-white" />, 
      bgColor: 'bg-[#d33bff]' 
    },
    { 
      id: 'audio', 
      label: 'Audio', 
      icon: <Headphones size={22} className="text-white" />, 
      bgColor: 'bg-[#ff7e2e]' 
    },
    { 
      id: 'location', 
      label: 'Lokasi', 
      icon: <MapPin size={22} className="text-white" />, 
      bgColor: 'bg-[#00e676]' 
    },
    { 
      id: 'contact', 
      label: 'Kontak', 
      icon: <User size={22} className="text-white" />, 
      bgColor: 'bg-[#00b0ff]' 
    },
    { 
      id: 'poll', 
      label: 'Polling', 
      icon: <BarChart2 size={22} className="text-white" />, 
      bgColor: 'bg-[#009688]' 
    },
  ];

  const handleItemClick = (id) => {
    onSendMockMedia(id);
    onClose();
  };

  return (
    <>
      {/* Background click listener to close the tray */}
      <div className="absolute inset-0 z-30" onClick={onClose}></div>
      
      {/* Attachment Tray Overlay Sheet */}
      <div className="absolute bottom-[70px] left-3 right-3 bg-[#233138] border border-[#2d3a42] rounded-2xl p-4 grid grid-cols-3 gap-y-4 gap-x-2 z-40 animate-bubble shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="flex flex-col items-center gap-1.5 focus:outline-none group active:scale-95 transition-all duration-100"
          >
            {/* Round Icon container */}
            <div className={`w-[52px] h-[52px] rounded-full ${item.bgColor} flex items-center justify-center shadow-md group-hover:opacity-90`}>
              {item.icon}
            </div>
            {/* Label */}
            <span className="text-[11.5px] text-[#8696a0] font-medium group-hover:text-[#e9edef] transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
