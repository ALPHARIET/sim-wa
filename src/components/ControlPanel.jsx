import React, { useState } from 'react';
import { Settings, Play, RefreshCw, Volume2, VolumeX, UserPlus, FileText, MapPin, Image as ImageIcon, Smile, MessageSquareQuote } from 'lucide-react';

export default function ControlPanel({
  contactName,
  setContactName,
  contactStatus,
  setContactStatus,
  profilePic,
  setProfilePic,
  onTriggerNextStory,
  onTriggerCustomReply,
  onResetChat,
  isMuted,
  setIsMuted,
  storySteps,
  currentStoryIndex,
  lastExtractedJson,
  engineMode,
  setEngineMode,
  geminiApiKey,
  setGeminiApiKey,
  geminiModel,
  setGeminiModel
}) {
  const [customReplyText, setCustomReplyText] = useState('');
  const [showConfig, setShowConfig] = useState(true);

  const avatars = [
    { name: "Wanita 1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { name: "Pria 1", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
    { name: "Wanita 2", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
    { name: "Pria 2", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
    { name: "Logo Bisnis", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" }
  ];

  const handleCustomSend = (e) => {
    e.preventDefault();
    if (!customReplyText.trim()) return;
    onTriggerCustomReply(customReplyText);
    setCustomReplyText('');
  };

  return (
    <div className="w-full md:w-[350px] shrink-0 bg-[#1f2c33] border-t md:border-t-0 md:border-l border-[#2d3a42] text-[#e9edef] p-4 flex flex-col gap-4 overflow-y-auto select-none max-h-screen md:h-screen wa-scrollbar">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2d3a42]">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-wa-green-light" />
          <h1 className="text-base font-bold tracking-wide">Simulation Controller</h1>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-1.5 rounded-md hover:bg-[#2a3942] transition-colors focus:outline-none ${isMuted ? 'text-red-400' : 'text-wa-green-light'}`}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* AI Chatbot Engine Configuration */}
      <div className="flex flex-col gap-2 bg-[#111b21] p-3 rounded-lg border border-[#2d3a42]">
        <label className="text-xs font-semibold text-wa-green-light uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-wa-green-light animate-pulse"></span>
          <span>Mesin AI Chatbot</span>
        </label>
        
        {/* Toggle Mode */}
        <div className="flex gap-1 mt-1 bg-[#1f2c33] p-0.5 rounded border border-[#2d3a42]">
          <button
            type="button"
            onClick={() => setEngineMode('local')}
            className={`flex-1 py-1.5 rounded text-[10px] font-semibold transition-all duration-100 focus:outline-none cursor-pointer ${
              engineMode === 'local'
                ? 'bg-wa-green text-white shadow'
                : 'text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            Simulasi Lokal
          </button>
          <button
            type="button"
            onClick={() => setEngineMode('gemini')}
            className={`flex-1 py-1.5 rounded text-[10px] font-semibold transition-all duration-100 focus:outline-none cursor-pointer ${
              engineMode === 'gemini'
                ? 'bg-wa-green text-white shadow'
                : 'text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            Gemini Live AI
          </button>
        </div>

        {engineMode === 'gemini' && (
          <div className="flex flex-col gap-2.5 mt-2 pt-2 border-t border-[#2a3942] animate-bubble">
            {/* Model Selector */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#8696a0]">Pilih Model</span>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full bg-[#111b21] border border-[#2d3a42] rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-wa-green-light cursor-pointer"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Rekomendasi)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>

            {/* API Key Input */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#8696a0]">Gemini API Key</span>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Masukkan Gemini API Key..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full bg-[#111b21] border border-[#2d3a42] rounded pl-2.5 pr-10 py-1.5 text-xs text-white outline-none focus:border-wa-green-light font-mono"
                />
                {geminiApiKey && (
                  <button
                    type="button"
                    onClick={() => setGeminiApiKey('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 text-[10px] font-bold focus:outline-none cursor-pointer"
                    title="Hapus Key"
                  >
                    Clear
                  </button>
                )}
              </div>
              <span className="text-[9.5px] text-[#8696a0] leading-normal mt-0.5">
                Dapatkan API key gratis dari <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-wa-green-light hover:underline font-semibold">Google AI Studio</a>.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 1. Contact Settings */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider">Pengaturan Kontak</label>
        
        {/* Name input */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-[#8696a0]">Nama Kontak</span>
          <input 
            type="text" 
            value={contactName} 
            onChange={(e) => setContactName(e.target.value)}
            className="w-full bg-[#111b21] border border-[#2d3a42] rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-wa-green-light"
          />
        </div>

        {/* Status indicator toggle */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[11px] text-[#8696a0]">Ubah Status</span>
          <div className="grid grid-cols-3 gap-1">
            {['Online', 'Ketik pesan...', 'Sedang merekam...'].map((status) => (
              <button
                key={status}
                onClick={() => setContactStatus(status)}
                className={`px-1 py-1.5 rounded text-[10px] font-semibold border transition-all duration-100 focus:outline-none ${
                  contactStatus === status 
                    ? 'bg-wa-green border-wa-green-light text-white' 
                    : 'bg-[#111b21] border-[#2d3a42] text-[#8696a0] hover:bg-[#2a3942]'
                }`}
              >
                {status === 'Online' ? 'Online' : status === 'Ketik pesan...' ? 'Typing' : 'VN Recording'}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setContactStatus('Last seen today at ' + new Date().getHours() + ':' + new Date().getMinutes().toString().padStart(2, '0'))}
            className={`w-full mt-1 py-1 rounded text-[10px] font-semibold border transition-all focus:outline-none ${
              contactStatus.startsWith('Last seen') 
                ? 'bg-wa-green border-wa-green-light text-white' 
                : 'bg-[#111b21] border-[#2d3a42] text-[#8696a0] hover:bg-[#2a3942]'
            }`}
          >
            Set Offline (Last Seen)
          </button>
        </div>

        {/* Avatar customizer presets */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[11px] text-[#8696a0]">Preset Foto Profil</span>
          <div className="flex gap-1.5 overflow-x-auto py-1 wa-scrollbar">
            {avatars.map((av, idx) => (
              <button
                key={idx}
                onClick={() => setProfilePic(av.url)}
                className={`w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 focus:outline-none transition-all ${
                  profilePic === av.url ? 'border-wa-green-light scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                title={av.name}
              >
                <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Dialog Scripts Actions */}
      <div className="flex flex-col gap-2 border-t border-[#2d3a42] pt-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider">Preset Laporan Panen</label>
          <span className="text-[10px] bg-wa-green text-white px-1.5 py-0.5 rounded font-mono">
            Langkah {currentStoryIndex + 1}/{storySteps.length}
          </span>
        </div>

        <button
          onClick={onTriggerNextStory}
          className="w-full bg-wa-green hover:bg-[#009688] text-white rounded py-2 text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
        >
          <Play size={13} fill="currentColor" />
          <span>Kirim Preset Panen Berikutnya</span>
        </button>

        {/* Script step previews */}
        <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto bg-[#111b21] p-2 rounded border border-[#2d3a42] text-[11px] text-[#8696a0] wa-scrollbar">
          {storySteps.map((step, idx) => {
            const isDone = idx < currentStoryIndex;
            const isActive = idx === currentStoryIndex;
            
            return (
              <div 
                key={idx} 
                className={`flex justify-between items-center px-1.5 py-1 rounded transition-colors ${
                  isActive 
                    ? 'bg-[#00806930] text-wa-green-light font-semibold' 
                    : isDone 
                      ? 'text-[#4f5d64] line-through' 
                      : 'text-[#8696a0]'
                }`}
              >
                <span className="truncate flex-1 pr-1" title={step.text}>{idx + 1}. {step.title}</span>
                {isActive && <span className="text-[9px] animate-pulse">BERIKUTNYA</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time PanganDali Database Log (Gemma 3 Extraction Output) */}
      <div className="flex flex-col gap-2 border-t border-[#2d3a42] pt-3">
        <label className="text-xs font-semibold text-wa-green-light uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-wa-green-light animate-pulse"></span>
          <span>Database PanganDali (Gemma 3 Log)</span>
        </label>
        <p className="text-[10px] text-[#8696a0] leading-relaxed">
          Data terstruktur hasil ekstraksi Gemma 3 yang masuk ke database sistem PanganDali secara otomatis:
        </p>
        <div className="w-full bg-[#111b21] border border-[#2d3a42] rounded-lg p-2.5 overflow-hidden">
          {lastExtractedJson ? (
            <pre className="text-[10.5px] font-mono text-[#34b7f1] overflow-x-auto max-h-[160px] text-left leading-[1.35] select-text wa-scrollbar">
              <code>{JSON.stringify(lastExtractedJson, null, 2)}</code>
            </pre>
          ) : (
            <div className="text-center py-6 text-xs text-[#8696a0] italic select-none">
              Menunggu laporan panen masuk...
            </div>
          )}
        </div>
      </div>

      {/* 3. Inject custom reply as Contact */}
      <div className="flex flex-col gap-2 border-t border-[#2d3a42] pt-3">
        <label className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider">Kirim Kustom Balasan (Kontak)</label>
        <form onSubmit={handleCustomSend} className="flex gap-1.5">
          <input 
            type="text" 
            placeholder="Ketik balasan kontak..." 
            value={customReplyText}
            onChange={(e) => setCustomReplyText(e.target.value)}
            className="flex-1 bg-[#111b21] border border-[#2d3a42] rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-wa-green-light"
          />
          <button 
            type="submit" 
            className="bg-wa-green hover:bg-[#009688] text-white px-3 py-1.5 rounded text-xs font-bold transition-all focus:outline-none cursor-pointer shrink-0"
          >
            Kirim
          </button>
        </form>
      </div>

      {/* 4. Help and Keywords list */}
      <div className="flex-1 flex flex-col gap-2 border-t border-[#2d3a42] pt-3 text-xs text-[#8696a0]">
        <label className="text-xs font-semibold text-[#8696a0] uppercase tracking-wider">Deteksi Informasi Gemma 3</label>
        <p className="text-[10px] leading-relaxed">
          Kirim laporan panen melalui input chat HP. Model Gemma 3 PanganDali AI akan mengekstrak:
        </p>
        <div className="flex flex-col gap-1.5 text-[10.5px]">
          <div className="bg-[#111b21] p-1.5 rounded border border-[#2d3a42] flex flex-col gap-0.5">
            <span className="text-white font-bold">🌾 Komoditas (Normalisasi)</span>
            <span className="text-[9.5px]">Cabe / lombok &rarr; <span className="text-wa-green-light">Cabai</span>, Gabah / beras &rarr; <span className="text-wa-green-light">Padi</span></span>
          </div>
          <div className="bg-[#111b21] p-1.5 rounded border border-[#2d3a42] flex flex-col gap-0.5">
            <span className="text-white font-bold">⚖️ Jumlah & Satuan</span>
            <span className="text-[9.5px]">Desimal Indonesia <span className="text-wa-green-light">2,5 &rarr; 2.5</span>. Unit <span className="text-wa-green-light">kilo / kg &rarr; kg</span></span>
          </div>
          <div className="bg-[#111b21] p-1.5 rounded border border-[#2d3a42] flex flex-col gap-0.5">
            <span className="text-white font-bold">📅 Tanggal Panen</span>
            <span className="text-[9.5px]">"hari ini" &rarr; <span className="text-wa-green-light">2026-07-09</span>, "kemarin" &rarr; <span className="text-wa-green-light">2026-07-08</span></span>
          </div>
          <div className="bg-[#111b21] p-1.5 rounded border border-[#2d3a42] flex flex-col gap-0.5">
            <span className="text-white font-bold">📍 Lokasi & Wilayah</span>
            <span className="text-[9.5px]">Desa, Kecamatan, Kabupaten, Provinsi (dengan confidence score)</span>
          </div>
        </div>
      </div>

      {/* 5. Clean Action */}
      <button 
        onClick={onResetChat}
        className="w-full bg-[#3b4a54] hover:bg-red-950 hover:text-red-200 border border-[#4f5d64] text-white rounded py-2 text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer mt-auto shrink-0"
      >
        <RefreshCw size={12} />
        <span>Ulangi Semua Skenario</span>
      </button>

    </div>
  );
}
