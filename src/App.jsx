import React, { useState, useRef } from 'react';
import SimulationWindow from './components/SimulationWindow';
import ControlPanel from './components/ControlPanel';
import { Sliders } from 'lucide-react';

export default function App() {
  // Global Configurations
  const [engineMode, setEngineMode] = useState(() => localStorage.getItem('sim_wa_engine_mode') || 'local');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('sim_wa_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [geminiModel, setGeminiModel] = useState(() => {
    const saved = localStorage.getItem('sim_wa_gemini_model');
    return (saved && saved !== 'gemini-2.5-flash' && saved !== 'gemini-2.0-flash') ? saved : 'gemini-flash-latest';
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);

  // Global Stock Database Simulation
  const [globalStock, setGlobalStock] = useState([]);

  const handleSetEngineMode = (mode) => {
    setEngineMode(mode);
    localStorage.setItem('sim_wa_engine_mode', mode);
  };

  const handleSetGeminiApiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('sim_wa_gemini_api_key', key);
  };

  const handleSetGeminiModel = (model) => {
    setGeminiModel(model);
    localStorage.setItem('sim_wa_gemini_model', model);
  };

  // Refs for cross-communication
  const farmerRef = useRef();
  const transporterRef = useRef();
  const distributorRef = useRef();

  // Cross-simulation communication logic
  const handleSimulationEvent = (sourceType, eventType, data) => {
    if (eventType === 'extracted') {
      const intent = data.intent;
      const extractedData = data.data;

      // Update Stock Database if farmer reports harvest
      if (intent === 'laporan_panen' || intent === 'update_panen') {
        const komoditas = extractedData.komoditas?.value;
        const jumlah = extractedData.jumlah?.value;
        const satuan = extractedData.satuan?.value || 'kg';
        const desa = extractedData.desa?.value || 'Tidak diketahui';

        if (komoditas && jumlah) {
          setGlobalStock(prev => {
            // Very simple mock DB update logic
            const newStock = [...prev];
            const existingIdx = newStock.findIndex(s => s.komoditas === komoditas && s.desa === desa);
            if (existingIdx >= 0) {
              newStock[existingIdx].jumlah += Number(jumlah);
            } else {
              newStock.push({
                id: Date.now(),
                petani: 'Pak Budi',
                komoditas,
                jumlah: Number(jumlah),
                satuan,
                desa,
                status: 'Tervalidasi'
              });
            }
            return newStock;
          });
        }
      }

      // Farmer/Distributor confirms transaction or needs transport
      if (intent === 'butuh_angkutan' || intent === 'transaksi_disetujui') {
        // Send a job offer to Transporter
        const komoditas = extractedData.komoditas?.value || "Komoditas";
        const jumlah = extractedData.jumlah?.value || "Sejumlah";
        const satuan = extractedData.satuan?.value || "";
        const asal = extractedData.desa?.value || "Desa";

        const notificationText = `🚨 SISTEM: Terdapat permintaan penjemputan baru!\n\n📦 Komoditas: ${komoditas}\n⚖️ Jumlah: ${jumlah} ${satuan}\n📍 Asal: ${asal}\n📍 Tujuan: Pasar Panorama, Kota Bengkulu\n\nBalas AMBIL untuk menerima pesanan ini.`;

        // Inject message into Transporter window (from system/other)
        if (transporterRef.current) {
          transporterRef.current.injectMessage(notificationText, 'other');
        }
      }
    }
  };

  return (
    <div className="flex w-screen h-screen bg-[#0c1317] overflow-hidden">

      {/* Container for the 3 phones, allowing horizontal scrolling on smaller screens */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-start lg:justify-center gap-4 lg:gap-8 p-4 overflow-x-auto wa-scrollbar">

        {/* Phone 1: Farmer */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-wa-green-light font-bold mb-2 uppercase tracking-wider text-sm bg-[#111b21] px-4 py-1 rounded-full border border-[#2d3a42]">Petani</span>
          <SimulationWindow
            ref={farmerRef}
            simulationType="farmer"
            engineMode={engineMode}
            geminiApiKey={geminiApiKey}
            geminiModel={geminiModel}
            isMuted={isMuted}
            onEvent={handleSimulationEvent}
            globalStock={globalStock}
          />
        </div>

        {/* Phone 2: Logistics */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-blue-400 font-bold mb-2 uppercase tracking-wider text-sm bg-[#111b21] px-4 py-1 rounded-full border border-[#2d3a42]">Mitra Logistik</span>
          <SimulationWindow
            ref={transporterRef}
            simulationType="transporter"
            engineMode={engineMode}
            geminiApiKey={geminiApiKey}
            geminiModel={geminiModel}
            isMuted={isMuted}
            onEvent={handleSimulationEvent}
            globalStock={globalStock}
          />
        </div>

        {/* Phone 3: Distributor */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-yellow-500 font-bold mb-2 uppercase tracking-wider text-sm bg-[#111b21] px-4 py-1 rounded-full border border-[#2d3a42]">Distributor</span>
          <SimulationWindow
            ref={distributorRef}
            simulationType="distributor"
            engineMode={engineMode}
            geminiApiKey={geminiApiKey}
            geminiModel={geminiModel}
            isMuted={isMuted}
            onEvent={handleSimulationEvent}
            globalStock={globalStock}
          />
        </div>

      </div>

      {/* Global Settings Panel */}
      {isControlPanelOpen && (
        <ControlPanel
          engineMode={engineMode}
          setEngineMode={handleSetEngineMode}
          geminiApiKey={geminiApiKey}
          setGeminiApiKey={handleSetGeminiApiKey}
          geminiModel={geminiModel}
          setGeminiModel={handleSetGeminiModel}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onClose={() => setIsControlPanelOpen(false)}
        />
      )}

      {/* Floating Toggle Button */}
      {!isControlPanelOpen && (
        <button
          onClick={() => setIsControlPanelOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-[#1f2c33] hover:bg-[#2a3942] text-wa-green-light border border-[#2d3a42] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer animate-bubble"
          title="Tampilkan Pengaturan Global"
        >
          <Sliders size={16} />
          <span>Pengaturan</span>
        </button>
      )}
    </div>
  );
}
