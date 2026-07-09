import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Camera, Mic, Send, Trash2, X } from 'lucide-react';

export default function MessageInput({ 
  onSendMessage, 
  onSendVoiceNote,
  onToggleAttachment, 
  isAttachmentOpen,
  onUserTypingStateChange 
}) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const timerRef = useRef(null);

  // Trigger typing notification when user is typing
  useEffect(() => {
    if (text.length > 0) {
      onUserTypingStateChange(true);
    } else {
      onUserTypingStateChange(false);
    }
  }, [text]);

  // Voice recording timer logic
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (text.trim() === '') return;
    onSendMessage(text);
    setText('');
    setShowEmojiPicker(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    setShowEmojiPicker(false);
  };

  const cancelRecording = () => {
    setIsRecording(false);
  };

  const stopAndSendRecording = () => {
    setIsRecording(false);
    // Convert duration to HH:MM format
    const secs = recordDuration % 60;
    const mins = Math.floor(recordDuration / 60);
    const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    onSendVoiceNote(durationStr === '0:00' ? '0:03' : durationStr);
  };

  const formatDuration = (sec) => {
    const s = sec % 60;
    const m = Math.floor(sec / 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const addEmoji = (emoji) => {
    setText(prev => prev + emoji);
  };

  const emojis = ['😊', '😂', '😍', '👍', '🙏', '🔥', '😢', '🎉', '😡', '😱', '🤔', '❤️', '👏', '🙌', '✨', '✔️'];

  return (
    <div className="w-full bg-transparent px-2 pb-2.5 pt-1.5 shrink-0 z-30 select-none relative">
      
      {/* Mini Emoji Picker Drawer */}
      {showEmojiPicker && !isRecording && (
        <>
          <div className="fixed inset-0 z-10 bg-transparent" onClick={() => setShowEmojiPicker(false)}></div>
          <div className="absolute bottom-[66px] left-2 right-2 bg-[#233138] border border-[#2d3a42] rounded-2xl p-3 z-20 animate-bubble shadow-lg">
            <div className="text-xs text-[#8696a0] mb-2 font-medium">Emoji Cepat</div>
            <div className="grid grid-cols-8 gap-2.5 justify-items-center">
              {emojis.map((emoji, index) => (
                <button 
                  key={index} 
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl hover:scale-125 transition-transform duration-100 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Conditional UI based on Recording Mode */}
      {isRecording ? (
        <div className="w-full flex items-center justify-between gap-2">
          {/* Recording Status Bar */}
          <div className="flex-1 h-12 bg-[#202c33] rounded-full px-4 flex items-center justify-between text-[#8696a0] wa-input-shadow">
            <div className="flex items-center gap-3">
              {/* Flashing red record icon */}
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[14.5px] font-semibold text-white">{formatDuration(recordDuration)}</span>
              <span className="text-[13px] animate-pulse">Merekam audio...</span>
            </div>
            
            {/* Cancel Button */}
            <button 
              onClick={cancelRecording}
              className="text-[#ea0038] hover:text-red-400 font-semibold text-[14px] flex items-center gap-1 focus:outline-none pr-1"
            >
              <Trash2 size={16} />
              <span>Batal</span>
            </button>
          </div>

          {/* Send voice note button */}
          <button
            onClick={stopAndSendRecording}
            className="w-12 h-12 rounded-full bg-wa-green flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform duration-100 focus:outline-none wa-input-shadow shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSend} className="w-full flex items-end gap-1.5">
          {/* Left Text Input Bubble */}
          <div className="flex-1 min-h-[48px] bg-[#202c33] rounded-[24px] px-3 py-1 flex items-center text-white border border-transparent focus-within:border-[#2a3942] wa-input-shadow relative">
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 text-[#8696a0] hover:text-white transition-colors focus:outline-none shrink-0"
            >
              <Smile size={22} />
            </button>

            {/* Input field (textarea that grows slightly) */}
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 bg-transparent border-none outline-none px-2 py-2 text-[15px] placeholder-[#8696a0] text-white resize-none min-w-0"
            />

            {/* Attachment Button */}
            <button
              type="button"
              onClick={onToggleAttachment}
              className={`p-1.5 hover:text-white transition-colors focus:outline-none shrink-0 ${
                isAttachmentOpen ? 'text-wa-green-light' : 'text-[#8696a0]'
              }`}
            >
              <Paperclip size={20} className={isAttachmentOpen ? 'rotate-[135deg] transition-transform duration-200' : 'transition-transform duration-200'} />
            </button>

            {/* Camera Button (Only visible if input is empty) */}
            {text.length === 0 && (
              <button
                type="button"
                className="p-1 text-[#8696a0] hover:text-white transition-colors focus:outline-none shrink-0"
              >
                <Camera size={20} />
              </button>
            )}
          </div>

          {/* Right Action Button (Mic or Send) */}
          {text.length > 0 ? (
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-wa-green flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform duration-100 focus:outline-none wa-input-shadow shrink-0"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="w-12 h-12 rounded-full bg-wa-green flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform duration-100 focus:outline-none wa-input-shadow shrink-0"
              title="Tahan untuk merekam"
            >
              <Mic size={20} />
            </button>
          )}
        </form>
      )}
      
    </div>
  );
}
