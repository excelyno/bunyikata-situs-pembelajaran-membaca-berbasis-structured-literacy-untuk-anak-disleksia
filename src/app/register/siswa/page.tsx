"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterSiswaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nama: "", username: "", waliEmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // KUNCI ROLE SEBAGAI SISWA DI SINI
      body: JSON.stringify({ ...formData, role: "SISWA" }),
    });

    const data = await res.json();

    if (res.ok) {
  // Langsung lempar ke dashboard masing-masing tanpa alert login lagi
  if (data.role === "WALI") {
    router.push("/dashboard/wali");
  } else {
    router.push("/dashboard/siswa");
  }
} else {
  setError(data.error);
}
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-green-100 w-full max-w-md">
        
        <Link href="/register" className="text-green-500 font-bold mb-6 hover:text-green-700 flex items-center gap-2 transition-colors">
          &larr; Ganti Peran
        </Link>
        
        <h2 className="text-3xl font-black mb-2 text-green-700">Akun Siswa 🐸</h2>
        <p className="text-gray-500 mb-8 font-medium">Ayo belajar sambil bermain!</p>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input required type="text" placeholder="Nama Panggilanmu" 
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg"
            onChange={e => setFormData({...formData, nama: e.target.value})}
          />
          <input required type="text" placeholder="Username (Untuk Login)" 
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg"
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          
          <div className="bg-green-100/50 p-4 rounded-2xl border-2 border-green-200 mt-6">
            <label className="block text-sm font-black text-green-800 mb-2 uppercase tracking-wide">🔗 Email Wali / Guru</label>
            <input required type="email" placeholder="Ketik email walimu di sini..." 
              className="w-full p-3 border-2 border-white rounded-xl focus:border-green-500 focus:outline-none bg-white font-medium"
              onChange={e => setFormData({...formData, waliEmail: e.target.value})}
            />
            <p className="text-xs text-green-700 mt-2 font-medium">
              Ini penting biar walimu bisa melihat nilaimu nanti!
            </p>
          </div>

          <input required type="password" placeholder="Kata Sandi Rahasia" 
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-green-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg mt-6"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />

          <button type="submit" disabled={loading}
            className="w-full bg-green-500 text-white p-4 rounded-xl font-black text-xl hover:bg-green-600 transition-all shadow-[0_6px_0_#16a34a] active:translate-y-2 active:shadow-none mt-6 disabled:opacity-50"
          >
            {loading ? "Tunggu ya..." : "Mulai Petualangan! 🚀"}
          </button>
        </form>

      </div>
    </div>
  );
}