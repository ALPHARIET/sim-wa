export const transporterConfig = {
  contactName: "PanganDali Mitra Logistik",
  contactStatus: "Online",
  profilePic: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=150&q=80"
};

export const transporterMessages = [
  {
    id: 10001,
    text: "👋 Halo, Andi!\nSelamat datang di PanganDali Mitra Logistik.\nSaya akan membantu Anda menemukan muatan balik dan memperbarui status pengiriman di koridor logistik Rejang Lebong ➡️ Kota Bengkulu.",
    type: "text",
    timestamp: "08:00",
    sender: "other",
    reactions: []
  },
  {
    id: 10002,
    text: "🔍 Sedang mencari muatan balik di rute Selupu Rejang — Kota Bengkulu...",
    type: "text",
    timestamp: "08:00",
    sender: "other",
    reactions: []
  },
  {
    id: 10003,
    text: "✅ Ditemukan 2 rekomendasi muatan.\n\n🚛 Rekomendasi #1\nKomoditas : Cabai Besar\nBerat : 300 kg\nAsal : Desa Lubuk Ubar, Selupu Rejang\nTujuan : Pasar Panorama, Kota Bengkulu\nTarif : Sesuai kesepakatan\nSkor Kecocokan Rute : 98%\nBalas AMBIL 1 untuk menerima.\n\n🚛 Rekomendasi #2\nKomoditas : Kubis\nBerat : 1,5 Ton\nAsal : Curup, Rejang Lebong\nTujuan : Pasar Panorama, Kota Bengkulu\nTarif : Sesuai kesepakatan\nSkor Kecocokan Rute : 91%\nBalas AMBIL 2 untuk menerima.",
    type: "text",
    timestamp: "08:01",
    sender: "other",
    reactions: []
  },
  {
    id: 10004,
    text: "AMBIL 1",
    type: "text",
    timestamp: "08:05",
    sender: "me",
    status: "read",
    reactions: []
  },
  {
    id: 10005,
    text: "✅ Order berhasil diterima.\nNomor Order : TRK-1024\nSilakan menuju lokasi penjemputan.\n📍 Desa Lubuk Ubar, Kec. Selupu Rejang, Kab. Rejang Lebong\n\nJika sudah sampai di lokasi petani, kirim\nSAMPAI",
    type: "text",
    timestamp: "08:05",
    sender: "other",
    reactions: []
  },
  {
    id: 10006,
    text: "SAMPAI",
    type: "text",
    timestamp: "08:20",
    sender: "me",
    status: "read",
    reactions: []
  },
  {
    id: 10007,
    text: "📍 Lokasi penjemputan berhasil dikonfirmasi.\nSilakan lakukan pemuatan barang bersama petani.\n\nSetelah muat barang selesai, kirim\nMUAT",
    type: "text",
    timestamp: "08:20",
    sender: "other",
    reactions: []
  },
  {
    id: 10008,
    text: "MUAT",
    type: "text",
    timestamp: "08:40",
    sender: "me",
    status: "read",
    reactions: []
  },
  {
    id: 10009,
    text: "📦 Barang berhasil dimuat.\nKomoditas : Cabai Besar\nBerat : 300 kg\nTujuan : Pasar Panorama, Kota Bengkulu\n\nSetelah armada mulai berjalan kirim\nBERANGKAT",
    type: "text",
    timestamp: "08:40",
    sender: "other",
    reactions: []
  },
  {
    id: 10010,
    text: "BERANGKAT",
    type: "text",
    timestamp: "08:42",
    sender: "me",
    status: "read",
    reactions: []
  },
  {
    id: 10011,
    text: "🚚 Perjalanan dimulai.\nStatus pengiriman diperbarui di sistem PanganDali.\n\nGPS terakhir\n📍 Kepahiang (Koridor Selupu Rejang ➡️ Kota Bengkulu)\nWaktu\n09:15 WIB\n\nJika sudah tiba di tujuan kirim\nTIBA",
    type: "text",
    timestamp: "08:42",
    sender: "other",
    reactions: []
  },
  {
    id: 10012,
    text: "TIBA",
    type: "text",
    timestamp: "10:45",
    sender: "me",
    status: "read",
    reactions: []
  },
  {
    id: 10013,
    text: "📍 Kendaraan telah tiba di lokasi tujuan (Pasar Panorama, Kota Bengkulu).\nSilakan lakukan proses pembongkaran barang.\n\nSetelah barang diterima pembeli, kirim\nSELESAI",
    type: "text",
    timestamp: "10:45",
    sender: "other",
    reactions: []
  },
  {
    id: 10014,
    text: "SELESAI",
    type: "text",
    timestamp: "11:15",
    sender: "me",
    status: "read",
    reactions: []
  },
  {
    id: 10015,
    text: "🎉 Pengiriman berhasil diselesaikan.\n\nRingkasan Pengiriman\n🚛 Order : TRK-1024\n📦 Komoditas : Cabai Besar\n⚖️ Berat : 300 kg\n📍 Rute : Selupu Rejang ➡️ Kota Bengkulu\n💰 Ongkos Kirim : Sesuai kesepakatan\n\n⭐ Terima kasih telah menjadi Mitra Logistik PanganDali.",
    type: "text",
    timestamp: "11:15",
    sender: "other",
    reactions: []
  }
];

export const farmerConfig = {
  contactName: "PanganDali Farmer",
  contactStatus: "Online",
  profilePic: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=150&q=80"
};

export const farmerMessages = [
  { id: 20001, text: "Halo.", type: "text", timestamp: "09:00", sender: "me", reactions: [] },
  { id: 20002, text: "Halo, Pak Budi! 👋\nSelamat datang di PanganDali Farmer.\nAda yang bisa saya bantu hari ini?", type: "text", timestamp: "09:00", sender: "other", reactions: [] },
  { id: 20003, text: "Saya mau lapor hasil panen.", type: "text", timestamp: "09:05", sender: "me", reactions: [] },
  { id: 20004, text: "Baik, Pak Budi. 😊\nSilakan kirim data hasil panen dengan format berikut:\n📦 Komoditas\n⚖️ Jumlah\n📍 Lokasi Panen (Desa)", type: "text", timestamp: "09:05", sender: "other", reactions: [] },
  { id: 20005, text: "Cabai Besar, 300 kg, Desa Lubuk Ubar", type: "text", timestamp: "09:10", sender: "me", reactions: [] },
  { id: 20006, text: "✅ Data hasil panen berhasil diterima.\n\nRingkasan Hasil Panen (Ekstraksi NER)\n📦 Komoditas : Cabai Besar (Confidence 99%)\n⚖️ Jumlah : 300 kg (Confidence 95%)\n📍 Lokasi : Desa Lubuk Ubar, Kec. Selupu Rejang\n\n📷 Silakan kirimkan foto hasil panen Anda sebagai bukti pendukung untuk verifikasi kewajaran oleh petugas Dinas.", type: "text", timestamp: "09:10", sender: "other", reactions: [] },
  { id: 20007, type: "image", mediaUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80", caption: "", timestamp: "09:15", sender: "me", reactions: [] },
  { id: 20008, text: "📷 Foto berhasil diterima sebagai bukti pendukung.\n\n📋 Status: Menunggu validasi petugas Dinas Pertanian.\nLaporan dan foto panen Anda sedang diverifikasi oleh petugas.", type: "text", timestamp: "09:15", sender: "other", reactions: [] },
  { id: 20009, text: "✅ Laporan Panen Tervalidasi oleh Petugas Dinas.\n\nDetail Hasil Validasi:\n🟢 Komoditas : Cabai Besar\n🟢 Volume : 300 kg\n🟢 Status : Terverifikasi Layak Distribusi\n\n📢 Ada penawaran dari distributor terverifikasi di PanganDali!", type: "text", timestamp: "09:16", sender: "other", reactions: [] },
  { id: 20010, text: "🏬 Penawaran dari Distributor Terverifikasi:\n\n👤 Distributor : PT Bengkulu Pangan Utama\n📍 Pasar Tujuan : Pasar Panorama, Kota Bengkulu\n💰 Harga Penawaran : Rp35.000/kg\n💵 Estimasi Pendapatan : Rp10.500.000\n📈 Price Reference (PIHPS) : Rp33.000 - Rp37.000/kg\n(Catatan: Harga akhir adalah kesepakatan petani-distributor)\n\nApakah Anda menerima penawaran ini?\nBalas SETUJU atau TOLAK.", type: "text", timestamp: "09:17", sender: "other", reactions: [] },
  { id: 20011, text: "SETUJU", type: "text", timestamp: "09:25", sender: "me", reactions: [] },
  { id: 20012, text: "✅ Penawaran berhasil dikonfirmasi.\nNomor Transaksi: ORD-2048\nStok sebesar 300 kg telah di-reservasi untuk Distributor PT Bengkulu Pangan Utama.\n\nMenunggu unggah bukti transfer pembayaran dari distributor...", type: "text", timestamp: "09:26", sender: "other", reactions: [] },
  { id: 20013, text: "🧾 Distributor telah mengunggah bukti transfer pembayaran!\nNomor Transaksi : ORD-2048\nNilai Transfer : Rp10.500.000\n\n📌 *Catatan Sistem PanganDali:* PanganDali HANYA MENCATAT dan MENAMPILKAN status pembayaran, tidak menyimpan maupun mentransfer dana.\n\nMohon periksa rekening/penerimaan dana Anda. Jika dana sudah masuk, balas TERIMA untuk konfirmasi penerimaan.", type: "text", timestamp: "09:28", sender: "other", reactions: [] },
  { id: 20014, text: "TERIMA", type: "text", timestamp: "09:29", sender: "me", reactions: [] },
  { id: 20015, text: "✅ Penerimaan dana berhasil dikonfirmasi!\nStatus Pembayaran : TERBAYAR (Dikonfirmasi Petani) ✅\n\n🚚 Mitra Logistik sedang menuju ke Desa Lubuk Ubar untuk penjemputan barang.\nSopir: Andi Saputra (Mitra Logistik)\nEstimasi tiba: 30 menit.", type: "text", timestamp: "09:30", sender: "other", reactions: [] },
  { id: 20016, text: "📍 Mitra Logistik telah tiba di lokasi panen.\nSilakan muat 300 kg Cabai Besar ke armada.\n\nSetelah pemuatan selesai, balas:\nMUAT SELESAI", type: "text", timestamp: "10:00", sender: "other", reactions: [] },
  { id: 20017, text: "MUAT SELESAI", type: "text", timestamp: "10:30", sender: "me", reactions: [] },
  { id: 20018, text: "🎉 Transaksi dan Pengiriman Selesai!\n\nRingkasan Transaksi\n🆔 Order : ORD-2048\n📦 Komoditas : Cabai Besar\n⚖️ Jumlah : 300 kg\n🏬 Pembeli : PT Bengkulu Pangan Utama\n📍 Tujuan : Pasar Panorama, Kota Bengkulu\n💰 Harga Agreed : Rp35.000/kg\n💵 Total Penjualan : Rp10.500.000\n💳 Pembayaran : Terverifikasi oleh Petani ✅\n🚚 Pengiriman : Selesai ✅\n\nTerima kasih telah menggunakan PanganDali Farmer.\nSampai jumpa di musim panen berikutnya! 🌾", type: "text", timestamp: "11:30", sender: "other", reactions: [] }
];

export const distributorConfig = {
  contactName: "PanganDali Distributor",
  contactStatus: "Online",
  profilePic: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80"
};

export const distributorMessages = [
  { id: 30001, text: "Halo.", type: "text", timestamp: "10:00", sender: "me", reactions: [] },
  { id: 30002, text: "Halo, Bapak/Ibu Distributor! 👋\nSelamat datang di PanganDali Distributor.\nAda yang bisa saya bantu hari ini?", type: "text", timestamp: "10:00", sender: "other", reactions: [] },
  { id: 30003, text: "Saya lagi cari pasokan cabai besar sekitar 300 kg untuk Pasar Panorama Kota Bengkulu.", type: "text", timestamp: "10:05", sender: "me", reactions: [] },
  { id: 30004, text: "🔍 Sedang mencari pasokan Cabai Besar tervalidasi di Selupu Rejang...", type: "text", timestamp: "10:05", sender: "other", reactions: [] },
  { id: 30005, text: "✅ Ditemukan pasokan tervalidasi!\n\n📋 Detail Stok Panen\n🧑‍🌾 Petani: Budi (Desa Lubuk Ubar, Selupu Rejang)\n📦 Komoditas: Cabai Besar\n⚖️ Volume: 300 kg\n📋 Validasi: Tervalidasi Petugas Dinas\n📈 Harga Acuan PIHPS: Rp33.000 - Rp37.000/kg\n\nSilakan ajukan harga penawaran atau balas AMBIL untuk mengajukan harga Rp35.000/kg.", type: "text", timestamp: "10:06", sender: "other", reactions: [] },
  { id: 30006, text: "AMBIL", type: "text", timestamp: "10:10", sender: "me", reactions: [] },
  { id: 30007, text: "✅ Permintaan & Reservasi Stok Berhasil Dibuat.\nNomor Transaksi: ORD-2048\n\n📄 PO / Invoice Sementara telah diterbitkan:\n- Barang: Cabai Besar (300 kg)\n- Petani: Budi (Lubuk Ubar)\n- Total Tagihan: Rp10.500.000\n\n📌 *Catatan Sistem PanganDali:* PanganDali HANYA MENCATAT dan MENAMPILKAN status pembayaran, tidak menyimpan maupun mentransfer dana.\n\nSilakan transfer langsung ke petani dan unggah foto bukti transfer di sini.", type: "text", timestamp: "10:11", sender: "other", reactions: [] },
  { id: 30008, type: "document", fileName: "Bukti_Transfer_ORD2048.pdf", fileSize: "215 KB", fileExtension: "PDF", timestamp: "10:13", sender: "me", reactions: [] },
  { id: 30009, text: "🧾 Bukti transfer berhasil diunggah!\nStatus Pembayaran : Menunggu Konfirmasi Petani ⏳\n\nNotifikasi telah dikirimkan ke petani (Pak Budi) untuk mengonfirmasi penerimaan dana.", type: "text", timestamp: "10:14", sender: "other", reactions: [] },
  { id: 30010, text: "✅ Petani telah mengonfirmasi penerimaan dana (TERIMA)!\nStatus Pembayaran : LUNAS / TERBAYAR ✅\n\n🚛 Selanjutnya, mencarikan Mitra Logistik backhaul (Selupu Rejang ➡️ Kota Bengkulu)...", type: "text", timestamp: "10:15", sender: "other", reactions: [] },
  { id: 30011, text: "🚛 Mitra Logistik Ditemukan!\n\n📋 Detail Mitra Logistik\n👤 Sopir: Andi Saputra\n🚚 Kendaraan: Truk Box / Pickup\n📍 Rute: Selupu Rejang ➡️ Pasar Panorama, Kota Bengkulu\n💰 Biaya Logistik: Sesuai kesepakatan\n⭐ Skor Kecocokan Rute: 98%\n\nBalas SETUJU TRUK untuk konfirmasi penjemputan.", type: "text", timestamp: "10:16", sender: "other", reactions: [] },
  { id: 30012, text: "SETUJU TRUK", type: "text", timestamp: "10:18", sender: "me", reactions: [] },
  { id: 30013, text: "✅ Pengiriman dijadwalkan.\nMitra Logistik Andi Saputra sedang menuju ke Desa Lubuk Ubar untuk memuat 300 kg Cabai Besar.", type: "text", timestamp: "10:19", sender: "other", reactions: [] },
  { id: 30014, text: "🚚 Armada telah berangkat dari Selupu Rejang menuju Pasar Panorama, Kota Bengkulu.\nEstimasi tiba: 11:15 WIB.", type: "text", timestamp: "10:45", sender: "other", reactions: [] },
  { id: 30015, text: "📍 Armada telah tiba di lokasi Anda (Pasar Panorama, Kota Bengkulu).\nSilakan terima barang dan periksa kesesuaian.\nJika barang sudah diterima, balas SELESAI.", type: "text", timestamp: "11:15", sender: "other", reactions: [] },
  { id: 30016, text: "SELESAI", type: "text", timestamp: "11:20", sender: "me", reactions: [] },
  { id: 30017, text: "🎉 Transaksi dan Pengiriman Selesai!\n\nTerima kasih telah menggunakan PanganDali untuk kebutuhan pasokan dan logistik Anda. Ketersediaan pangan aman, inflasi terjaga! 🇮🇩", type: "text", timestamp: "11:21", sender: "other", reactions: [] }
];
