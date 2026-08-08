import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import PhoneFrame from './PhoneFrame';
import ChatHeader from './ChatHeader';
import ChatArea from './ChatArea';
import MessageInput from './MessageInput';
import AttachmentTray from './AttachmentTray';
import { extractFarmerInfo } from '../data/defaultScript';
import {
  X, CornerUpLeft, Trash2, Copy, Info, Share,
  User, Check, CheckCheck, Phone, Video, Mic, ShieldAlert
} from 'lucide-react';
import { transporterMessages, transporterConfig, farmerMessages, farmerConfig, distributorMessages, distributorConfig } from '../data/dummyDialogues';

const SimulationWindow = forwardRef(({
  simulationType,
  engineMode,
  geminiApiKey,
  geminiModel,
  isMuted,
  onEvent,
  globalStock
}, ref) => {

  const getInitialConfig = () => {
    if (simulationType === 'transporter') return { msgs: transporterMessages, config: transporterConfig };
    if (simulationType === 'distributor') return { msgs: distributorMessages, config: distributorConfig };
    return { msgs: farmerMessages, config: farmerConfig };
  };

  const initial = getInitialConfig();
  const [messages, setMessages] = useState(initial.msgs);
  const [contactName, setContactName] = useState(initial.config.contactName);
  const [contactStatus, setContactStatus] = useState(initial.config.contactStatus);
  const [profilePic, setProfilePic] = useState(initial.config.profilePic);

  useEffect(() => {
    if (engineMode === 'gemini') {
      setContactStatus(`Online (${geminiModel === 'gemini-flash-latest' ? 'Gemini Flash' : geminiModel})`);
    } else {
      setContactStatus("Online (Simulasi NER)");
    }
  }, [engineMode, geminiModel]);

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [replyingMessage, setReplyingMessage] = useState(null);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [scrollToMessageId, setScrollToMessageId] = useState(null);
  const [lastExtractedJson, setLastExtractedJson] = useState(null);

  const [showAvatarZoom, setShowAvatarZoom] = useState(false);
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [callType, setCallType] = useState('voice');
  const [callTimer, setCallTimer] = useState(0);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2000);
  };

  const playSound = (soundType) => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (soundType === 'sent') {
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
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08);
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

  const formatCallTime = (secs) => {
    const s = secs % 60;
    const m = Math.floor(secs / 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const runLocalSimulationFallback = (userMessageText) => {
    let csReply = "";
    let extractionResult = null;

    if (simulationType === 'transporter') {
      csReply = "Baik, pesanan logistik Anda sedang kami proses. Saat ini sistem fallback lokal hanya mendukung ekstraksi dasar. Untuk pengalaman penuh, mohon gunakan AI Gemini.";
      extractionResult = { intent: "logistik_umum", data: {} };
    } else if (simulationType === 'distributor') {
      csReply = "Terkonfirmasi. Kami sedang mencarikan pasokan yang sesuai dengan permintaan distributor Anda. Silakan gunakan AI Gemini untuk percakapan yang lebih natural.";
      extractionResult = { intent: "distributor_umum", data: {} };
    } else {
      const result = extractFarmerInfo(userMessageText);
      csReply = result.csReply;
      extractionResult = result.extractionResult;
    }

    setLastExtractedJson(extractionResult);
    if (onEvent && extractionResult) {
      onEvent(simulationType, 'extracted', extractionResult);
    }

    setTimeout(() => setContactStatus("Online"), 500);
    setTimeout(() => setContactStatus("Ketik pesan..."), 1000);
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

  const triggerAutoReply = async (userMessageText) => {
    if (engineMode === 'gemini') {
      if (!geminiApiKey.trim()) {
        triggerToast("Masukkan Gemini API Key terlebih dahulu di panel konfigurasi!");
        runLocalSimulationFallback(userMessageText);
        return;
      }
      setTimeout(() => setContactStatus("Online"), 200);
      setTimeout(() => setContactStatus("Ketik pesan..."), 500);

      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let userRoleName = 'Petani';
        let userPersonaName = 'Pak Budi';
        let agentRoleName = 'CS Agent PanganDali';
        if (simulationType === 'transporter') {
          userRoleName = 'Mitra Logistik';
          userPersonaName = 'Pak Andi';
          agentRoleName = 'CS PanganDali Mitra Logistik';
        } else if (simulationType === 'distributor') {
          userRoleName = 'Distributor';
          userPersonaName = 'PT Bengkulu Pangan Utama';
          agentRoleName = 'CS PanganDali Distributor';
        }

        const recentMessages = messages.slice(-10).map(m => {
          const senderName = m.sender === 'me' ? userPersonaName : agentRoleName;
          return `${senderName}: ${m.text || `[Media: ${m.type}]`}`;
        }).join('\n');

        const stockDataString = globalStock && globalStock.length > 0
          ? JSON.stringify(globalStock, null, 2)
          : "Belum ada stok yang dilaporkan/tervalidasi saat ini.";

        const promptText = `Hari ini tanggal: ${todayStr}, Kemarin tanggal: ${yesterdayStr}.\n\n--- DATABASE STOK TERVALIDASI PANGANDALI ---\n${stockDataString}\n------------------------------------------\n\nRiwayat chat terbaru:\n${recentMessages}\n\nPesan terbaru dari ${userPersonaName} (${userRoleName}): "${userMessageText}"\n\nTolong berikan respons yang ramah, alami, dan tidak kaku dalam properti 'csReply' (sebagai ${agentRoleName} dalam Bahasa Indonesia) dan hasil ekstraksi data (jika ada) di 'extractionResult' sesuai format skema JSON.`;

        const responseSchema = {
          type: "OBJECT",
          properties: {
            csReply: { type: "STRING", description: "Jawaban CS yang ramah." },
            extractionResult: {
              type: "OBJECT",
              description: "Hasil analisis intent dan ekstraksi entitas laporan panen.",
              properties: {
                intent: {
                  type: "STRING",
                  enum: ["laporan_panen", "pembatalan", "update_panen", "tanya_harga", "tanya_transporter", "tanya_status", "percakapan_umum", "transaksi_disetujui", "butuh_angkutan", "lainnya"],
                  description: "Kategori maksud pesan terbaru."
                },
                data: {
                  type: "OBJECT",
                  properties: {
                    komoditas: {
                      type: "OBJECT",
                      properties: { value: { type: "STRING" }, confidence: { type: "NUMBER" } }
                    },
                    jumlah: {
                      type: "OBJECT",
                      properties: { value: { type: "NUMBER" }, confidence: { type: "NUMBER" } }
                    },
                    satuan: {
                      type: "OBJECT",
                      properties: { value: { type: "STRING" }, confidence: { type: "NUMBER" } }
                    },
                    desa: {
                      type: "OBJECT",
                      properties: { value: { type: "STRING" }, confidence: { type: "NUMBER" } }
                    }
                  }
                }
              },
              required: ["intent", "data"]
            }
          },
          required: ["csReply", "extractionResult"]
        };

        let taskDescription = 'mendeteksi data panen petani untuk dimasukkan ke database secara terstruktur';
        if (simulationType === 'transporter') {
          taskDescription = 'mengelola permintaan pengiriman, mencarikan muatan balik, dan memperbarui status perjalanan logistik';
        } else if (simulationType === 'distributor') {
          taskDescription = 'mencarikan pasokan komoditas dari petani berdasarkan Database Stok yang tersedia, memfasilitasi pesanan, dan mencocokkan kebutuhan pasar';
        }

        const systemInstruction = `Anda adalah PanganDali AI Agent (Live Chatbot) bagian ${agentRoleName}. Tugas Anda adalah ${taskDescription}, dan memberikan respons WhatsApp yang sangat ramah, bervariasi, dan alami dalam bahasa Indonesia.

PENTING UNTUK JAWABAN ANDA (csReply):
1. Lawan bicara Anda adalah ${userPersonaName} (berperan sebagai ${userRoleName}). JANGAN PERNAH menanyakan siapa identitas mereka. Anggap Anda sudah tahu siapa mereka karena mereka menggunakan aplikasi resmi. Langsung sapa dengan nama mereka ("Halo Pak Budi", dsb).
2. JANGAN PERNAH memberikan respons template yang kaku dan berulang.
3. Berbicaralah layaknya manusia yang hangat, santai, dan penuh empati.
4. Jika ${userRoleName} bertanya tentang ketersediaan stok, SELALU LIHAT "DATABASE STOK TERVALIDASI PANGANDALI" di dalam prompt. Jangan mengarang stok yang tidak ada di database tersebut! Jika kosong, bilang belum ada petani yang setor data.
5. Jika lawan bicara (Petani/Distributor) setuju untuk bertransaksi atau meminta logistik angkutan, berikan konfirmasi bahwa Anda segera menghubungkan mereka dengan Mitra Logistik, lalu pastikan intent-nya adalah "butuh_angkutan" atau "transaksi_disetujui".
6. JANGAN PERNAH menggunakan simbol bintang (**) atau format Markdown (seperti **teks**) di dalam csReply. Tulis teks biasa yang bersih saja tanpa cetak tebal.
7. JANGAN PERNAH menyuruh pengguna membalas dengan kata kunci atau template tertentu (misal: "Ketik AMBIL 1", "Balas SETUJU", "Gunakan kata SELESAI"). Biarkan pengguna membalas secara natural dengan bahasa mereka sendiri.

PENTING UNTUK DATA EKSTRAKSI (extractionResult):
1. Selalu ekstrak informasi komoditas, jumlah, satuan, dan lokasi/desa jika disebutkan.`;

        const requestBody = {
          contents: [{ parts: [{ text: promptText }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) throw new Error("Respon kosong dari Gemini API.");

        const parsedResult = JSON.parse(jsonText);
        const { csReply, extractionResult } = parsedResult;

        const completeData = {
          komoditas: { value: null, confidence: 0 },
          jumlah: { value: null, confidence: 0 },
          satuan: { value: null, confidence: 0 },
          desa: { value: null, confidence: 0 },
          ...extractionResult.data
        };

        const finalizedResult = {
          intent: extractionResult.intent || 'lainnya',
          data: completeData
        };

        setLastExtractedJson(finalizedResult);

        if (onEvent) {
          onEvent(simulationType, 'extracted', finalizedResult);
        }

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
      status: "sent",
      reactions: [],
      ...customPayload
    };

    if (replyingMessage) {
      newMsg.replyToId = replyingMessage.id;
      setReplyingMessage(null);
    }

    setMessages(prev => [...prev, newMsg]);
    playSound('sent');

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'delivered' } : m));
    }, 600);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read' } : m));
      triggerAutoReply(type === 'text' ? text : type);
    }, 1300);
  };

  useImperativeHandle(ref, () => ({
    injectMessage: (text, sender = 'other', customPayload = {}) => {
      const msgId = Date.now();
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const newMsg = {
        id: msgId,
        text,
        type: 'text',
        timestamp,
        sender,
        status: sender === 'me' ? 'read' : undefined,
        reactions: [],
        ...customPayload
      };

      setMessages(prev => [...prev, newMsg]);
      playSound(sender === 'me' ? 'sent' : 'received');

      if (sender === 'me') {
        setTimeout(() => triggerAutoReply(text), 1000);
      }
    },
    triggerPreset: (presetText) => {
      handleSendMessage(presetText);
    }
  }));

  const handleSendVoiceNote = (durationStr) => {
    handleSendMessage('', 'audio', { duration: durationStr, mediaUrl: 'dummy.mp3' });
  };

  const handleSendMockMedia = (mediaType) => {
    let payload = {};
    if (mediaType === 'gallery') {
      payload = { type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', caption: 'Sepatu lari pesanan saya Kak.' };
    } else if (mediaType === 'document') {
      payload = { type: 'document', fileName: 'Bukti_Transfer_Antigravity.pdf', fileSize: '430 KB', fileExtension: 'PDF' };
    } else if (mediaType === 'location') {
      payload = { type: 'location', address: 'Jl. Suprapto', latitude: -3.7928, longitude: 102.2608 };
    } else if (mediaType === 'audio') {
      payload = { type: 'audio', duration: '0:05', mediaUrl: 'dummy.mp3' };
    } else {
      triggerToast('Fitur simulasi media ini segera hadir!');
      return;
    }
    handleSendMessage('', payload.type, payload);
  };

  const handleResetChat = () => {
    setMessages([]);
    setContactStatus("Online");
    triggerToast("Percakapan dibersihkan!");
  };

  const handleSelectMessage = (id) => {
    setSelectedMessageId(prev => prev === id ? null : id);
  };

  const handleReactToMessage = (msgId, emoji) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        const existing = m.reactions || [];
        const updated = existing.includes(emoji) ? existing.filter(r => r !== emoji) : [...existing.filter(r => r !== emoji), emoji].slice(-3);
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
      const textToCopy = msg.isDeleted ? "Pesan ini telah dihapus" : msg.type === 'text' ? msg.text : msg.caption || `[Lampiran ${msg.type}]`;
      navigator.clipboard.writeText(textToCopy);
      triggerToast("Pesan disalin ke papan klip!");
    }
    setSelectedMessageId(null);
  };

  const handleDeleteMessage = (deleteType) => {
    if (deleteType === 'everyone') {
      setMessages(prev => prev.map(m => m.id === selectedMessageId ? { ...m, text: 'Pesan dihapus.', type: 'deleted', isDeleted: true, reactions: [] } : m));
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
    const newMsg = { ...sourceMsg, id: Date.now(), sender: 'me', status: 'sent', isForwarded: true, timestamp: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}` };
    setMessages(prev => [...prev, newMsg]);
    playSound('sent');
    setSelectedMessageId(null);
    setShowForwardDialog(false);
    triggerToast(`Diteruskan ke ${targetChatName}`);
    setTimeout(() => setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m)), 600);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
      triggerAutoReply("forwarded message");
    }, 1300);
  };

  const getReplyingText = () => {
    if (!replyingMessage) return '';
    return replyingMessage.isDeleted ? 'Pesan telah dihapus' : replyingMessage.type === 'text' ? replyingMessage.text : `[${replyingMessage.type.toUpperCase()}]`;
  };

  const getSelectedMsg = () => messages.find(m => m.id === selectedMessageId);

  return (
    <div className="w-full flex-shrink-0 lg:flex-1 lg:max-w-[420px] h-[90vh] lg:h-screen lg:py-4 px-2">
      <PhoneFrame>
        {selectedMessageId ? (
          <div className="w-full h-15 bg-[#005e54] text-white flex items-center justify-between px-3 wa-header-shadow z-30 shrink-0 select-none">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedMessageId(null)} className="p-1 hover:bg-[#ffffff20] rounded-full transition-colors focus:outline-none"><X size={20} /></button>
              <span className="text-[17px] font-semibold">1</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleReplyMessage(getSelectedMsg())} className="p-2 hover:bg-[#ffffff20] rounded-full focus:outline-none"><CornerUpLeft size={18} /></button>
              {getSelectedMsg()?.type === 'text' && <button onClick={handleCopyMessage} className="p-2 hover:bg-[#ffffff20] rounded-full focus:outline-none"><Copy size={17} /></button>}
              <button onClick={() => setShowInfoDialog(true)} className="p-2 hover:bg-[#ffffff20] rounded-full focus:outline-none"><Info size={18} /></button>
              <button onClick={() => setShowForwardDialog(true)} className="p-2 hover:bg-[#ffffff20] rounded-full focus:outline-none"><Share size={17} className="scale-x-[-1]" /></button>
              <button onClick={() => setShowDeleteDialog(true)} className="p-2 hover:bg-[#ffffff20] rounded-full text-red-300 hover:text-red-400 focus:outline-none"><Trash2 size={17} /></button>
            </div>
          </div>
        ) : (
          <ChatHeader
            contactName={contactName}
            statusText={contactStatus}
            profilePic={profilePic}
            onResetChat={handleResetChat}
            onTriggerCall={(type) => { setCallType(type); setShowCallOverlay(true); }}
            onOpenAvatarModal={() => setShowAvatarZoom(true)}
          />
        )}

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

        {replyingMessage && (
          <div className="mx-2 mb-1 p-2 rounded-t-xl bg-[#202c33] border-l-4 border-wa-green-light flex items-center justify-between text-[13px] wa-input-shadow relative z-20 animate-bubble">
            <div className="flex-1 min-w-0 text-left">
              <div className="font-semibold text-wa-green-light text-[11px]">{replyingMessage.sender === 'me' ? 'Anda' : 'Kontak'}</div>
              <div className="truncate text-[#8696a0] text-[12px]">{getReplyingText()}</div>
            </div>
            <button onClick={() => setReplyingMessage(null)} className="text-[#8696a0] hover:text-white p-1 focus:outline-none"><X size={16} /></button>
          </div>
        )}

        <AttachmentTray isOpen={isAttachmentOpen} onClose={() => setIsAttachmentOpen(false)} onSendMockMedia={handleSendMockMedia} />

        <MessageInput
          onSendMessage={(txt) => handleSendMessage(txt, 'text')}
          onSendVoiceNote={handleSendVoiceNote}
          onToggleAttachment={() => setIsAttachmentOpen(!isAttachmentOpen)}
          isAttachmentOpen={isAttachmentOpen}
          onUserTypingStateChange={(typing) => { }}
        />

        {showCallOverlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f241e] via-[#091a15] to-[#040d0a] z-50 flex flex-col justify-between items-center py-16 px-6 text-white animate-bubble select-none">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-xs text-[#8696a0] uppercase tracking-wider font-semibold">
                <ShieldAlert size={12} className="text-wa-green-light" />
                <span>Simulasi Panggilan</span>
              </div>
              <h3 className="text-2xl font-bold mt-2">{contactName}</h3>
              <span className="text-[14px] text-[#8696a0]">{callTimer === 0 ? 'Menghubungi...' : formatCallTime(callTimer)}</span>
            </div>
            {callType === 'video' ? (
              <div className="w-[180px] h-[240px] rounded-2xl bg-black border border-[#2d3a42] overflow-hidden flex items-center justify-center relative shadow-lg">
                <img src={profilePic} className="w-full h-full object-cover animate-pulse opacity-90" alt="feed" />
                <div className="absolute bottom-2 right-2 w-[50px] h-[70px] rounded-lg bg-[#202c33] border border-white flex items-center justify-center overflow-hidden">
                  <User size={24} className="text-slate-400" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#25d36640] relative z-10 shadow-xl">
                  <img src={profilePic} className="w-full h-full object-cover" alt="avatar" />
                </div>
                <div className="absolute inset-0 w-28 h-28 rounded-full border-4 border-wa-green-light animate-ping opacity-45"></div>
              </div>
            )}
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="flex justify-center gap-6 w-full">
                <button className="w-12 h-12 rounded-full bg-[#ffffff20] hover:bg-[#ffffff30] flex items-center justify-center text-white focus:outline-none transition-colors"><Video size={18} /></button>
                <button className="w-12 h-12 rounded-full bg-[#ffffff20] hover:bg-[#ffffff30] flex items-center justify-center text-white focus:outline-none transition-colors"><Mic size={18} /></button>
                <button onClick={() => setShowCallOverlay(false)} className="w-14 h-14 rounded-full bg-[#ea0038] hover:bg-[#d00030] flex items-center justify-center text-white shadow-lg focus:outline-none active:scale-90 transition-transform cursor-pointer"><Phone size={22} className="rotate-[135deg]" /></button>
              </div>
            </div>
          </div>
        )}

        {showAvatarZoom && (
          <div className="absolute inset-0 bg-[#000000d0] z-50 flex flex-col justify-center items-center p-4 animate-bubble" onClick={() => setShowAvatarZoom(false)}>
            <div className="w-full max-w-[280px] bg-[#1f2c33] rounded-lg overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button onClick={() => setShowAvatarZoom(false)} className="bg-[#00000080] p-1.5 rounded-full text-white hover:bg-black"><X size={16} /></button>
              </div>
              <img src={profilePic} className="w-full h-[280px] object-cover" alt="profile pic" />
              <div className="p-3 text-left bg-[#1f2c33] text-white">
                <div className="font-semibold text-[15px]">{contactName}</div>
                <div className="text-[11px] text-[#8696a0] mt-0.5">Kontak WhatsApp Terverifikasi</div>
              </div>
            </div>
          </div>
        )}

        {showInfoDialog && getSelectedMsg() && (
          <div className="absolute inset-0 bg-[#00000090] z-50 flex items-center justify-center p-6" onClick={() => setShowInfoDialog(false)}>
            <div className="bg-[#1f2c33] border border-[#2d3a42] rounded-xl w-full max-w-[280px] overflow-hidden shadow-2xl text-left animate-reaction" onClick={e => e.stopPropagation()}>
              <div className="bg-wa-green text-white p-3.5 flex justify-between items-center">
                <span className="font-semibold text-[15px]">Rincian Info</span>
                <button onClick={() => setShowInfoDialog(false)} className="text-[#e9edef] hover:text-white"><X size={16} /></button>
              </div>
              <div className="p-4 flex flex-col gap-4 text-white text-[13.5px]">
                <div className="bg-[#202c33] p-2.5 rounded-lg border border-[#2f3c44] text-[13.5px] line-clamp-2 italic">
                  "{getSelectedMsg()?.text || `[Lampiran ${getSelectedMsg()?.type}]`}"
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3"><CheckCheck size={16} className="text-wa-blue mt-0.5" /><div><div className="font-semibold">Dibaca</div></div></div>
                  <div className="flex items-start gap-3"><CheckCheck size={16} className="text-[#8696a0] mt-0.5" /><div><div className="font-semibold">Diterima</div></div></div>
                </div>
              </div>
              <div className="bg-[#182229] p-3 text-right border-t border-[#2d3a42]">
                <button onClick={() => setShowInfoDialog(false)} className="bg-wa-green hover:bg-[#009688] text-white px-4 py-1.5 rounded-md text-xs font-bold focus:outline-none">Tutup</button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-[#2a3942] border border-[#374955] text-white text-xs py-2 px-4 rounded-full z-50 shadow-md animate-reaction pointer-events-none select-none tracking-wide text-center">
            {toastMessage}
          </div>
        )}
      </PhoneFrame>
    </div>
  );
});

export default SimulationWindow;
