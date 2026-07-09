import React, { useState } from 'react';
import { ArrowLeft, Video, Phone, MoreVertical, ShieldAlert, Ban, VolumeX, Trash2 } from 'lucide-react';

export default function ChatHeader({ 
  contactName, 
  statusText, 
  profilePic, 
  onResetChat, 
  onTriggerCall,
  onOpenAvatarModal
}) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleMenuAction = (action) => {
    setShowMenu(false);
    if (action === 'reset') {
      onResetChat();
    }
  };

  return (
    <div className="w-full h-15 bg-wa-green text-white flex items-center justify-between px-2 wa-header-shadow z-30 select-none shrink-0 relative">
      {/* Left side: Back button, Avatar, Name & Status */}
      <div className="flex items-center flex-1 min-w-0 gap-1">
        {/* Back Button */}
        <button className="p-1 hover:bg-[#ffffff20] rounded-full transition-colors duration-150 focus:outline-none">
          <ArrowLeft size={20} />
        </button>

        {/* Profile Avatar (Clickable to zoom) */}
        <button 
          onClick={onOpenAvatarModal}
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 focus:outline-none hover:opacity-90 active:scale-95 transition-all duration-150"
        >
          <img 
            src={profilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
            alt={contactName} 
            className="w-full h-full object-cover"
          />
        </button>

        {/* Contact Info */}
        <div className="flex flex-col justify-center flex-1 min-w-0 pl-1">
          <h2 className="text-[16px] font-semibold leading-tight truncate text-white m-0">
            {contactName}
          </h2>
          <span className={`text-[11px] truncate opacity-90 transition-all duration-300 font-medium ${
            statusText === 'Ketik pesan...' || statusText === 'Sedang merekam...' || statusText === 'Online' 
              ? 'text-wa-green-light font-semibold' 
              : 'text-[#e9edef]'
          }`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-1">
        {/* Video Call Button */}
        <button 
          onClick={() => onTriggerCall('video')}
          className="p-2 hover:bg-[#ffffff20] rounded-full transition-colors duration-150 focus:outline-none"
          title="Video Call"
        >
          <Video size={19} />
        </button>

        {/* Voice Call Button */}
        <button 
          onClick={() => onTriggerCall('voice')}
          className="p-2 hover:bg-[#ffffff20] rounded-full transition-colors duration-150 focus:outline-none"
          title="Voice Call"
        >
          <Phone size={17} />
        </button>

        {/* More Actions Menu */}
        <div className="relative">
          <button 
            onClick={toggleMenu}
            className="p-2 hover:bg-[#ffffff20] rounded-full transition-colors duration-150 focus:outline-none"
            title="Menu Lainnya"
          >
            <MoreVertical size={19} />
          </button>

          {/* Android Style Menu Dropdown */}
          {showMenu && (
            <>
              {/* Overlay transparent background to close menu */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-1 top-10 w-48 bg-[#233138] text-[#e9edef] rounded-md shadow-2xl py-1.5 z-50 text-[14.5px] border border-[#2f4049]">
                <button 
                  onClick={() => handleMenuAction('reset')}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#182229] transition-colors duration-150 flex items-center gap-3"
                >
                  <Trash2 size={16} className="text-red-400" />
                  <span>Bersihkan Chat</span>
                </button>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#182229] transition-colors duration-150 flex items-center gap-3 opacity-60 cursor-not-allowed"
                  disabled
                >
                  <VolumeX size={16} />
                  <span>Bungkam Notifikasi</span>
                </button>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#182229] transition-colors duration-150 flex items-center gap-3 opacity-60 cursor-not-allowed"
                  disabled
                >
                  <Ban size={16} />
                  <span>Blokir Kontak</span>
                </button>
                <div className="border-t border-[#2f4049] my-1"></div>
                <div className="px-4 py-1 text-[11px] text-[#667781] flex items-center gap-1.5">
                  <ShieldAlert size={10} />
                  <span>Simulator Antarmuka</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
