// Default simulated script and parsing engine for PanganDali AI Extractor Agent
//
// CATATAN TEKNIS:
// Simulator ini menggunakan mesin ekstraksi berbasis aturan (fuzzy string matching)
// untuk meniru perilaku model NER (Named Entity Recognition) berbasis BERT yang
// diusulkan dalam proposal PanganDali. Model BERT fine-tuned tersebut dirancang
// untuk mencapai F1-score 83,67% pada ekstraksi entitas laporan panen.
// Implementasi di simulator ini adalah MOCKUP untuk keperluan demo.

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper to format date as DD-MM-YYYY for display
const formatDateDisplay = (date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${d}-${m}-${y}`;
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

// Simulasi ekstraksi entitas berbasis aturan (rule-based NER simulation)
// Meniru perilaku model transformer NER berbasis BERT yang diusulkan dalam proposal.
// Mendukung 5 komoditas pilot: Cabai Besar, Kubis, Terung, Wortel, Kembang Kol
// + Tomat sebagai komoditas tambahan.
// Mendukung satuan lokal: karung, ikat, pikul (sesuai klaim proposal).
// Mendukung waktu relatif: besok, lusa, nama hari (sesuai klaim proposal).
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
  } else if (textLower.includes("supir") || textLower.includes("mobil") || textLower.includes("kirim") || textLower.includes("transp") || textLower.includes("kurir") || textLower.includes("logistik")) {
    intent = "tanya_transporter";
  } else if (textLower.includes("status") || textLower.includes("stts")) {
    intent = "tanya_status";
  } else if (
    textLower.includes("panen") || textLower.includes("pnen") || 
    textLower.includes("ton") || textLower.includes("tn") || 
    textLower.includes("kg") || textLower.includes("kilo") || 
    textLower.includes("karung") || textLower.includes("ikat") || textLower.includes("pikul") ||
    textLower.includes("hasil") || textLower.includes("hsl")
  ) {
    intent = "laporan_panen";
  } else if (textLower.includes("halo") || textLower.includes("hlo") || textLower.includes("selamat") || textLower.includes("pagi") || textLower.includes("siang")) {
    intent = "percakapan_umum";
  } else {
    intent = "lainnya";
  }

  // 2. Extract & Normalize Commodity (komoditas) with fuzzy word matching
  // 5 Komoditas Pilot Hortikultura: Cabai Besar, Kubis, Terung, Wortel, Kembang Kol
  // + Tomat sebagai komoditas tambahan
  let komoditasVal = null;
  let komoditasConf = 0;
  
  // First pass: detect multi-token commodities (Kembang Kol, Cabai Besar)
  // "kembang kol" / "bunga kol" harus dideteksi sebelum "kol" tunggal agar tidak salah ke Kubis
  const twoGrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    twoGrams.push({ combined: tokens[i].toLowerCase() + ' ' + tokens[i+1].toLowerCase(), index: i });
    // Also check concatenated form (kembangkol)
    twoGrams.push({ combined: tokens[i].toLowerCase() + tokens[i+1].toLowerCase(), index: i });
  }

  for (const gram of twoGrams) {
    // Kembang Kol detection (multi-token, must be checked BEFORE Kubis)
    if (fuzzyMatch(gram.combined, ['kembang kol', 'kembangkol', 'bunga kol', 'bungakol', 'blumkol'], 2)) {
      komoditasVal = "Kembang Kol";
      komoditasConf = 0.98;
      break;
    }
    // Cabai Besar (multi-token: "cabai besar", "cabe merah besar", "cabai merah")
    if (fuzzyMatch(gram.combined, ['cabai besar', 'cabe besar', 'cabai merah', 'cabe merah'], 2)) {
      komoditasVal = "Cabai Besar";
      komoditasConf = 0.99;
      break;
    }
  }

  // Single-token commodity detection (only if multi-token didn't match)
  if (!komoditasVal) {
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i].toLowerCase();
      
      // Cabai Besar (single token: cabe, cabai, lombok, dll.)
      // Semua variasi cabai dinormalisasi ke "Cabai Besar" sesuai nomenklatur BPS
      if (fuzzyMatch(tok, ['cabe', 'cabai', 'cabi', 'cbai', 'lombok', 'lmbk'], 1)) {
        komoditasVal = "Cabai Besar";
        komoditasConf = 0.95;
        // Look ahead for "besar" or "merah" to boost confidence
        if (i + 1 < tokens.length) {
          const nextTok = tokens[i+1].toLowerCase();
          if (fuzzyMatch(nextTok, ['besar', 'bsar', 'bsr'], 1)) {
            komoditasConf = 0.99;
          } else if (fuzzyMatch(nextTok, ['merah', 'mrah', 'mrh'], 1)) {
            komoditasVal = "Cabai Besar";
            komoditasConf = 0.98;
          }
        }
        break;
      }
      
      // Kubis (kol, kubis, kobis)
      // PENTING: "kol" tunggal → Kubis, BUKAN Kembang Kol (kembang kol sudah ditangani di atas)
      if (fuzzyMatch(tok, ['kubis', 'kobis', 'kol'], 1)) {
        komoditasVal = "Kubis";
        komoditasConf = 0.95;
        break;
      }

      // Terung (terong, terung, trong)
      if (fuzzyMatch(tok, ['terung', 'terong', 'trong', 'trung', 'trong'], 1)) {
        komoditasVal = "Terung";
        komoditasConf = 0.98;
        break;
      }

      // Wortel (wortel, wortol, carrot)
      if (fuzzyMatch(tok, ['wortel', 'wortol', 'wrtel', 'carrot'], 1)) {
        komoditasVal = "Wortel";
        komoditasConf = 0.98;
        break;
      }

      // Blumkol (single token form) → Kembang Kol
      if (fuzzyMatch(tok, ['blumkol', 'blumkl', 'bloomkol'], 1)) {
        komoditasVal = "Kembang Kol";
        komoditasConf = 0.95;
        break;
      }
      
      // Tomat (komoditas tambahan, data survei memuat tomat)
      if (fuzzyMatch(tok, ['tomat', 'tmt', 'tmtg'], 1)) {
        komoditasVal = "Tomat";
        komoditasConf = 0.98;
        break;
      }
    }
  }

  // 3. Extract quantity (jumlah) and unit (satuan) with typo robustness
  // Mendukung satuan standar (ton, kg, kwintal) dan satuan lokal (karung, ikat, pikul)
  // sesuai klaim proposal.
  // Asumsi konversi satuan lokal (perkiraan berdasarkan kebiasaan setempat):
  //   1 karung ≈ 50 kg (karung standar sayuran)
  //   1 pikul  ≈ 60 kg (pikul tradisional)
  //   1 ikat   ≈ 5 kg  (ikat sayuran daun/cabai, bervariasi per komoditas)
  let jumlahVal = null;
  let jumlahConf = 0;
  let satuanVal = null;
  let satuanConf = 0;
  let konversiKg = null;
  let catatanKonversi = null;

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
          konversiKg = val * 1000;
        } else if (fuzzyMatch(unitTok, ['kg', 'kilo', 'kilogram', 'klogrm', 'klgr', 'klo'], 1)) {
          satuanVal = 'kg';
          satuanConf = 0.95;
          konversiKg = val;
        } else if (fuzzyMatch(unitTok, ['kwintal', 'kuintal', 'kwt', 'kw'], 1)) {
          satuanVal = 'kwintal';
          satuanConf = 0.95;
          konversiKg = val * 100;
        } else if (fuzzyMatch(unitTok, ['karung', 'karun', 'krg', 'krung'], 1)) {
          satuanVal = 'karung';
          satuanConf = 0.85;
          konversiKg = val * 50; // 1 karung ≈ 50 kg
          catatanKonversi = `Perkiraan: ${val} karung × 50 kg = ~${konversiKg} kg (asumsi karung standar sayuran)`;
          jumlahConf = 0.70; // Turunkan confidence karena satuan perkiraan
        } else if (fuzzyMatch(unitTok, ['ikat', 'iket', 'ikt'], 1)) {
          satuanVal = 'ikat';
          satuanConf = 0.80;
          konversiKg = val * 5; // 1 ikat ≈ 5 kg
          catatanKonversi = `Perkiraan: ${val} ikat × 5 kg = ~${konversiKg} kg (asumsi ikat sayuran, bervariasi per komoditas)`;
          jumlahConf = 0.70; // Turunkan confidence karena satuan perkiraan
        } else if (fuzzyMatch(unitTok, ['pikul', 'pikol', 'pkul', 'pkol'], 1)) {
          satuanVal = 'pikul';
          satuanConf = 0.85;
          konversiKg = val * 60; // 1 pikul ≈ 60 kg
          catatanKonversi = `Perkiraan: ${val} pikul × 60 kg = ~${konversiKg} kg (asumsi pikul tradisional)`;
          jumlahConf = 0.70; // Turunkan confidence karena satuan perkiraan
        }
      }
      break;
    }
  }

  // 4. Extract Location / Desa (Fuzzy trigger ds. or desa)
  // Desa pilot: Lubuk Ubar, Kampung Baru, Air Putih Lama, Mekar Sari
  // (Kecamatan Selupu Rejang, Kabupaten Rejang Lebong)
  let desaVal = null;
  let desaConf = 0;
  let lokasiVal = null;
  let lokasiConf = 0;

  // Check for multi-token village names first (e.g. "lubuk ubar", "kampung baru", etc.)
  for (let i = 0; i < tokens.length - 1; i++) {
    const twoWord = tokens[i].toLowerCase() + ' ' + tokens[i+1].toLowerCase();
    const twoWordJoined = tokens[i].toLowerCase() + tokens[i+1].toLowerCase();
    
    if (fuzzyMatch(twoWord, ['lubuk ubar', 'lbk ubar'], 2) || fuzzyMatch(twoWordJoined, ['lubukubar', 'lbkubar'], 2)) {
      desaVal = "Lubuk Ubar";
      desaConf = 0.95;
      break;
    }
    if (fuzzyMatch(twoWord, ['kampung baru', 'kmpng baru', 'kmpg baru'], 2) || fuzzyMatch(twoWordJoined, ['kampungbaru', 'kmpngbaru'], 2)) {
      desaVal = "Kampung Baru";
      desaConf = 0.95;
      break;
    }
    if (fuzzyMatch(twoWord, ['air putih', 'air ptih'], 2) || fuzzyMatch(twoWordJoined, ['airputih'], 2)) {
      // Check for "lama" after
      if (i + 2 < tokens.length && fuzzyMatch(tokens[i+2].toLowerCase(), ['lama', 'lma'], 1)) {
        desaVal = "Air Putih Lama";
      } else {
        desaVal = "Air Putih Lama"; // default to full name
      }
      desaConf = 0.90;
      break;
    }
    if (fuzzyMatch(twoWord, ['mekar sari', 'mkar sari', 'mkr sari'], 2) || fuzzyMatch(twoWordJoined, ['mekarsari', 'mkarsari'], 2)) {
      desaVal = "Mekar Sari";
      desaConf = 0.95;
      break;
    }
  }

  // Fallback: single-token detection after "desa"/"ds" trigger
  if (!desaVal) {
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i].toLowerCase();
      if (fuzzyMatch(tok, ['desa', 'ds', 'dsa'], 1)) {
        if (i + 1 < tokens.length) {
          const vName = tokens[i+1].toLowerCase();
          // Try to normalize to pilot villages
          if (fuzzyMatch(vName, ['lubuk', 'lbk'], 1) && i + 2 < tokens.length && fuzzyMatch(tokens[i+2].toLowerCase(), ['ubar', 'ubr'], 1)) {
            desaVal = "Lubuk Ubar";
            desaConf = 0.95;
          } else if (fuzzyMatch(vName, ['kampung', 'kmpng', 'kmpg'], 1) && i + 2 < tokens.length && fuzzyMatch(tokens[i+2].toLowerCase(), ['baru', 'bru'], 1)) {
            desaVal = "Kampung Baru";
            desaConf = 0.95;
          } else if (fuzzyMatch(vName, ['mekar', 'mkar', 'mkr'], 1) && i + 2 < tokens.length && fuzzyMatch(tokens[i+2].toLowerCase(), ['sari', 'sri'], 1)) {
            desaVal = "Mekar Sari";
            desaConf = 0.95;
          } else {
            // Capitalize as-is if no known village matches
            desaVal = vName.charAt(0).toUpperCase() + vName.slice(1);
            desaConf = 0.80;
          }
          break;
        }
      }
    }
  }

  // "di <location>" fallback (generic location extraction)
  if (!desaVal) {
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i].toLowerCase();
      if (tok === 'di' && i + 1 < tokens.length) {
        const locName = tokens[i+1].toLowerCase();
        if (!['desa', 'ds', 'kecamatan', 'kabupaten'].includes(locName)) {
          // Check if it's a known village (single-word match)
          if (fuzzyMatch(locName, ['lubuk', 'lbk'], 1) && i + 2 < tokens.length && fuzzyMatch(tokens[i+2].toLowerCase(), ['ubar', 'ubr'], 1)) {
            desaVal = "Lubuk Ubar";
            desaConf = 0.90;
          } else if (fuzzyMatch(locName, ['kampung', 'kmpng'], 1) && i + 2 < tokens.length && fuzzyMatch(tokens[i+2].toLowerCase(), ['baru', 'bru'], 1)) {
            desaVal = "Kampung Baru";
            desaConf = 0.90;
          } else if (fuzzyMatch(locName, ['mekar', 'mkar'], 1) && i + 2 < tokens.length && fuzzyMatch(tokens[i+2].toLowerCase(), ['sari', 'sri'], 1)) {
            desaVal = "Mekar Sari";
            desaConf = 0.90;
          } else {
            lokasiVal = locName.charAt(0).toUpperCase() + locName.slice(1);
            lokasiConf = 0.85;
          }
          break;
        }
      }
    }
  }

  // 5. Extract Date (tanggal_panen) with typo robustness
  // Mendukung waktu relatif sesuai klaim proposal: besok, lusa, nama hari
  let tanggalPanenVal = null;
  let tanggalPanenConf = 0;
  let waktuLabel = null; // human-readable label for display
  const today = new Date();

  // Check for "hari ini" (hri ini, hr ini, hariini)
  if (textLower.includes("hari ini") || textLower.includes("hri ini") || textLower.includes("hr ini") || textLower.includes("hariini")) {
    tanggalPanenVal = formatDate(today);
    tanggalPanenConf = 0.80;
    waktuLabel = "hari ini";
  } else if (textLower.includes("kemarin") || textLower.includes("kmarin") || textLower.includes("kmrin") || textLower.includes("kmrn")) {
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    tanggalPanenVal = formatDate(yesterday);
    tanggalPanenConf = 0.80;
    waktuLabel = "kemarin";
  } else if (textLower.includes("lusa") || textLower.includes("lsa")) {
    // Lusa = day after tomorrow (+2)
    const lusa = new Date();
    lusa.setDate(today.getDate() + 2);
    tanggalPanenVal = formatDate(lusa);
    tanggalPanenConf = 0.80;
    waktuLabel = `lusa (${formatDateDisplay(lusa)})`;
  } else if (textLower.includes("besok pagi") || textLower.includes("bsok pagi") || textLower.includes("besok pgi")) {
    const besok = new Date();
    besok.setDate(today.getDate() + 1);
    tanggalPanenVal = formatDate(besok);
    tanggalPanenConf = 0.85;
    waktuLabel = `besok pagi (${formatDateDisplay(besok)}, pagi)`;
  } else if (textLower.includes("besok sore") || textLower.includes("bsok sore") || textLower.includes("besok sre")) {
    const besok = new Date();
    besok.setDate(today.getDate() + 1);
    tanggalPanenVal = formatDate(besok);
    tanggalPanenConf = 0.85;
    waktuLabel = `besok sore (${formatDateDisplay(besok)}, sore)`;
  } else if (textLower.includes("besok") || textLower.includes("bsok") || textLower.includes("bsk")) {
    const besok = new Date();
    besok.setDate(today.getDate() + 1);
    tanggalPanenVal = formatDate(besok);
    tanggalPanenConf = 0.80;
    waktuLabel = `besok (${formatDateDisplay(besok)})`;
  } else if (textLower.includes("minggu depan") || textLower.includes("mnggu dpn") || textLower.includes("minggu dpn")) {
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    tanggalPanenVal = formatDate(nextWeek);
    tanggalPanenConf = 0.75;
    waktuLabel = `minggu depan (${formatDateDisplay(nextWeek)})`;
  } else {
    // Check for day names: "hari senin", "jumat depan", "senin", etc.
    const dayNames = [
      { names: ['minggu', 'ahad'], day: 0 },
      { names: ['senin', 'snin'], day: 1 },
      { names: ['selasa', 'slasa', 'slsa'], day: 2 },
      { names: ['rabu', 'rbu'], day: 3 },
      { names: ['kamis', 'kmis', 'kmis'], day: 4 },
      { names: ['jumat', 'jmat', 'jumaah', 'jum\'at'], day: 5 },
      { names: ['sabtu', 'sbtu'], day: 6 }
    ];

    let matchedDay = null;
    for (const dayInfo of dayNames) {
      for (const name of dayInfo.names) {
        if (textLower.includes('hari ' + name) || textLower.includes(name + ' depan')) {
          matchedDay = dayInfo.day;
          break;
        }
        // Also check standalone day name in tokens
        for (const tok of tokens) {
          if (fuzzyMatch(tok.toLowerCase(), [name], 1) && tok.length > 3) {
            matchedDay = dayInfo.day;
            break;
          }
        }
        if (matchedDay !== null) break;
      }
      if (matchedDay !== null) break;
    }

    if (matchedDay !== null) {
      const targetDate = new Date();
      const currentDay = today.getDay();
      let daysUntil = matchedDay - currentDay;
      if (daysUntil <= 0) daysUntil += 7; // Next occurrence
      targetDate.setDate(today.getDate() + daysUntil);
      tanggalPanenVal = formatDate(targetDate);
      tanggalPanenConf = 0.75;
      const dayDisplayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      waktuLabel = `hari ${dayDisplayNames[matchedDay]} (${formatDateDisplay(targetDate)})`;
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
  // Determine if quantity uses estimated local unit
  const isEstimatedUnit = ['karung', 'ikat', 'pikul'].includes(satuanVal);
  const konversiInfo = konversiKg ? ` (~${konversiKg} kg, perkiraan)` : '';

  if (intent === "laporan_panen") {
    if (komoditasVal && jumlahVal) {
      if (isEstimatedUnit) {
        // Satuan lokal: tampilkan konversi + minta konfirmasi karena perkiraan
        csReply = `Halo Pak/Bu! Laporan panen ${komoditasVal} sebanyak ${jumlahVal} ${satuanVal}${konversiInfo} di ${desaVal || lokasiVal || 'lokasi Anda'} berhasil kami catat.` +
          `\n\n⚠️ Jumlah dalam satuan ${satuanVal} kami konversi secara perkiraan. ${catatanKonversi || ''}` +
          `\nMohon konfirmasi apakah perkiraan ini sudah sesuai. Balas YA jika benar, atau kirim jumlah dalam kg untuk koreksi.` +
          (waktuLabel ? `\n📅 Waktu panen: ${waktuLabel}` : '') +
          `\n\nTerima kasih! 🙏`;
      } else {
        csReply = `Halo Pak/Bu! Laporan panen ${komoditasVal} sebanyak ${jumlahVal} ${satuanVal || 'unit'} di ${desaVal || lokasiVal || 'lokasi Anda'} berhasil kami terima dan catat di database PanganDali.` +
          (waktuLabel ? `\n📅 Waktu panen: ${waktuLabel}` : '') +
          ` Terima kasih banyak atas kerjasamanya! 🙏`;
      }
    } else {
      csReply = `Laporan panen Anda terdeteksi oleh sistem kami. Agar dapat kami verifikasi dengan baik, mohon sertakan informasi komoditas dan jumlah hasil panennya ya Pak/Bu. Contoh: 'Panen cabai besar 300 kg'. Terima kasih!`;
    }
  } else if (intent === "pembatalan") {
    csReply = `Baik Pak/Bu, permintaan pembatalan laporan panen Anda telah kami terima. Laporan panen tersebut berhasil dinonaktifkan dari sistem PanganDali. 🚫`;
  } else if (intent === "update_panen") {
    csReply = `Baik Pak/Bu, revisi laporan panen Anda sudah kami terima dan data di database PanganDali telah diperbarui secara otomatis. Terima kasih! 🔄`;
  } else if (intent === "tanya_harga") {
    csReply = `Berikut harga acuan komoditas hortikultura hari ini (sumber: PIHPS):\n- Cabai Besar: Rp 33.000–37.000/kg\n- Kubis: Rp 8.000–12.000/kg\n- Terung: Rp 10.000–14.000/kg\n- Wortel: Rp 15.000–20.000/kg\n- Kembang Kol: Rp 18.000–25.000/kg\n\nHarga akhir adalah kesepakatan antara petani dan distributor. 📈`;
  } else if (intent === "tanya_transporter") {
    csReply = `Untuk pengiriman, tim PanganDali sedang mencarikan mitra logistik terdekat dari daerah Anda di koridor Selupu Rejang — Kota Bengkulu. Mitra logistik akan segera menghubungi Anda jika jadwal angkut sudah siap. 🚚`;
  } else if (intent === "tanya_status") {
    csReply = `Laporan panen Anda sedang menunggu validasi oleh petugas Dinas. Kami akan segera mengirimkan informasi mitra logistik yang akan menjemput hasil panen Anda. Mohon ditunggu ya Pak/Bu. ⏳`;
  } else if (intent === "percakapan_umum") {
    csReply = `Halo! Selamat datang di Layanan WhatsApp PanganDali. Saya adalah asisten yang bertugas mengumpulkan data panen petani secara terstruktur. Silakan kirimkan laporan panen Anda di sini! 😊`;
  } else {
    csReply = `Terima kasih atas pesan Anda. Silakan laporkan hasil panen Anda dengan format bebas, dan sistem kami akan mencatatnya ke database. Contoh: 'Panen cabai besar 300 kg di Lubuk Ubar'.`;
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
      konversi_kg: { value: konversiKg, confidence: konversiKg ? 0.70 : 0 },
      catatan_konversi: { value: catatanKonversi, confidence: catatanKonversi ? 1.0 : 0 },
      kualitas: { value: null, confidence: 0 },
      harga: { value: null, confidence: 0 },
      lokasi: { value: lokasiVal || desaVal, confidence: lokasiVal ? lokasiConf : (desaVal ? 0.80 : 0) },
      desa: { value: desaVal, confidence: desaConf },
      kecamatan: { value: desaVal ? "Selupu Rejang" : null, confidence: desaVal ? 0.90 : 0 },
      kabupaten: { value: desaVal ? "Rejang Lebong" : null, confidence: desaVal ? 0.90 : 0 },
      provinsi: { value: desaVal ? "Bengkulu" : null, confidence: desaVal ? 0.90 : 0 },
      tanggal_panen: { value: tanggalPanenVal, confidence: tanggalPanenConf },
      waktu_label: { value: waktuLabel, confidence: waktuLabel ? 0.85 : 0 },
      waktu_panen: { value: null, confidence: 0 },
      metode_pengiriman: { value: textLower.includes("ambil") ? "Ambil Sendiri" : null, confidence: textLower.includes("ambil") ? 0.90 : 0 },
      transporter: { value: null, confidence: 0 },
      koordinat: { value: null, confidence: 0 },
      catatan: { value: null, confidence: 0 }
    }
  };

  const cleanedData = {};
  Object.keys(result.data).forEach(key => {
    const isCoreField = ['komoditas', 'jumlah', 'satuan', 'desa', 'tanggal_panen', 'kualitas', 'konversi_kg', 'catatan_konversi', 'waktu_label'].includes(key);
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

// Preset message prompts for testing the PanganDali extractor
// Menggunakan 5 komoditas pilot, desa pilot, satuan lokal, dan waktu relatif
export const farmerPresets = [
  {
    title: "Kubis + Karung + Besok (Lubuk Ubar)",
    text: "panen kubis 3 karung besok pagi di Lubuk Ubar"
  },
  {
    title: "Cabai Besar + Pikul + Lusa",
    text: "cabe 2 pikul lusa"
  },
  {
    title: "Wortel + Ikat + Hari Jumat",
    text: "wortel 5 ikat hari jumat"
  },
  {
    title: "Terung 200 Kg (Kampung Baru)",
    text: "Pak saya panen terong 200 kg di Kampung Baru hari ini"
  },
  {
    title: "Kembang Kol + Typo",
    text: "panen blumkol 100 klo kmrn di ds mekar sari"
  },
  {
    title: "Cabai Besar + Typo Desa",
    text: "hsil panen cabe besar 150 kilo di lubukubar bsok sore"
  }
];
