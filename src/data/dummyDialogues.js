export const transporterConfig = {
  contactName: "PanganDali Transporter",
  contactStatus: "Online",
  profilePic: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=150&q=80"
};

export const transporterMessages = [
  {
    id: 10001,
    text: "👋 Halo, Andi!\nSelamat datang di PanganDali Transporter.\nSaya akan membantu Anda menemukan muatan balik dan memperbarui status pengiriman.",
    type: "text",
    timestamp: "08:00",
    sender: "other",
    reactions: []
  },
  {
    id: 10002,
    text: "🔍 Sedang mencari muatan yang sesuai...",
    type: "text",
    timestamp: "08:00",
    sender: "other",
    reactions: []
  },
  {
    id: 10003,
    text: "✅ Ditemukan 2 rekomendasi.\n\n🚛 Rekomendasi #1\nKomoditas : Tomat\nBerat : 5 Ton\nAsal : Rejang Lebong\nTujuan : Jakarta\nPendapatan : Rp3.500.000\nKecocokan : 98%\nBalas AMBIL 1 untuk menerima.\n\n🚛 Rekomendasi #2\nKomoditas : Cabai Merah\nBerat : 3 Ton\nAsal : Curup\nTujuan : Palembang\nPendapatan : Rp2.600.000\nKecocokan : 91%\nBalas AMBIL 2 untuk menerima.",
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
    text: "✅ Order berhasil diterima.\nNomor Order : TRK-1024\nSilakan menuju lokasi pengambilan.\n📍 Jl. Sukowati, Rejang Lebong\n\nJika sudah sampai, kirim\nSAMPAI",
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
    text: "📍 Lokasi berhasil dikonfirmasi.\nSilakan lakukan proses muat barang.\n\nSetelah selesai, kirim\nMUAT",
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
    text: "📦 Barang berhasil dimuat.\nKomoditas : Tomat\nBerat : 5 Ton\nTujuan : Pasar Induk Kramat Jati, Jakarta\n\nSetelah kendaraan mulai berjalan kirim\nBERANGKAT",
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
    text: "🚚 Perjalanan dimulai.\nStatus pengiriman diperbarui.\n\nGPS terakhir\n📍 Lubuk Linggau\nWaktu\n08.42 WIB\n\nJika sudah tiba di tujuan kirim\nTIBA",
    type: "text",
    timestamp: "08:42",
    sender: "other",
    reactions: []
  },
  {
    id: 10012,
    text: "TIBA",
    type: "text",
    timestamp: "18:30",
    sender: "me",
    status: "read",
    reactions: []
  },
  {
    id: 10013,
    text: "📍 Kendaraan telah tiba di lokasi tujuan.\nSilakan lakukan proses bongkar muatan.\n\nSetelah barang diterima pembeli kirim\nSELESAI",
    type: "text",
    timestamp: "18:30",
    sender: "other",
    reactions: []
  },
  {
    id: 10014,
    text: "SELESAI",
    type: "text",
    timestamp: "19:15",
    sender: "me",
    status: "read",
    reactions: []
  },
  {
    id: 10015,
    text: "🎉 Pengiriman berhasil diselesaikan.\n\nRingkasan Pengiriman\n🚛 Order : TRK-1024\n📦 Komoditas : Tomat\n⚖️ Berat : 5 Ton\n💰 Ongkos : Rp3.500.000\n\n⭐ Terima kasih telah menjadi Mitra Transporter PanganDali.",
    type: "text",
    timestamp: "19:15",
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
  { id: 20004, text: "Baik, Pak Budi. 😊\nSilakan kirim data hasil panen dengan format berikut:\n📦 Komoditas\n⚖️ Jumlah\n📍 Lokasi Panen", type: "text", timestamp: "09:05", sender: "other", reactions: [] },
  { id: 20005, text: "Tomat, 5 Ton, Rejang Lebong", type: "text", timestamp: "09:10", sender: "me", reactions: [] },
  { id: 20006, text: "✅ Data hasil panen berhasil diterima.\n\nRingkasan Hasil Panen\n📦 Komoditas : Tomat\n⚖️ Jumlah : 5 Ton\n📍 Lokasi : Rejang Lebong\n\n📷 Untuk membantu proses verifikasi kualitas dan mempermudah pencarian pembeli, silakan kirim foto hasil panen.\n\nPastikan foto:\nMenampilkan komoditas dengan jelas.\nDiambil di lokasi penyimpanan atau lahan panen.\nTidak buram.\nTidak menggunakan filter.\n\nSilakan unggah foto hasil panen Anda.", type: "text", timestamp: "09:10", sender: "other", reactions: [] },
  { id: 20007, type: "image", mediaUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80", caption: "", timestamp: "09:15", sender: "me", reactions: [] },
  { id: 20008, text: "📷 Foto berhasil diterima.\n\n🤖 AI sedang menganalisis hasil panen...\n⏳ Mohon tunggu sebentar.", type: "text", timestamp: "09:15", sender: "other", reactions: [] },
  { id: 20009, text: "✅ Verifikasi berhasil.\n\nHasil Analisis AI\n🟢 Komoditas terdeteksi : Tomat\n🟢 Tingkat keyakinan : 98%\n🟢 Kondisi visual : Baik\n🟢 Perkiraan tingkat kematangan : Siap distribusi\n🟢 Tidak ditemukan kerusakan yang signifikan.\n\n🔍 Sistem sedang mencarikan pembeli yang membutuhkan komoditas Anda...", type: "text", timestamp: "09:16", sender: "other", reactions: [] },
  { id: 20010, text: "🎉 Kabar baik, Pak Budi!\nKami menemukan pembeli yang sesuai.\n\nDetail Penawaran\n🏬 Pembeli : Distributor Jakarta Fresh\n📍 Tujuan : Pasar Induk Kramat Jati, Jakarta\n💰 Harga : Rp7.800/kg\n💵 Estimasi Pendapatan : Rp39.000.000\n\nApakah Anda ingin menerima penawaran ini?\nBalas SETUJU atau TOLAK.", type: "text", timestamp: "09:17", sender: "other", reactions: [] },
  { id: 20011, text: "SETUJU", type: "text", timestamp: "09:25", sender: "me", reactions: [] },
  { id: 20012, text: "✅ Penawaran berhasil dikonfirmasi.\nNomor Transaksi: ORD-2048\n\n🚛 Kami sedang mencarikan transporter yang tersedia untuk mengambil hasil panen Anda.\nMohon tunggu sebentar.", type: "text", timestamp: "09:25", sender: "other", reactions: [] },
  { id: 20013, text: "🚛 Transporter berhasil ditemukan.\n\nInformasi Transporter\n👤 Sopir : Andi Saputra\n🚚 Kendaraan : Truk Box\n🕒 Estimasi tiba : 30 menit\n\nAnda akan menerima notifikasi saat transporter tiba di lokasi.", type: "text", timestamp: "09:30", sender: "other", reactions: [] },
  { id: 20014, text: "📍 Transporter telah tiba di lokasi panen.\nSilakan lakukan proses pemuatan barang.\nSetelah seluruh barang selesai dimuat, balas:\nMUAT SELESAI", type: "text", timestamp: "10:00", sender: "other", reactions: [] },
  { id: 20015, text: "MUAT SELESAI", type: "text", timestamp: "10:45", sender: "me", reactions: [] },
  { id: 20016, text: "✅ Barang berhasil dimuat ke kendaraan.\n🚚 Transporter telah memulai perjalanan menuju lokasi pembeli.\n\nAnda dapat memantau status pengiriman melalui notifikasi WhatsApp ini.", type: "text", timestamp: "10:45", sender: "other", reactions: [] },
  { id: 20017, text: "📍 Transporter telah tiba di lokasi pembeli.\nPembeli sedang melakukan pemeriksaan kualitas dan jumlah barang.\nMohon tunggu konfirmasi penerimaan.", type: "text", timestamp: "18:30", sender: "other", reactions: [] },
  { id: 20018, text: "🎉 Selamat, Pak Budi!\nPembeli telah mengonfirmasi bahwa barang diterima dalam kondisi baik.\n\nRingkasan Transaksi\n🆔 Order : ORD-2048\n📦 Komoditas : Tomat\n⚖️ Jumlah : 5 Ton\n🏬 Pembeli : Distributor Jakarta Fresh\n📍 Tujuan : Pasar Induk Kramat Jati, Jakarta\n💰 Harga : Rp7.800/kg\n💵 Total Penjualan : Rp39.000.000\n🚚 Status Pengiriman : Selesai ✅\n\n💳 Pembayaran akan diproses sesuai metode pembayaran yang telah Anda pilih.\n\nTerima kasih telah menggunakan PanganDali Farmer.\nSampai jumpa di musim panen berikutnya. 🌾", type: "text", timestamp: "19:00", sender: "other", reactions: [] }
];

export const distributorConfig = {
  contactName: "PanganDali Distributor",
  contactStatus: "Online",
  profilePic: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80"
};

export const distributorMessages = [
  { id: 30001, text: "Halo.", type: "text", timestamp: "10:00", sender: "me", reactions: [] },
  { id: 30002, text: "Halo, Bapak/Ibu Distributor! 👋\nSelamat datang di PanganDali Distributor.\nAda yang bisa saya bantu hari ini?", type: "text", timestamp: "10:00", sender: "other", reactions: [] },
  { id: 30003, text: "Saya lagi cari pasokan tomat sekitar 5 ton. Ada stok dari petani yang siap panen?", type: "text", timestamp: "10:05", sender: "me", reactions: [] },
  { id: 30004, text: "🔍 Sedang mencari pasokan tomat di sistem PanganDali...", type: "text", timestamp: "10:05", sender: "other", reactions: [] },
  { id: 30005, text: "✅ Ditemukan kecocokan pasokan panen!\n\n📋 Detail Panen\n🧑‍🌾 Petani: Budi (Rejang Lebong)\n📦 Komoditas: Tomat\n⚖️ Volume: 5 Ton\n📊 Kualitas: Grade A (Terverifikasi AI)\n💰 Harga Beli: Rp7.800/kg\n\nApakah Anda ingin mengambil pasokan ini?\nBalas AMBIL untuk konfirmasi.", type: "text", timestamp: "10:06", sender: "other", reactions: [] },
  { id: 30006, text: "AMBIL", type: "text", timestamp: "10:10", sender: "me", reactions: [] },
  { id: 30007, text: "✅ Pembelian berhasil dikonfirmasi.\nNomor Transaksi: ORD-2048\n\nSelanjutnya, apakah Anda ingin kami mencarikan armada truk logistik untuk mengirimkan tomat ini ke lokasi Anda di Jakarta?\nBalas CARI TRUK untuk melanjutkan.", type: "text", timestamp: "10:10", sender: "other", reactions: [] },
  { id: 30008, text: "CARI TRUK", type: "text", timestamp: "10:12", sender: "me", reactions: [] },
  { id: 30009, text: "🔍 Sedang mencari armada backhaul kosong (menuju Jakarta)...", type: "text", timestamp: "10:12", sender: "other", reactions: [] },
  { id: 30010, text: "🚛 Armada ditemukan!\n\n📋 Detail Transporter\n👤 Sopir: Andi Saputra\n🚚 Kendaraan: Truk Box (Kapasitas 6 Ton)\n📍 Rute: Rejang Lebong ➡️ Jakarta\n💰 Ongkos Kirim: Rp3.500.000\n\nApakah Anda menyetujui biaya logistik ini?\nBalas SETUJU untuk mengkonfirmasi penjemputan.", type: "text", timestamp: "10:13", sender: "other", reactions: [] },
  { id: 30011, text: "SETUJU", type: "text", timestamp: "10:15", sender: "me", reactions: [] },
  { id: 30012, text: "✅ Pengiriman dijadwalkan.\nSopir Andi Saputra sedang menuju lokasi petani untuk memuat 5 Ton Tomat.\n\nKami akan memberi tahu Anda ketika truk sudah dalam perjalanan.", type: "text", timestamp: "10:15", sender: "other", reactions: [] },
  { id: 30013, text: "🚚 Truk telah berangkat dari lokasi panen (Rejang Lebong) menuju gudang Anda di Jakarta.\nEstimasi tiba: 18:30 WIB.", type: "text", timestamp: "10:45", sender: "other", reactions: [] },
  { id: 30014, text: "📍 Truk telah tiba di lokasi Anda.\nSilakan lakukan proses bongkar dan periksa kualitas barang.\nJika semua sesuai, balas SELESAI.", type: "text", timestamp: "18:30", sender: "other", reactions: [] },
  { id: 30015, text: "SELESAI", type: "text", timestamp: "19:15", sender: "me", reactions: [] },
  { id: 30016, text: "🎉 Transaksi dan Pengiriman Selesai!\n\nTerima kasih telah menggunakan PanganDali untuk kebutuhan pasokan dan logistik Anda. Ketersediaan pangan aman, inflasi terjaga! 🇮🇩", type: "text", timestamp: "19:15", sender: "other", reactions: [] }
];
