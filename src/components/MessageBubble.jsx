import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, CheckCheck, FileText, Download, MapPin, Smile, CornerUpLeft } from 'lucide-react';

const isJsonString = (str) => {
  if (typeof str !== 'string') return false;
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
};

export default function MessageBubble({ 
  message, 
  onSelectMessage, 
  isSelected, 
  onReact, 
  onReplyTo,
  quotedMessageText,
  scrollToMessage
}) {
  const { id, text, type, timestamp, sender, status, mediaUrl, caption, fileName, fileSize, fileExtension, address, duration, reactions, replyToId, isDeleted } = message;
  const isSent = sender === 'me';
  
  // Voice note play simulation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const timerRef = useRef(null);

  // Parse duration to seconds
  const getDurationSeconds = (durStr) => {
    if (!durStr) return 5;
    const parts = durStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const totalSeconds = getDurationSeconds(duration);

  // Voice note playback animation interval
  useEffect(() => {
    if (isPlaying) {
      const start = Date.now();
      const initialProgress = audioProgress;
      const initialSeconds = Math.floor((initialProgress / 100) * totalSeconds);

      timerRef.current = setInterval(() => {
        const delta = Math.floor((Date.now() - start) / 1000);
        const currentSecs = Math.min(initialSeconds + delta, totalSeconds);
        const progress = (currentSecs / totalSeconds) * 100;
        
        setAudioProgress(progress);
        
        const m = Math.floor(currentSecs / 60);
        const s = currentSecs % 60;
        setElapsedTime(`${m}:${s.toString().padStart(2, '0')}`);

        if (currentSecs >= totalSeconds) {
          setIsPlaying(false);
          setAudioProgress(0);
          setElapsedTime('0:00');
          clearInterval(timerRef.current);
        }
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const toggleAudio = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleBubbleClick = (e) => {
    e.stopPropagation();
    onSelectMessage(id);
  };

  // Checkmark rendering helper
  const renderCheckmarks = () => {
    if (!isSent) return null;
    if (status === 'sent') {
      return <Check size={14} className="text-[#8696a0]" />;
    } else if (status === 'delivered') {
      return <CheckCheck size={14} className="text-[#8696a0]" />;
    } else if (status === 'read') {
      return <CheckCheck size={14} className="text-wa-blue" />;
    }
    return null;
  };

  // Emojis for quick reactions
  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  return (
    <div 
      onClick={handleBubbleClick}
      className={`relative w-full flex flex-col my-1 px-4 cursor-pointer select-none transition-colors duration-150 ${
        isSelected ? 'bg-[#202c3399]' : 'hover:bg-[#202c3320]'
      }`}
      id={`msg-${id}`}
    >
      {/* Floating Reaction Bar when Selected */}
      {isSelected && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#233138] border border-[#2d3a42] rounded-full px-3 py-2 flex gap-3 shadow-lg z-50 animate-reaction wa-reaction-shadow">
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => {
                e.stopPropagation();
                onReact(id, emoji);
              }}
              className="text-[20px] hover:scale-130 active:scale-95 transition-transform duration-100"
            >
              {emoji}
            </button>
          ))}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onReplyTo(message);
            }}
            className="w-7 h-7 rounded-full bg-[#182229] hover:bg-[#2e3b43] text-white flex items-center justify-center transition-colors duration-100"
            title="Balas"
          >
            <CornerUpLeft size={14} />
          </button>
        </div>
      )}

      {/* Bubble Container alignment */}
      <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}>
        
        {/* Actual Chat Bubble */}
        <div 
          className={`max-w-[85%] rounded-xl px-2.5 py-1.5 wa-bubble-shadow relative ${
            isDeleted
              ? 'bg-[#202c33] border border-[#2f3c44] text-[#8696a0] italic text-[14px]'
              : type === 'sticker'
                ? 'bg-transparent shadow-none p-0'
                : isSent 
                  ? 'bg-wa-bubble-sent text-wa-text-primary rounded-tr-none' 
                  : 'bg-wa-bubble-received text-wa-text-primary rounded-tl-none'
          } animate-bubble`}
        >
          
          {/* Reply Context Header in bubble */}
          {replyToId && !isDeleted && type !== 'sticker' && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                scrollToMessage(replyToId);
              }}
              className="mb-1.5 p-2 rounded-md bg-[#0000000e] border-l-4 border-[#00a884] text-[13px] text-left cursor-pointer hover:bg-[#00000018] transition-colors"
            >
              <div className="font-semibold text-[#00a884] text-[11.5px]">
                {isSent ? 'Anda' : 'Kontak'}
              </div>
              <div className="truncate text-wa-text-primary text-[12.5px] opacity-80">
                {quotedMessageText || "Pesan Terlampir"}
              </div>
            </div>
          )}

          {/* Render content based on Message Type */}
          {isDeleted ? (
            <div className="flex items-center gap-1.5 pr-8 py-0.5">
              <span className="text-[13px]">🚫 Pesan ini telah dihapus</span>
            </div>
          ) : (
            <>
              {/* 1. TEXT */}
              {type === 'text' && (
                <div className="text-[14.5px] pr-12 leading-[1.3] text-left break-words font-normal whitespace-pre-line">
                  {text}
                </div>
              )}

              {/* 2. IMAGE */}
              {type === 'image' && (
                <div className="flex flex-col rounded-lg overflow-hidden max-w-[260px] bg-[#00000005]">
                  <img 
                    src={mediaUrl || "https://picsum.photos/300/200"} 
                    alt="attachment" 
                    className="w-full max-h-[220px] object-cover rounded-md"
                  />
                  {caption && (
                    <p className="text-[14px] px-1 pt-1.5 pb-0.5 text-left font-normal pr-10">{caption}</p>
                  )}
                </div>
              )}

              {/* 3. DOCUMENT */}
              {type === 'document' && (
                <div className="flex items-center gap-3 bg-[#00000009] p-2.5 rounded-lg border border-[#00000008] min-w-[220px] max-w-[260px]">
                  <div className="w-10 h-10 bg-[#ea0038] text-white flex items-center justify-center rounded-lg font-bold text-xs select-none">
                    {fileExtension || 'PDF'}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-[13.5px] font-semibold text-wa-text-primary truncate">{fileName || 'dokumen.pdf'}</div>
                    <div className="text-[11px] text-wa-text-secondary">{fileSize || '1.0 MB'} • {fileExtension || 'PDF'}</div>
                  </div>
                  <button className="text-wa-text-secondary hover:text-wa-text-primary p-1 focus:outline-none">
                    <Download size={18} />
                  </button>
                </div>
              )}

              {/* 4. LOCATION */}
              {type === 'location' && (
                <div className="flex flex-col rounded-lg overflow-hidden max-w-[240px] bg-[#00000005]">
                  {/* Google maps thumbnail simulation */}
                  <div className="h-[120px] w-full bg-[#cbd5e1] relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-6.2244,106.8096&zoom=14&size=240x120&key=dummy')] bg-cover bg-center bg-no-repeat opacity-80"></div>
                    {/* Simulated Map lines if static api fails */}
                    <div className="absolute inset-0 flex flex-col justify-around opacity-30 pointer-events-none">
                      <div className="h-[1px] bg-slate-800 w-full"></div>
                      <div className="h-[1px] bg-slate-800 w-full"></div>
                      <div className="h-[1px] bg-slate-800 w-full"></div>
                    </div>
                    <div className="absolute inset-0 flex justify-around opacity-30 pointer-events-none">
                      <div className="w-[1px] bg-slate-800 h-full"></div>
                      <div className="w-[1px] bg-slate-800 h-full"></div>
                    </div>
                    {/* Map Pin */}
                    <div className="absolute text-red-500 animate-bounce">
                      <MapPin size={32} fill="currentColor" className="text-red-600 fill-red-100" />
                    </div>
                  </div>
                  <div className="p-2 bg-white text-left text-xs border-t border-[#0000000b]">
                    <div className="font-semibold text-[13px] text-wa-text-primary truncate">Bagikan Lokasi Terkini</div>
                    <div className="text-[11px] text-wa-text-secondary line-clamp-2 mt-0.5">{address || 'Senayan, Jakarta Selatan'}</div>
                  </div>
                </div>
              )}

              {/* 5. STICKER */}
              {type === 'sticker' && (
                <div className="w-[110px] h-[110px] overflow-hidden select-none hover:scale-105 active:scale-95 transition-all">
                  <img 
                    src={mediaUrl || "https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/512.webp"} 
                    alt="sticker" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* 6. AUDIO (Voice Note) */}
              {type === 'audio' && (
                <div className="flex items-center gap-2.5 min-w-[240px] max-w-[270px] py-0.5">
                  {/* Play Button */}
                  <button 
                    onClick={toggleAudio}
                    className="w-9 h-9 rounded-full bg-[#128c7e] text-white flex items-center justify-center shrink-0 active:scale-90 hover:opacity-95 focus:outline-none transition-transform"
                  >
                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                  </button>

                  {/* Playback Progress Slider & Audio wave lines */}
                  <div className="flex-1 flex flex-col gap-1 text-left select-none">
                    <div className="flex items-end gap-[2px] h-[16px] overflow-hidden pr-2">
                      {[12, 16, 20, 8, 14, 18, 22, 10, 6, 12, 16, 20, 8, 14, 18, 22, 10, 6, 12, 14, 8, 10, 16, 22, 12, 6].map((h, i) => {
                        const active = isPlaying && ((i / 26) * 100) <= audioProgress;
                        return (
                          <div 
                            key={i} 
                            style={{ height: `${h}px` }} 
                            className={`w-[2px] rounded-full transition-all duration-100 ${
                              active ? 'bg-[#128c7e]' : 'bg-[#a6b1b7]'
                            }`}
                          ></div>
                        );
                      })}
                    </div>
                    {/* Time display */}
                    <div className="text-[11px] text-wa-text-secondary">
                      {isPlaying ? elapsedTime : duration || '0:05'}
                    </div>
                  </div>

                  {/* Contact profile photo as user indicator */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img 
                      src={isSent 
                        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      } 
                      className="w-full h-full object-cover" 
                      alt="avatar" 
                    />
                    {/* Mini green mic badge */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-wa-green-light border border-white flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="8" height="8" stroke="white" strokeWidth="3" fill="none">
                        <path d="M12 1v14M19 8a7 7 0 0 1-14 0" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Time and Status Indicator */}
          {type !== 'sticker' && (
            <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[9.5px] text-wa-text-secondary select-none">
              <span>{timestamp || "12:04"}</span>
              {renderCheckmarks()}
            </div>
          )}

          {/* Timestamp overlay specifically for stickers (sticker is transparent, no standard bottom bar) */}
          {type === 'sticker' && (
            <div className="absolute bottom-0 right-[-36px] bg-[#00000040] text-white text-[9px] px-1 rounded flex items-center gap-0.5 select-none">
              <span>{timestamp || "12:04"}</span>
              {renderCheckmarks()}
            </div>
          )}

          {/* Reaction Emojis Badges */}
          {reactions && reactions.length > 0 && (
            <div className="absolute bottom-[-11px] right-2 bg-[#202c33] border border-[#2f3c44] rounded-full px-1 py-0.5 flex gap-0.5 items-center max-h-[18px] wa-reaction-shadow z-20">
              {reactions.map((react, i) => (
                <span key={i} className="text-[11px]">{react}</span>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
