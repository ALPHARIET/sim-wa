import React, { useState, useEffect } from 'react';
import PhoneFrame from './components/PhoneFrame';
import ChatHeader from './components/ChatHeader';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import AttachmentTray from './components/AttachmentTray';
import ControlPanel from './components/ControlPanel';
import { extractFarmerInfo, farmerPresets } from './data/defaultScript';
import { 
  X, CornerUpLeft, Trash2, Copy, Info, Share, 
  User, Check, CheckCheck, Phone, Video, Mic, Volume2, Camera, ShieldAlert, Sliders
} from 'lucide-react';

import { transporterMessages, transporterConfig, farmerMessages, farmerConfig, distributorMessages, distributorConfig } from './data/dummyDialogues';
export default function App() {
  // Simulator configurations and data states
  const [messages, setMessages] = useState(transporterMessages);
  const [contactName, setContactName] = useState(transporterConfig.contactName);
  const [contactStatus, setContactStatus] = useState(transporterConfig.contactStatus);
  const [profilePic, setProfilePic] = useState(transporterConfig.profilePic);

  // Live AI Chatbot configurations
  const [engineMode, setEngineMode] = useState(() => {
    return localStorage.getItem('sim_wa_engine_mode') || 'local';
  });
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('sim_wa_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [geminiModel, setGeminiModel] = useState(() => {
    const saved = localStorage.getItem('sim_wa_gemini_model');
    return (saved && saved !== 'gemini-2.5-flash' && saved !== 'gemini-2.0-flash') ? saved : 'gemini-flash-latest';
  });

  const handleSetEngineMode = (mode) => {
    setEngineMode(mode);
    localStorage.setItem('sim_wa_engine_mode', mode);
    if (mode === 'gemini') {
      setContactStatus(`Online (${geminiModel === 'gemini-flash-latest' ? 'Gemini Flash' : geminiModel})`);
    } else {
      setContactStatus("Online (Simulasi NER)");
    }
  };

  const handleSetGeminiApiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('sim_wa_gemini_api_key', key);
  };

  const handleSetGeminiModel = (model) => {
    setGeminiModel(model);
    localStorage.setItem('sim_wa_gemini_model', model);
    if (engineMode === 'gemini') {
      setContactStatus(`Online (${model === 'gemini-flash-latest' ? 'Gemini Flash' : model})`);
    }
  };

  const loadSimulation = (type) => {
    if (type === 'transporter') {
      setMessages(transporterMessages);
      setContactName(transporterConfig.contactName);
      setContactStatus(transporterConfig.contactStatus);
      setProfilePic(transporterConfig.profilePic);
    } else if (type === 'farmer') {
      setMessages(farmerMessages);
      setContactName(farmerConfig.contactName);
      setContactStatus(farmerConfig.contactStatus);
      setProfilePic(farmerConfig.profilePic);
    } else if (type === 'distributor') {
      setMessages(distributorMessages);
      setContactName(distributorConfig.contactName);
      setContactStatus(distributorConfig.contactStatus);
      setProfilePic(distributorConfig.profilePic);
    }
    setCurrentStoryIndex(0);
  };
  
  // Interactive UI states
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [replyingMessage, setReplyingMessage] = useState(null);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [scrollToMessageId, setScrollToMessageId] = useState(null);
  
  // Modals & Overlays
  const [showAvatarZoom, setShowAvatarZoom] = useState(false);
  const [lastExtractedJson, setLastExtractedJson] = useState(null);
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [callType, setCallType] = useState('voice'); // 'voice' or 'video'
  const [callTimer, setCallTimer] = useState(0);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Call timer interval
  useEffect(() => {
    let interval = null;
    if (showCallOverlay) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [showCallOverlay]);

  // Show floating Toast notifications
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2000);
  };

  // Synthesize WhatsApp Android chime tones using Web Audio API
  const playSound = (soundType) => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (soundType === 'sent') {
        // High-pitched send chirp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
      } else if (soundType === 'received') {
        // Double tone WhatsApp chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.type = 'triangle';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08); // G5
        
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.25);
        
        osc2.start(ctx.currentTime + 0.08);
        osc2.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("Audio Context blocked by browser permission.", e);
    }
  };

  // Helper to format call time counter
  const formatCallTime = (secs) => {
    const s = secs % 60;
    const m = Math.floor(secs / 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper to fallback to standard local rule-based simulation
  const runLocalSimulationFallback = (userMessageText) => {
    const { csReply, extractionResult } = extractFarmerInfo(userMessageText);
    setLastExtractedJson(extractionResult);

    setTimeout(() => {
      setContactStatus("Online");
    }, 500);

    setTimeout(() => {
      setContactStatus("Ketik pesan...");
    }, 1000);

    setTimeout(() => {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newReplyCS = {
        id: Date.now() + 1,
        text: csReply,
        type: "text",
        timestamp,
        sender: "other",
        reactions: []
      };

      setMessages(prev => [...prev, newReplyCS]);
      setContactStatus("Online (Simulasi NER)");
      playSound('received');
    }, 2200);
  };

  // State flow logic for incoming auto-replies (PanganDali Live Gemini / Local Extractor)
  const triggerAutoReply = async (userMessageText) => {
    if (engineMode === 'gemini') {
      if (!geminiApiKey.trim()) {
        triggerToast("Masukkan Gemini API Key terlebih dahulu di panel konfigurasi!");
        runLocalSimulationFallback(userMessageText);
        return;
      }

      // Step A: Contact changes to "Online" after 200ms
      setTimeout(() => {
        setContactStatus("Online");
      }, 200);

      // Step B: Contact changes to "Ketik pesan..." (Typing...) after 500ms
      setTimeout(() => {
        setContactStatus("Ketik pesan...");
      }, 500);

      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Format recent messages for context
        const recentMessages = messages.slice(-10).map(m => {
          const senderName = m.sender === 'me' ? 'Petani/User' : 'CS Agent (PanganDali)';
          return `${senderName}: ${m.text || `[Media: ${m.type}]`}`;
        }).join('\n');

        const promptText = `Hari ini tanggal: ${todayStr}, Kemarin tanggal: ${yesterdayStr}.
Riwayat chat terbaru:
${recentMessages}

Pesan terbaru dari Petani/User: "${userMessageText}"

Tolong berikan respons yang ramah, alami, dan tidak kaku dalam properti 'csReply' (sebagai agen CS PanganDali dalam Bahasa Indonesia) dan hasil ekstraksi data panen di 'extractionResult' sesuai format skema JSON.`;

        const responseSchema = {
          type: "OBJECT",
          properties: {
            csReply: {
              type: "STRING",
              description: "Jawaban CS yang ramah, alami, bervariasi, dan membantu dalam Bahasa Indonesia, merespons pesan terbaru petani tanpa menggunakan pola template yang kaku."
            },
            extractionResult: {
              type: "OBJECT",
              description: "Hasil analisis intent dan ekstraksi entitas laporan panen.",
              properties: {
                intent: {
                  type: "STRING",
                  enum: ["laporan_panen", "pembatalan", "update_panen", "tanya_harga", "tanya_transporter", "tanya_status", "percakapan_umum", "lainnya"],
                  description: "Kategori maksud pesan terbaru."
                },
                data: {
                  type: "OBJECT",
                  description: "Data terstruktur yang berhasil diekstrak (gunakan null jika field tidak ada).",
                  properties: {
                    nama_petani: {
                      type: "OBJECT",
                      properties: {
                        value: { type: "STRING" },
                        confidence: { type: "NUMBER" }
                      }
                    },
                    nomor_hp: {
                      type: "OBJECT",
                      properties: {
                        value: { type: "STRING" },
                        confidence: { type: "NUMBER" }
                      }
                    },
                    komoditas: {
                      type: "OBJECT",
                      properties: {
                        value: { type: "STRING", description: "Nama komoditas yang dinormalisasi (misal Cabai Besar, Kubis, Terung, Wortel, Kembang Kol, Tomat)." },
                        confidence: { type: "NUMBER" }
                      }
                    },
                    jumlah: {
                      type: "OBJECT",
                      properties: {
                        value: { type: "NUMBER", description: "Jumlah numerik saja (misal 2.5 atau 800)" },
                        confidence: { type: "NUMBER" }
                      }
                    },
                    satuan: {
                      type: "OBJECT",
                      properties: {
                        value: { type: "STRING", description: "Satuan yang dinormalisasi (misal ton, kg, kwintal, karung, ikat, pikul)." },
                        confidence: { type: "NUMBER" }
                      }
                    },
                    desa: {
                      type: "OBJECT",
                      properties: {
                        value: { type: "STRING", description: "Nama Desa" },
                        confidence: { type: "NUMBER" }
                      }
                    },
                    tanggal_panen: {
                      type: "OBJECT",
                      properties: {
                        value: { type: "STRING", description: "Format YYYY-MM-DD" },
                        confidence: { type: "NUMBER" }
                      }
                    },
                    kualitas: {
                      type: "OBJECT",
                      properties: {
                        value: { type: "STRING", description: "Kualitas/grade (misal super, A, dll)" },
                        confidence: { type: "NUMBER" }
                      }
                    }
                  }
                }
              },
              required: ["intent", "data"]
            }
          },
          required: ["csReply", "extractionResult"]
        };

        const systemInstruction = `Anda adalah PanganDali AI Agent (Live Chatbot). Tugas Anda adalah mendeteksi data panen petani untuk dimasukkan ke database secara terstruktur, dan memberikan respons WhatsApp yang sangat ramah, bervariasi, dan alami dalam bahasa Indonesia.

PENTING UNTUK JAWABAN ANDA (csReply):
1. JANGAN PERNAH memberikan respons template yang kaku dan berulang (seperti: "Halo Pak/Bu! Laporan panen Cabai sebanyak 2 ton... berhasil kami terima").
2. Berbicaralah layaknya manusia yang hangat, santai, dan penuh empati. Gunakan variasi ekspresi, sapaan hangat, emoji yang ramah, dan gaya penulisan chat WhatsApp alami (misal: "Halo Pak Ahmad! Wah mantap sekali panenannya...", "Siap Pak, laporan panen cabai rawitnya sudah masuk sistem kami ya. Ada yang bisa dibantu lagi, Pak?").
3. Jika petani mengajukan pertanyaan non-laporan (misalnya bertanya harga, menyapa, atau bertanya tentang pengiriman), jawablah secara langsung dan informatif sesuai konteks, jangan memaksa membicarakan laporan panen jika mereka tidak melaporkannya.
4. Sesuaikan gaya bicara Anda secara dinamis dengan pesan terakhir petani.

PENTING UNTUK DATA EKSTRAKSI (extractionResult):
1. Format output Anda harus selalu berupa JSON yang valid sesuai responseSchema yang disediakan.
2. Jika ada informasi yang tidak ada dalam pesan, berikan nilai null untuk value (dan 0 untuk confidence).
3. Normalisasikan nama komoditas (misal cabe/lombok -> Cabai Besar, kol -> Kubis, terong -> Terung, wortel -> Wortel, kembang kol -> Kembang Kol). Semua variasi cabai dinormalisasi ke 'Cabai Besar'.
4. Normalisasikan satuan (misal ton/tn -> ton, kg/kilo -> kg, karung -> karung, ikat -> ikat, pikul -> pikul).
5. Konversikan tanggal relatif (misal 'hari ini' -> ${todayStr}, 'kemarin' -> ${yesterdayStr}, 'besok' -> H+1, 'lusa' -> H+2).`;

        const requestBody = {
          contents: [
            {
              parts: [
                { text: promptText }
              ]
            }
          ],
          systemInstruction: {
            parts: [
              { text: systemInstruction }
            ]
          },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2
          }
        };

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
          throw new Error("Respon kosong dari Gemini API.");
        }

        const parsedResult = JSON.parse(jsonText);
        const { csReply, extractionResult } = parsedResult;

        // Ensure default fields are present
        const completeData = {
          komoditas: { value: null, confidence: 0 },
          jumlah: { value: null, confidence: 0 },
          satuan: { value: null, confidence: 0 },
          desa: { value: null, confidence: 0 },
          tanggal_panen: { value: null, confidence: 0 },
          kualitas: { value: null, confidence: 0 },
          ...extractionResult.data
        };

        const finalizedResult = {
          intent: extractionResult.intent || 'lainnya',
          data: completeData
        };

        setLastExtractedJson(finalizedResult);

        // Send CS Friendly Response
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const newReplyCS = {
          id: Date.now() + 1,
          text: csReply,
          type: "text",
          timestamp,
          sender: "other",
          reactions: []
        };

        setMessages(prev => [...prev, newReplyCS]);
        setContactStatus(`Online (${geminiModel === 'gemini-flash-latest' ? 'Gemini Flash' : geminiModel})`);
        playSound('received');

      } catch (err) {
        console.error("Gemini API Error:", err);
        triggerToast(`Koneksi Gemini gagal: ${err.message || err}`);
        runLocalSimulationFallback(userMessageText);
      }
    } else {
      runLocalSimulationFallback(userMessageText);
    }
  };

  // Handle message creation from the User (typing and sending)
  const handleSendMessage = (text, type = 'text', customPayload = {}) => {
    const msgId = Date.now();
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newMsg = {
      id: msgId,
      text,
      type,
      timestamp,
      sender: "me",
      status: "sent", // Start with 1 grey checkmark
      reactions: [],
      ...customPayload
    };

    if (replyingMessage) {
      newMsg.replyToId = replyingMessage.id;
      setReplyingMessage(null); // Clear quote
    }

    setMessages(prev => [...prev, newMsg]);
    playSound('sent');

    // Simulate checkmark changes (Sent -> Delivered -> Read)
    // Sent: 0s (done)
    // Delivered: 600ms
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'delivered' } : m));
    }, 600);

    // Read & Trigger Auto-Reply: 1500ms
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m));
      triggerAutoReply(type === 'text' ? text : type);
    }, 1300);
  };

  // Handle user voice note recording submission
  const handleSendVoiceNote = (durationStr) => {
    handleSendMessage('', 'audio', {
      duration: durationStr,
      mediaUrl: 'dummy.mp3'
    });
  };

  // Handle user custom attachment panel items
  const handleSendMockMedia = (mediaType) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    let payload = {};
    if (mediaType === 'gallery') {
      payload = {
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        caption: 'Sepatu lari pesanan saya Kak.'
      };
    } else if (mediaType === 'document') {
      payload = {
        type: 'document',
        fileName: 'Bukti_Transfer_Antigravity.pdf',
        fileSize: '430 KB',
        fileExtension: 'PDF'
      };
    } else if (mediaType === 'location') {
      payload = {
        type: 'location',
        address: 'Jl. Suprapto, Kel. Pengantungan, Kec. Ratu Samban, Kota Bengkulu',
        latitude: -3.7928,
        longitude: 102.2608
      };
    } else if (mediaType === 'audio') {
      payload = {
        type: 'audio',
        duration: '0:05',
        mediaUrl: 'dummy.mp3'
      };
    } else {
      triggerToast('Fitur simulasi media ini segera hadir!');
      return;
    }

    handleSendMessage('', payload.type, payload);
  };

  // User manual control panel functions (forcing messages or status)
  const handleTriggerNextStory = () => {
    if (farmerPresets.length === 0) return;
    const nextPreset = farmerPresets[currentStoryIndex];
    handleSendMessage(nextPreset.text);
    setCurrentStoryIndex(prev => (prev + 1) % farmerPresets.length);
  };

  // Direct injection of arbitrary contact response text
  const handleTriggerCustomReply = (text) => {
    setContactStatus("Ketik pesan...");
    setTimeout(() => {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setMessages(prev => [...prev, {
        id: Date.now(),
        text,
        type: 'text',
        timestamp,
        sender: 'other',
        reactions: []
      }]);
      setContactStatus("Online");
      playSound('received');
    }, 1500);
  };

  const handleResetChat = () => {
    setMessages([]);
    setCurrentStoryIndex(0);
    setContactStatus("Online");
    triggerToast("Percakapan dibersihkan!");
  };

  // Bubble context actions
  const handleSelectMessage = (id) => {
    if (selectedMessageId === id) {
      setSelectedMessageId(null);
    } else {
      setSelectedMessageId(id);
    }
  };

  const handleReactToMessage = (msgId, emoji) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        const existing = m.reactions || [];
        // Toggle emoji reaction
        const updated = existing.includes(emoji) 
          ? existing.filter(r => r !== emoji) 
          : [...existing.filter(r => r !== emoji), emoji].slice(-3); // Cap at 3 reactions for visual tidiness
        return { ...m, reactions: updated };
      }
      return m;
    }));
    setSelectedMessageId(null);
  };

  const handleReplyMessage = (msg) => {
    setReplyingMessage(msg);
    setSelectedMessageId(null);
  };

  const handleCopyMessage = () => {
    const msg = messages.find(m => m.id === selectedMessageId);
    if (msg) {
      const textToCopy = msg.isDeleted 
        ? "Pesan ini telah dihapus" 
        : msg.type === 'text' 
          ? msg.text 
          : msg.caption || `[Lampiran ${msg.type}]`;
      navigator.clipboard.writeText(textToCopy);
      triggerToast("Pesan disalin ke papan klip!");
    }
    setSelectedMessageId(null);
  };

  const handleDeleteMessage = (deleteType) => {
    if (deleteType === 'everyone') {
      setMessages(prev => prev.map(m => m.id === selectedMessageId ? {
        ...m,
        text: 'Pesan ini telah dihapus oleh pengirim.',
        type: 'deleted',
        isDeleted: true,
        reactions: []
      } : m));
      triggerToast("Pesan dihapus untuk semua orang");
    } else if (deleteType === 'me') {
      setMessages(prev => prev.filter(m => m.id !== selectedMessageId));
      triggerToast("Pesan dihapus untuk saya");
    }
    setSelectedMessageId(null);
    setShowDeleteDialog(false);
  };

  const handleForwardMessage = (targetChatName) => {
    const sourceMsg = messages.find(m => m.id === selectedMessageId);
    if (!sourceMsg) return;

    // Copy parameters and add a "Forwarded" marker
    const newMsg = {
      ...sourceMsg,
      id: Date.now(),
      sender: 'me',
      status: 'sent',
      isForwarded: true,
      timestamp: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
    };

    // Standard simulation forwards it right into our own chat to show the UI
    setMessages(prev => [...prev, newMsg]);
    playSound('sent');
    setSelectedMessageId(null);
    setShowForwardDialog(false);
    triggerToast(`Diteruskan ke ${targetChatName}`);

    // Trigger checkmark updates
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 600);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
      triggerAutoReply("forwarded message");
    }, 1300);
  };

  // Quoted message finder for the reply preview header on top of text box
  const getReplyingText = () => {
    if (!replyingMessage) return '';
    return replyingMessage.isDeleted 
      ? 'Pesan telah dihapus' 
      : replyingMessage.type === 'text' 
        ? replyingMessage.text 
        : `[${replyingMessage.type.toUpperCase()}]`;
  };

  // Highlight selection details
  const getSelectedMsg = () => messages.find(m => m.id === selectedMessageId);

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen bg-[#0c1317] justify-center items-center overflow-hidden">
      
      {/* 1. SMARTPHONE REPLICA LAYOUT */}
      <PhoneFrame>
        {/* Selection mode header overlay, replacing standard header when selected */}
        {selectedMessageId ? (
          <div className="w-full h-15 bg-[#005e54] text-white flex items-center justify-between px-3 wa-header-shadow z-30 shrink-0 select-none">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedMessageId(null)}
                className="p-1 hover:bg-[#ffffff20] rounded-full transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
              <span className="text-[17px] font-semibold">1</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Reply */}
              <button 
                onClick={() => handleReplyMessage(getSelectedMsg())}
                className="p-2 hover:bg-[#ffffff20] rounded-full transition-colors focus:outline-none"
                title="Balas"
              >
                <CornerUpLeft size={18} />
              </button>
              
              {/* Copy */}
              {getSelectedMsg()?.type === 'text' && (
                <button 
                  onClick={handleCopyMessage}
                  className="p-2 hover:bg-[#ffffff20] rounded-full transition-colors focus:outline-none"
                  title="Salin"
                >
                  <Copy size={17} />
                </button>
              )}

              {/* Info */}
              <button 
                onClick={() => setShowInfoDialog(true)}
                className="p-2 hover:bg-[#ffffff20] rounded-full transition-colors focus:outline-none"
                title="Info Pesan"
              >
                <Info size={18} />
              </button>

              {/* Forward */}
              <button 
                onClick={() => setShowForwardDialog(true)}
                className="p-2 hover:bg-[#ffffff20] rounded-full transition-colors focus:outline-none"
                title="Teruskan"
              >
                <Share size={17} className="scale-x-[-1]" />
              </button>

              {/* Delete */}
              <button 
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 hover:bg-[#ffffff20] rounded-full text-red-300 hover:text-red-400 transition-colors focus:outline-none"
                title="Hapus"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ) : (
          <ChatHeader 
            contactName={contactName}
            statusText={contactStatus}
            profilePic={profilePic}
            onResetChat={handleResetChat}
            onTriggerCall={(type) => {
              setCallType(type);
              setShowCallOverlay(true);
            }}
            onOpenAvatarModal={() => setShowAvatarZoom(true)}
          />
        )}

        {/* Scrollable conversation window */}
        <ChatArea 
          messages={messages}
          statusText={contactStatus}
          selectedMessageId={selectedMessageId}
          onSelectMessage={handleSelectMessage}
          onReact={handleReactToMessage}
          onReplyTo={handleReplyMessage}
          scrollToMessageId={scrollToMessageId}
          setScrollToMessageId={setScrollToMessageId}
        />

        {/* Quote overlay on top of typing area if reply context is active */}
        {replyingMessage && (
          <div className="mx-2 mb-1 p-2 rounded-t-xl bg-[#202c33] border-l-4 border-wa-green-light flex items-center justify-between text-[13px] wa-input-shadow relative z-20 animate-bubble">
            <div className="flex-1 min-w-0 text-left">
              <div className="font-semibold text-wa-green-light text-[11px]">{replyingMessage.sender === 'me' ? 'Anda' : 'Kontak'}</div>
              <div className="truncate text-[#8696a0] text-[12px]">{getReplyingText()}</div>
            </div>
            <button 
              onClick={() => setReplyingMessage(null)}
              className="text-[#8696a0] hover:text-white p-1 focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Floating Attachment Menu sheet */}
        <AttachmentTray 
          isOpen={isAttachmentOpen}
          onClose={() => setIsAttachmentOpen(false)}
          onSendMockMedia={handleSendMockMedia}
        />

        {/* Android bottom typing inputs */}
        <MessageInput 
          onSendMessage={(txt) => handleSendMessage(txt, 'text')}
          onSendVoiceNote={handleSendVoiceNote}
          onToggleAttachment={() => setIsAttachmentOpen(!isAttachmentOpen)}
          isAttachmentOpen={isAttachmentOpen}
          onUserTypingStateChange={(typing) => {
            // Can sync states here if required
          }}
        />

        {/* --- DYNAMIC SIMULATION MODALS --- */}

        {/* A. CALL OVERLAY PANEL */}
        {showCallOverlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f241e] via-[#091a15] to-[#040d0a] z-50 flex flex-col justify-between items-center py-16 px-6 text-white animate-bubble select-none">
            {/* Top info */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-xs text-[#8696a0] uppercase tracking-wider font-semibold">
                <ShieldAlert size={12} className="text-wa-green-light" />
                <span>Simulasi Panggilan</span>
              </div>
              <h3 className="text-2xl font-bold mt-2">{contactName}</h3>
              <span className="text-[14px] text-[#8696a0]">
                {callTimer === 0 ? 'Menghubungi...' : formatCallTime(callTimer)}
              </span>
            </div>

            {/* Video or Voice visual indicator */}
            {callType === 'video' ? (
              <div className="w-[180px] h-[240px] rounded-2xl bg-black border border-[#2d3a42] overflow-hidden flex items-center justify-center relative shadow-lg">
                {/* Simulated remote feed (contact avatar moving/pulsing) */}
                <img 
                  src={profilePic} 
                  className="w-full h-full object-cover animate-pulse opacity-90" 
                  alt="feed"
                />
                {/* Small overlay showing local camera feed */}
                <div className="absolute bottom-2 right-2 w-[50px] h-[70px] rounded-lg bg-[#202c33] border border-white flex items-center justify-center overflow-hidden">
                  <User size={24} className="text-slate-400" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#25d36640] relative z-10 shadow-xl">
                  <img src={profilePic} className="w-full h-full object-cover" alt="avatar" />
                </div>
                {/* Pulsing ring */}
                <div className="absolute inset-0 w-28 h-28 rounded-full border-4 border-wa-green-light animate-ping opacity-45"></div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="flex justify-center gap-6 w-full">
                {/* Video Cam toggle */}
                <button className="w-12 h-12 rounded-full bg-[#ffffff20] hover:bg-[#ffffff30] flex items-center justify-center text-white focus:outline-none transition-colors">
                  <Video size={18} />
                </button>
                {/* Mic toggle */}
                <button className="w-12 h-12 rounded-full bg-[#ffffff20] hover:bg-[#ffffff30] flex items-center justify-center text-white focus:outline-none transition-colors">
                  <Mic size={18} />
                </button>
                {/* End Call Button */}
                <button 
                  onClick={() => setShowCallOverlay(false)}
                  className="w-14 h-14 rounded-full bg-[#ea0038] hover:bg-[#d00030] flex items-center justify-center text-white shadow-lg focus:outline-none active:scale-90 transition-transform cursor-pointer"
                >
                  <Phone size={22} className="rotate-[135deg]" />
                </button>
              </div>
              <span className="text-[11px] text-[#8696a0] font-medium">Klik tombol merah untuk mengakhiri simulasi panggilan</span>
            </div>
          </div>
        )}

        {/* B. PROFILE AVATAR ZOOM MODAL */}
        {showAvatarZoom && (
          <div 
            className="absolute inset-0 bg-[#000000d0] z-50 flex flex-col justify-center items-center p-4 animate-bubble"
            onClick={() => setShowAvatarZoom(false)}
          >
            <div className="w-full max-w-[280px] bg-[#1f2c33] rounded-lg overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button onClick={() => setShowAvatarZoom(false)} className="bg-[#00000080] p-1.5 rounded-full text-white hover:bg-black">
                  <X size={16} />
                </button>
              </div>
              <img src={profilePic} className="w-full h-[280px] object-cover" alt="profile pic" />
              <div className="p-3 text-left bg-[#1f2c33] text-white">
                <div className="font-semibold text-[15px]">{contactName}</div>
                <div className="text-[11px] text-[#8696a0] mt-0.5">Kontak WhatsApp Terverifikasi</div>
              </div>
            </div>
          </div>
        )}

        {/* C. FORWARD DIALOG MODAL */}
        {showForwardDialog && (
          <div className="absolute inset-0 bg-[#000000a0] z-50 flex items-end justify-center animate-bubble" onClick={() => setShowForwardDialog(false)}>
            <div 
              className="w-full bg-[#1f2c33] border-t border-[#2d3a42] rounded-t-2xl max-h-[70%] flex flex-col p-4 animate-bubble"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2d3a42]">
                <h3 className="text-white font-semibold text-[15px]">Teruskan Pesan Ke:</h3>
                <button onClick={() => setShowForwardDialog(false)} className="text-[#8696a0] hover:text-white">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1.5 wa-scrollbar">
                {[
                  { name: "👥 Grup Sahabat Karib", desc: "Baru saja aktif" },
                  { name: "👩 Ibu Tersayang", desc: "Online" },
                  { name: "👔 Bos Kerja (Kantor)", desc: "Terakhir dilihat kemarin" },
                  { name: "📦 Supplier Batik Solo", desc: "Online" },
                  { name: "🏠 Warga Info RT 04", desc: "Grup WhatsApp" }
                ].map((target, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleForwardMessage(target.name)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#2a3942] transition-colors text-left focus:outline-none border-b border-[#00000010]"
                  >
                    <div className="flex flex-col">
                      <span className="text-white text-[14px] font-medium">{target.name}</span>
                      <span className="text-[#8696a0] text-[11px]">{target.desc}</span>
                    </div>
                    <span className="text-xs text-wa-green-light font-bold">KIRIM</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* D. DELETE CONFIRMATION DIALOG MODAL */}
        {showDeleteDialog && (
          <div className="absolute inset-0 bg-[#00000080] z-50 flex items-center justify-center p-6" onClick={() => setShowDeleteDialog(false)}>
            <div 
              className="bg-[#222e35] rounded-xl w-full max-w-[260px] p-5 shadow-2xl text-left border border-[#2e3b43] animate-reaction text-[14.5px]"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-white font-semibold mb-4">Hapus pesan?</div>
              <div className="flex flex-col gap-3.5">
                {getSelectedMsg()?.sender === 'me' && (
                  <button 
                    onClick={() => handleDeleteMessage('everyone')}
                    className="text-[#00a884] hover:opacity-90 font-medium text-left focus:outline-none"
                  >
                    Hapus untuk semua orang
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteMessage('me')}
                  className="text-[#00a884] hover:opacity-90 font-medium text-left focus:outline-none"
                >
                  Hapus untuk saya
                </button>
                <button 
                  onClick={() => setShowDeleteDialog(false)}
                  className="text-[#00a884] hover:opacity-90 font-medium text-left focus:outline-none self-end pt-1"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* E. MESSAGE DETAILS INFO DIALOG */}
        {showInfoDialog && getSelectedMsg() && (
          <div className="absolute inset-0 bg-[#00000090] z-50 flex items-center justify-center p-6" onClick={() => setShowInfoDialog(false)}>
            <div 
              className="bg-[#1f2c33] border border-[#2d3a42] rounded-xl w-full max-w-[280px] overflow-hidden shadow-2xl text-left animate-reaction"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-wa-green text-white p-3.5 flex justify-between items-center">
                <span className="font-semibold text-[15px]">Rincian Info Pesan</span>
                <button onClick={() => setShowInfoDialog(false)} className="text-[#e9edef] hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Details Content */}
              <div className="p-4 flex flex-col gap-4 text-white text-[13.5px]">
                {/* Display a preview of the bubble details */}
                <div className="bg-[#202c33] p-2.5 rounded-lg border border-[#2f3c44] text-[13.5px] line-clamp-2 italic">
                  "{getSelectedMsg()?.text || `[Lampiran ${getSelectedMsg()?.type}]`}"
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <CheckCheck size={16} className="text-wa-blue mt-0.5" />
                    <div>
                      <div className="font-semibold">Dibaca</div>
                      <div className="text-[11px] text-[#8696a0] mt-0.5">Hari ini, {getSelectedMsg()?.timestamp}:02</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCheck size={16} className="text-[#8696a0] mt-0.5" />
                    <div>
                      <div className="font-semibold">Diterima</div>
                      <div className="text-[11px] text-[#8696a0] mt-0.5">Hari ini, {getSelectedMsg()?.timestamp}:00</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={16} className="text-[#8696a0] mt-0.5" />
                    <div>
                      <div className="font-semibold">Terkirim</div>
                      <div className="text-[11px] text-[#8696a0] mt-0.5">Hari ini, {getSelectedMsg()?.timestamp}:00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="bg-[#182229] p-3 text-right border-t border-[#2d3a42]">
                <button 
                  onClick={() => setShowInfoDialog(false)} 
                  className="bg-wa-green hover:bg-[#009688] text-white px-4 py-1.5 rounded-md text-xs font-bold focus:outline-none"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* F. TOAST FLOAT WARNING */}
        {toastMessage && (
          <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-[#2a3942] border border-[#374955] text-white text-xs py-2 px-4 rounded-full z-50 shadow-md animate-reaction pointer-events-none select-none tracking-wide text-center">
            {toastMessage}
          </div>
        )}
      </PhoneFrame>

      {/* 2. SIDEBAR CONTROLLER PANEL */}
      {isControlPanelOpen && (
        <ControlPanel
          contactName={contactName}
          setContactName={setContactName}
          contactStatus={contactStatus}
          setContactStatus={setContactStatus}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          onTriggerNextStory={handleTriggerNextStory}
          onTriggerCustomReply={handleTriggerCustomReply}
          onResetChat={handleResetChat}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          storySteps={farmerPresets}
          currentStoryIndex={currentStoryIndex}
          lastExtractedJson={lastExtractedJson}
          engineMode={engineMode}
          setEngineMode={handleSetEngineMode}
          geminiApiKey={geminiApiKey}
          setGeminiApiKey={handleSetGeminiApiKey}
          geminiModel={geminiModel}
          setGeminiModel={handleSetGeminiModel}
          loadSimulation={loadSimulation}
          onClose={() => setIsControlPanelOpen(false)}
        />
      )}

      {/* Floating Toggle Button when Controller Panel is hidden */}
      {!isControlPanelOpen && (
        <button
          onClick={() => setIsControlPanelOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-[#1f2c33] hover:bg-[#2a3942] text-wa-green-light border border-[#2d3a42] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer animate-bubble"
          title="Tampilkan Simulation Controller"
        >
          <Sliders size={16} />
          <span>Simulation Controller</span>
        </button>
      )}
      
    </div>
  );
}
