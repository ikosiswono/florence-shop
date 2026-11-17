# Florence Network — Official Minecraft Bedrock Web Store & Server Hub

Website resmi dan Web Store terintegrasi untuk **Florence Network (Minecraft Bedrock Server)**. Dibangun menggunakan Next.js App Router, Tailwind CSS, TypeScript, dan sistem integrasi transaksi real-time & Google Sheets / Google Apps Script.

---

## 🌟 Fitur Utama Website & Store

1. **Sistem Akun & Autentikasi Gamertag Minecraft Bedrock**:
   - Pendaftaran & login aman menggunakan Gamertag Bedrock resmi.
   - Sinkronisasi profil avatar gamertag otomatis via Crafatar / Minotar API.
   - User Dashboard pribadi: melihat riwayat transaksi, status pesanan, gamertag aktif, dan kupon diskon.

2. **Katalog Rank Per-Season & Item Benefit Eksklusif**:
   - Sistem rank berbasis masa aktif season (bukan lifetime/permanen).
   - Penjelasan benefit in-game yang rapi: uang in-game, prefix chat, command akses via format chat khusus (contoh: `+heal`, `+fly`, `+feed`).
   - Tidak membocorkan nama item mentah, melainkan menyajikan benefit eksklusif rank secara rapi dan profesional.

3. **Keranjang Belanja & Checkout Multi-Item**:
   - Sistem cart drawer interaktif.
   - Input voucher diskon & catatan khusus order.
   - Terintegrasi QRIS pembayaran instan otomatis.

4. **Kuitansi / Invoice Digital Resmi (INV-XXXXX)**:
   - Pelacak status invoice real-time (`/lacak-invoice`).
   - Fitur cetak & unduh Kuitansi Pembayaran berformat gambar beresolusi tinggi (PNG/Canvas) dengan watermark resmi, stempel status "LUNAS", dan tombol kirim invoice ke WhatsApp Admin secara langsung.

5. **Server Info Real-time**:
   - **Server IP**: `game-gnl-jh3.raznar.net`
   - **Port**: `9242`
   - Fitur salin IP dan Port dengan satu klik.

---

## 🛠️ Cara Menjalankan Project

```bash
# Install dependencies (jika baru pertama kali di clone)
npm install

# Jalankan server development
npm run dev

# Build produksi
npm run build

# Jalankan server produksi
npm run start
```

Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🚀 Push / Upload ke GitHub

Jika sudah memiliki repository kosong di GitHub:
```bash
git remote add origin https://github.com/<USERNAME>/<NAMA_REPO>.git
git push -u origin main
```
