# 🐸 BunyiKata - System Architecture Documentation

**BunyiKata** adalah platform terapi dan pembelajaran membaca berbasis *Structured Literacy* yang dirancang khusus untuk anak dengan disleksia. Sistem ini mengintegrasikan gamifikasi dengan analisis data mendalam untuk mendeteksi pola kesalahan (blind spots) dan memberikan rekomendasi terapi yang personal.

## 🏗️ Tech Stack

- **Frontend**: [Next.js 14 (App Router)](https://nextjs.org/) - Memberikan pengalaman Single Page Application (SPA) yang cepat dengan Server-Side Rendering (SSR) untuk keamanan data.
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - Untuk desain antarmuka yang modern, responsif, dan premium.
- **Backend**: [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Mengelola logika bisnis dan API secara serverless.
- **Database**: [SQLite](https://sqlite.org/) dengan [Prisma ORM](https://www.prisma.io/) - Memastikan integritas data dan kemudahan migrasi skema.
- **Authentication**: [JWT (JSON Web Token)](https://jwt.io/) - Disimpan dalam `httpOnly` cookies untuk keamanan maksimal terhadap serangan XSS.

---

## 🔐 Keamanan & Autentikasi
Sistem menggunakan Middleware Next.js untuk memproteksi rute:
- **Wali**: Mengakses `/dashboard/wali` untuk memantau data analitik.
- **Siswa**: Mengakses `/dashboard/siswa` dan rute `/games` untuk bermain dan belajar.
- **JWT**: Berisi `userId` dan `role` yang diverifikasi di setiap request API sensitif.

---

## 🗄️ Arsitektur Database (Prisma Schema)

Database BunyiKata dirancang untuk menangkap setiap detail interaksi siswa:

1.  **User**: Menyimpan identitas pengguna (Username, Password Hashed, Role). Relasi antara Siswa dan Wali dihubungkan melalui field `waliEmail`.
2.  **StudentStat**: Menyimpan data gamifikasi (XP, Level, Koin, Avatar). Data ini diupdate secara otomatis setiap kali siswa menyelesaikan sesi permainan.
3.  **GameSession**: Mencatat setiap sesi permainan (Pratest, Terapi Visual, Auditori, Motorik). Menyimpan skor total, durasi, dan status penyelesaian.
4.  **AnswerLog (The Brain)**: Tabel paling krusial. Mencatat setiap klik atau jawaban siswa:
    - `targetItem`: Apa yang seharusnya dijawab.
    - `answeredItem`: Apa yang dijawab oleh siswa.
    - `isCorrect`: Status benar/salah.
    - `responseTimeMs`: Kecepatan respon (indikator kelancaran kognitif).
    - `errorCategory`: Kategori kesalahan (contoh: `VISUAL_MIRIP`, `AUDITORI_FONEM`).

---

## 📡 API Architecture

### 1. Auth API (`/api/auth`)
- `POST /register`: Mendaftarkan user baru (Siswa/Wali).
- `POST /login`: Verifikasi kredensial dan menanamkan JWT Cookie.
- `POST /logout`: Menghapus cookie sesi.

### 2. Games API (`/api/games`)
- `POST /session`: Memulai sesi permainan baru.
- `POST /submit`: API utama untuk mengirimkan seluruh `logs` interaksi, menghitung penambahan XP/Koin, dan melakukan *level up*.

### 3. Dashboard Wali (`/api/dashboard/wali`)
- `GET /`: Mengambil data agregat seluruh anak yang terhubung.
- `GET /diagnosis`: Melakukan analisis mendalam pada `AnswerLog` untuk menghasilkan statistik Radar Chart (5 sumbu: Motorik, Fonik, Auditori, Menulis, Visual).

---

## 🔄 Alur Pengambilan Data & Decision Making

Proses transformasi data mentah menjadi keputusan (diagnosis) mengikuti alur berikut:

### Step 1: Data Capture (Frontend)
Saat siswa bermain, setiap interaksi (misal: klik huruf 'b' saat diminta 'd') direkam beserta waktu responnya dalam milidetik.

### Step 2: Synchronization (Submit API)
Data dikirim ke server. Server menyimpan ribuan `AnswerLog` yang nantinya akan menjadi basis data statistik.

### Step 3: Analysis & Aggregation (Backend Logic)
Saat Wali membuka Dashboard, Backend melakukan query agregasi:
- **Akurasi**: `(Jumlah Benar / Total Interaksi) * 100` per kategori.
- **Blind Spot Detection**: Mengidentifikasi pasangan `targetItem` vs `answeredItem` yang paling sering muncul (contoh: Siswa 80% salah saat membedakan 'p' dan 'q').
- **Response Time Analysis**: Jika akurasi tinggi tapi `responseTime` lambat, ini mengindikasikan siswa masih kesulitan dalam *automaticity* (kelancaran).

### Step 4: Result & Decision (Personalized Recommendation)
Hasil akhir disajikan dalam bentuk:
- **Radar Chart**: Menunjukkan keseimbangan kemampuan anak.
- **Blind Spot Alert**: Memberitahu Wali secara spesifik di mana anak sering bingung.
- **Therapy Recommendation**: Sistem otomatis menyarankan game terapi tertentu (misal: "Latihan Visual Level 2") berdasarkan area dengan akurasi terendah.

---

## 🚀 Cara Menjalankan Project

1.  **Install Dependencies**: `npm install`
2.  **Setup Database**: `npx prisma db push`
3.  **Run Development**: `npm run dev`
4.  **Akses**: Buka `http://localhost:3000`

---

**BunyiKata** - *Membantu setiap anak menemukan suaranya melalui teknologi.*
