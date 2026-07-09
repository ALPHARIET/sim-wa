import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatArea({ 
  messages, 
  statusText, 
  selectedMessageId, 
  onSelectMessage, 
  onReact, 
  onReplyTo,
  scrollToMessageId,
  setScrollToMessageId
}) {
  const chatBottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, statusText]);

  // Scroll to quoted message when reply context header is clicked
  useEffect(() => {
    if (scrollToMessageId) {
      const element = document.getElementById(`msg-${scrollToMessageId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight effect
        element.classList.add('bg-[#25d36630]');
        setTimeout(() => {
          element.classList.remove('bg-[#25d36630]');
        }, 1500);
      }
      setScrollToMessageId(null);
    }
  }, [scrollToMessageId]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 w-full overflow-y-auto px-1 py-3 wa-scrollbar relative"
      style={{ backgroundColor: '#0b141a' }}
    >
      {/* Background WhatsApp Doodle Image Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '360px'
        }}
      ></div>

      <div className="relative z-10 w-full flex flex-col gap-1">
        {/* Security / Encryption Notice Badge */}
        <div className="flex justify-center my-2.5">
          <div className="bg-[#182229] border border-[#2f3c44] text-[#ffd279] text-[11px] px-3 py-1.5 rounded-lg text-center max-w-[85%] leading-[1.3] shadow-sm select-none">
            🔒 Pesan dan panggilan terenkripsi secara end-to-end. Tidak ada seorang pun di luar chat ini yang dapat membaca atau mendengarnya.
          </div>
        </div>

        {/* Date separator */}
        <div className="flex justify-center my-2">
          <span className="bg-[#182229] border border-[#2f3c44] text-[#8696a0] text-[10.5px] font-medium px-2.5 py-1 rounded-md tracking-wide uppercase select-none shadow-sm">
            Hari ini
          </span>
        </div>

        {/* Message bubbles list */}
        {messages.map((msg) => {
          // Find text of quoted message
          const quotedMsg = msg.replyToId ? messages.find(m => m.id === msg.replyToId) : null;
          let quotedText = "";
          if (quotedMsg) {
            quotedText = quotedMsg.isDeleted 
              ? "🚫 Pesan ini telah dihapus" 
              : quotedMsg.type === 'text' 
                ? quotedMsg.text 
                : quotedMsg.type === 'image' 
                  ? '📷 Foto' 
                  : quotedMsg.type === 'audio' 
                    ? '🎵 Pesan suara' 
                    : quotedMsg.type === 'document' 
                      ? `📄 ${quotedMsg.fileName}` 
                      : quotedMsg.type === 'location'
                        ? '📍 Lokasi'
                        : 'Lampiran';
          }

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSelected={selectedMessageId === msg.id}
              onSelectMessage={onSelectMessage}
              onReact={onReact}
              onReplyTo={onReplyTo}
              quotedMessageText={quotedText}
              scrollToMessage={(replyId) => setScrollToMessageId(replyId)}
            />
          );
        })}

        {/* Simulated Typing Indicator (Bouncing Dots Bubble) */}
        {(statusText === 'Ketik pesan...' || statusText === 'Sedang merekam...') && (
          <div className="flex justify-start my-1 px-4">
            <div className="bg-white text-wa-text-primary rounded-xl rounded-tl-none px-3.5 py-2.5 wa-bubble-shadow flex items-center gap-1.5 animate-bubble max-w-[200px]">
              {statusText === 'Sedang merekam...' ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[13px] text-wa-text-secondary">Sedang merekam...</span>
                </div>
              ) : (
                <div className="flex gap-1 items-center h-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#8696a0] animate-typing-dot" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[#8696a0] animate-typing-dot" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[#8696a0] animate-typing-dot" style={{ animationDelay: '0.4s' }}></span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Anchor for auto scroll */}
        <div ref={chatBottomRef} className="h-4 w-full"></div>
      </div>
    </div>
  );
}
