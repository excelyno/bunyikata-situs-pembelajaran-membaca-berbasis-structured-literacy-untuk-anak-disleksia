import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-6xl md:text-7xl font-black text-blue-600 mb-6 tracking-tight">
          BunyiKata
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12 font-medium leading-relaxed">
          Tempat seru untuk belajar membaca bagi anak Disleksia. 
          Bermain, belajar, dan berkembang bersama AI!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 px-10 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95">
            Daftar Akun Baru
          </Link>
          <Link href="/login" className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-bold text-xl py-4 px-10 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95">
            Masuk / Login
          </Link>
        </div>
      </div>
    </main>
  );
}