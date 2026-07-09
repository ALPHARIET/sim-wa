// Default simulated script and parsing engine for PanganDali AI Extractor Agent

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Levenshtein Distance implementation in JS to measure typo similarity
const levenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
};

// Fuzzy match function with exact, substring, and Levenshtein checks
const fuzzyMatch = (word, targets, maxDist = 1) => {
  if (!word) return null;
  const w = word.toLowerCase().trim();
  for (const t of targets) {
    if (w === t) return t;
    if (w.includes(t) || t.includes(w)) return t;
    if (levenshteinDistance(w, t) <= maxDist) return t;
  }
  return null;
};

// PanganDali Extraction Agent (Gemma 3) logic with typo robustness
export const extractFarmerInfo = (text) => {
  if (!text) return null;

  // Clean text punctuation and tokenize into words
  const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ").replace(/\s{2,}/g, " ");
  const tokens = cleanText.split(/\s+/).filter(Boolean);
  const textLower = text.toLowerCase();
  
  // 1. Intent Classification (incorporating typos)
  let intent = "percakapan_umum";
  if (textLower.includes("batal") || textLower.includes("btl") || textLower.includes("canc")) {
    intent = "pembatalan";
  } else if (textLower.includes("updt") || textLower.includes("update") || textLower.includes("revisi") || textLower.includes("ubah")) {
    intent = "update_panen";
  } else if (textLower.includes("berapa harga") || textLower.includes("harga") || textLower.includes("hrga") || textLower.includes("hrg")) {
    intent = "tanya_harga";
  } else if (textLower.includes("supir") || textLower.includes("mobil") || textLower.includes("kirim") || textLower.includes("transp") || textLower.includes("kurir")) {
    intent = "tanya_transporter";
  } else if (textLower.includes("status") || textLower.includes("stts")) {
    intent = "tanya_status";
  } else if (
    textLower.includes("panen") || textLower.includes("pnen") || 
    textLower.includes("ton") || textLower.includes("tn") || 
    textLower.includes("kg") || textLower.includes("kilo") || 
    textLower.includes("hasil") || textLower.includes("hsl")
  ) {
    intent = "laporan_panen";
  } else if (textLower.includes("halo") || textLower.includes("hlo") || textLower.includes("selamat") || textLower.includes("pagi") || textLower.includes("siang")) {
    intent = "percakapan_umum";
  } else {
    intent = "lainnya";
  }

  // 2. Extract & Normalize Commodity (komoditas) with fuzzy word matching
  let komoditasVal = null;
  let komoditasConf = 0;
  
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i].toLowerCase();
    
    // Cabai/Cabe/Lombok
    if (fuzzyMatch(tok, ['cabe', 'cabai', 'cabi', 'cbai', 'lombok', 'lmbk'], 1)) {
      komoditasVal = "Cabai";
      komoditasConf = 0.98;
      // Look ahead for "merah" or "rawit" variants
      if (i + 1 < tokens.length) {
        const nextTok = tokens[i+1].toLowerCase();
        if (fuzzyMatch(nextTok, ['merah', 'mrah', 'mrh'], 1)) {
          komoditasVal = "Cabai Merah";
          komoditasConf = 0.99;
        } else if (fuzzyMatch(nextTok, ['rawit', 'rwt'], 1)) {
          komoditasVal = "Cabai Rawit";
          komoditasConf = 0.99;
        }
      }
      break;
    }
    
    // Padi/Gabah/Beras
    if (fuzzyMatch(tok, ['padi', 'gabah', 'beras', 'pdi', 'gabh', 'brs'], 1)) {
      komoditasVal = "Padi";
      komoditasConf = 0.98;
      break;
    }
    
    // Jagung
    if (fuzzyMatch(tok, ['jagung', 'jgung', 'jgng', 'jaugng'], 1)) {
      komoditasVal = "Jagung";
      komoditasConf = 0.98;
      break;
    }

    // Bawang
    if (fuzzyMatch(tok, ['bawang', 'bwg', 'bwang'], 1)) {
      komoditasVal = "Bawang Merah"; // Default fallback
      komoditasConf = 0.95;
      if (i + 1 < tokens.length) {
        const nextTok = tokens[i+1].toLowerCase();
        if (fuzzyMatch(nextTok, ['putih', 'pth', 'ptih'], 1)) {
          komoditasVal = "Bawang Putih";
          komoditasConf = 0.98;
        } else if (fuzzyMatch(nextTok, ['merah', 'mrah', 'mrh', 'brambang', 'brmbng'], 1)) {
          komoditasVal = "Bawang Merah";
          komoditasConf = 0.98;
        }
      }
      break;
    }

    // Kentang
    if (fuzzyMatch(tok, ['kentang', 'kntng', 'kntg'], 1)) {
      komoditasVal = "Kentang";
      komoditasConf = 0.98;
      break;
    }
    
    // Tomat
    if (fuzzyMatch(tok, ['tomat', 'tmt', 'tmtg'], 1)) {
      komoditasVal = "Tomat";
      komoditasConf = 0.98;
      break;
    }

    // Kedelai
    if (fuzzyMatch(tok, ['kedelai', 'kdle', 'kdelai'], 1)) {
      komoditasVal = "Kedelai";
      komoditasConf = 0.98;
      break;
    }
  }

  // 3. Extract quantity (jumlah) and unit (satuan) with typo robustness
  let jumlahVal = null;
  let jumlahConf = 0;
  let satuanVal = null;
  let satuanConf = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    // Check if token is a number (like 2,5 or 2.5 or 800)
    const numMatch = tok.match(/^(\d+(?:[.,]\d+)?)$/);
    if (numMatch) {
      const val = parseFloat(numMatch[1].replace(',', '.'));
      jumlahVal = val;
      jumlahConf = 0.95;
      
      // Look at the next token for unit typo matching
      if (i + 1 < tokens.length) {
        const unitTok = tokens[i+1].toLowerCase();
        if (fuzzyMatch(unitTok, ['ton', 'tn', 'tonn'], 1)) {
          satuanVal = 'ton';
          satuanConf = 1.0;
        } else if (fuzzyMatch(unitTok, ['kg', 'kilo', 'kilogram', 'klogrm', 'klgr', 'klo'], 1)) {
          satuanVal = 'kg';
          satuanConf = 0.95;
        } else if (fuzzyMatch(unitTok, ['kwintal', 'kuintal', 'kwt', 'kw'], 1)) {
          satuanVal = 'kwintal';
          satuanConf = 0.95;
        }
      }
      break;
    }
  }

  // 4. Extract Location / Desa (Fuzzy trigger ds. or desa)
  let desaVal = null;
  let desaConf = 0;
  let lokasiVal = null;
  let lokasiConf = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i].toLowerCase();
    if (fuzzyMatch(tok, ['desa', 'ds', 'dsa'], 1)) {
      if (i + 1 < tokens.length) {
        const vName = tokens[i+1];
        // Capitalize the village name
        desaVal = vName.charAt(0).toUpperCase() + vName.slice(1);
        // Normalize sukmju -> Sukamaju for clean data if matched closely
        if (fuzzyMatch(vName, ['sukamaju', 'sukmju'], 1)) {
          desaVal = "Sukamaju";
        } else if (fuzzyMatch(vName, ['karanganyar', 'krganyar'], 1)) {
          desaVal = "Karanganyar";
        } else if (fuzzyMatch(vName, ['mulyoharjo', 'mlyhrj'], 1)) {
          desaVal = "Mulyoharjo";
        }
        desaConf = 0.95;
        break;
      }
    }
  }

  // Generic di locations fallback
  if (!desaVal) {
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i].toLowerCase();
      if (tok === 'di' && i + 1 < tokens.length) {
        const locName = tokens[i+1];
        if (!['desa', 'ds', 'kecamatan', 'kabupaten'].includes(locName.toLowerCase())) {
          lokasiVal = locName.charAt(0).toUpperCase() + locName.slice(1);
          lokasiConf = 0.85;
          break;
        }
      }
    }
  }

  // 5. Extract Date (tanggal_panen) with typo robustness
  let tanggalPanenVal = null;
  let tanggalPanenConf = 0;
  const today = new Date();

  // Check for "hari ini" (hri ini, hr ini, hariini)
  if (textLower.includes("hari ini") || textLower.includes("hri ini") || textLower.includes("hr ini") || textLower.includes("hariini")) {
    tanggalPanenVal = formatDate(today);
    tanggalPanenConf = 0.80;
  } else if (textLower.includes("kemarin") || textLower.includes("kmarin") || textLower.includes("kmrin") || textLower.includes("kmrn")) {
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    tanggalPanenVal = formatDate(yesterday);
    tanggalPanenConf = 0.80;
  } else {
    // DD-MM-YYYY / YYYY-MM-DD patterns
    const dateMatch = text.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dateMatch) {
      const d = dateMatch[1].padStart(2, '0');
      const m = dateMatch[2].padStart(2, '0');
      const y = dateMatch[3];
      tanggalPanenVal = `${y}-${m}-${d}`;
      tanggalPanenConf = 0.95;
    }
  }

  // 6. Farmer Name & Phone
  let namaPetaniVal = null;
  let namaPetaniConf = 0;
  let nomorHpVal = null;
  let nomorHpConf = 0;

  const phoneMatch = text.match(/(\+?62|0)8[1-9][0-9]{7,11}/);
  if (phoneMatch) {
    nomorHpVal = phoneMatch[0];
    nomorHpConf = 0.99;
  }

  const nameMatch = text.match(/(?:nama|petani)\s*(?:saya|petani)?\s*(?:adalah|:|\s)\s*([A-Z][a-z]+|[a-zA-Z]+)/);
  if (nameMatch) {
    namaPetaniVal = nameMatch[1];
    namaPetaniConf = 0.90;
  }

  // Generate CS Response
  let csReply = "";
  if (intent === "laporan_panen") {
    if (komoditasVal && jumlahVal) {
      csReply = `Halo Pak/Bu! Laporan panen ${komoditasVal} sebanyak ${jumlahVal} ${satuanVal || 'unit'} di ${desaVal || lokasiVal || 'lokasi Anda'} berhasil kami terima dan catat di database PanganDali. Terima kasih banyak atas kerjasamanya! 🙏`;
    } else {
      csReply = `Laporan panen Anda terdeteksi oleh sistem kami. Agar dapat kami verifikasi dengan baik, mohon sertakan informasi komoditas dan jumlah hasil panennya ya Pak/Bu. Contoh: 'Panen padi 2 ton'. Terima kasih!`;
    }
  } else if (intent === "pembatalan") {
    csReply = `Baik Pak/Bu, permintaan pembatalan laporan panen Anda telah kami terima. Laporan panen tersebut berhasil dinonaktifkan dari sistem PanganDali. 🚫`;
  } else if (intent === "update_panen") {
    csReply = `Baik Pak/Bu, revisi laporan panen Anda sudah kami terima dan data di database PanganDali telah diperbarui secara otomatis. Terima kasih! 🔄`;
  } else if (intent === "tanya_harga") {
    csReply = `Berikut estimasi harga komoditas panen hari ini di penampungan terdekat:\n- Cabai Merah: Rp 25.000/kg\n- Cabai Rawit: Rp 35.000/kg\n- Padi Ciherang: Rp 7.200/kg\n- Jagung: Rp 5.500/kg\n\nHarga dapat disesuaikan dengan kualitas/grade hasil panen Anda. 📈`;
  } else if (intent === "tanya_transporter") {
    csReply = `Untuk pengiriman, tim logistik PanganDali sedang mencarikan transporter terdekat dari daerah Anda. Supir truk akan segera menghubungi Anda jika jadwal angkut sudah siap. 🚚`;
  } else if (intent === "tanya_status") {
    csReply = `Laporan panen Anda sedang diverifikasi oleh admin PanganDali. Kami akan segera mengirimkan nomor transporter yang akan menjemput hasil panen Anda. Mohon ditunggu ya Pak/Bu. ⏳`;
  } else if (intent === "percakapan_umum") {
    csReply = `Halo! Selamat datang di Layanan WhatsApp PanganDali. Saya adalah AI Assistant yang bertugas mengumpulkan data panen petani secara otomatis. Silakan kirimkan laporan panen Anda di sini! 😊`;
  } else {
    csReply = `Terima kasih atas pesan Anda. Silakan laporkan hasil panen Anda dengan format bebas, dan asisten AI kami akan mencatatnya ke database. Contoh: 'Melaporkan panen jagung 800 kg'.`;
  }

  // Build JSON
  const result = {
    intent: intent,
    data: {
      nama_petani: { value: namaPetaniVal, confidence: namaPetaniConf },
      nomor_hp: { value: nomorHpVal, confidence: nomorHpConf },
      komoditas: { value: komoditasVal, confidence: komoditasConf },
      varietas: { value: null, confidence: 0 },
      jumlah: { value: jumlahVal, confidence: jumlahConf },
      satuan: { value: satuanVal, confidence: satuanConf },
      kualitas: { value: null, confidence: 0 },
      harga: { value: null, confidence: 0 },
      lokasi: { value: lokasiVal || desaVal, confidence: lokasiVal ? lokasiConf : (desaVal ? 0.80 : 0) },
      desa: { value: desaVal, confidence: desaConf },
      kecamatan: { value: null, confidence: 0 },
      kabupaten: { value: null, confidence: 0 },
      provinsi: { value: null, confidence: 0 },
      tanggal_panen: { value: tanggalPanenVal, confidence: tanggalPanenConf },
      waktu_panen: { value: null, confidence: 0 },
      metode_pengiriman: { value: textLower.includes("ambil") ? "Ambil Sendiri" : null, confidence: textLower.includes("ambil") ? 0.90 : 0 },
      transporter: { value: null, confidence: 0 },
      koordinat: { value: null, confidence: 0 },
      catatan: { value: null, confidence: 0 }
    }
  };

  const cleanedData = {};
  Object.keys(result.data).forEach(key => {
    const isCoreField = ['komoditas', 'jumlah', 'satuan', 'desa', 'tanggal_panen', 'kualitas'].includes(key);
    if (result.data[key].value !== null || isCoreField) {
      cleanedData[key] = result.data[key];
    }
  });

  return {
    csReply,
    extractionResult: {
      intent: result.intent,
      data: cleanedData
    }
  };
};

// Preset message prompts for testing the PanganDali extractor (incorporating typos!)
export const farmerPresets = [
  {
    title: "Laporan Cabe (Contoh 1)",
    text: "Pak saya panen cabai merah 2,5 ton di Desa Sukamaju hari ini."
  },
  {
    title: "Laporan Jagung (Contoh 2)",
    text: "Panen jagung sekitar 800 kilo."
  },
  {
    title: "Typo Cabe Rawit & Kemarin",
    text: "panen cbe rwt 400 klogrm kmrn di ds sukmju"
  },
  {
    title: "Typo Jagung & Kilo",
    text: "melaporkan hsil jgung 500 klo di ds karanganyar hri ini"
  },
  {
    title: "Typo Padi & Ton",
    text: "Pak pnen pdi dapat 3,5 tn kemarin"
  },
  {
    title: "Batal Panen Typo",
    text: "tolong btl laporan panen kemarin pak"
  }
];
