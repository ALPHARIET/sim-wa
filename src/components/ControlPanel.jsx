import React from 'react';
import { Settings, Volume2, VolumeX, X } from 'lucide-react';

export default function ControlPanel({
  engineMode,
  setEngineMode,
  geminiApiKey,
  setGeminiApiKey,
  geminiModel,
  setGeminiModel,
  isMuted,
  setIsMuted,
  onClose
}) {
  return (
    <div className="w-full md:w-[350px] shrink-0 bg-[#1f2c33] border-t md:border-t-0 md:border-l border-[#2d3a42] text-[#e9edef] p-4 flex flex-col gap-4 overflow-y-auto select-none max-h-screen md:h-screen wa-scrollbar">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2d3a42]">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-wa-green-light" />
          <h1 className="text-base font-bold tracking-wide">Pengaturan Global</h1>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded-md hover:bg-[#2a3942] transition-colors focus:outline-none ${isMuted ? 'text-red-400' : 'text-wa-green-light'}`}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-md text-[#8696a0] hover:text-white hover:bg-[#2a3942] transition-colors focus:outline-none cursor-pointer"
              title="Sembunyikan Pengaturan"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-[#8696a0] mb-2">
        Pengaturan di bawah ini berlaku untuk ketiga layar simulasi (Petani, Logistik, Distributor).
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
                <option value="gemini-flash-latest">Gemini Flash (Rekomendasi / Gratis)</option>
                <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
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

    </div>
  );
}
