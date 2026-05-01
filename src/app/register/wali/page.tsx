"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterWaliPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nama: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // KUNCI ROLE SEBAGAI WALI DI SINI
      body: JSON.stringify({ ...formData, role: "WALI" }), 
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
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-indigo-100 w-full max-w-md">
        
        <Link href="/register" className="text-indigo-400 font-bold mb-6 hover:text-indigo-700 flex items-center gap-2 transition-colors">
          &larr; Ganti Peran
        </Link>
        
        <h2 className="text-3xl font-black mb-2 text-indigo-900">Akun Wali 👨‍👩‍👧</h2>
        <p className="text-gray-500 mb-8 font-medium">Pantau perkembangan anak dengan mudah.</p>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input required type="text" placeholder="Nama Lengkap" 
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
            onChange={e => setFormData({...formData, nama: e.target.value})}
          />
          <input required type="email" placeholder="Alamat Email Aktif" 
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input required type="text" placeholder="Username (Untuk Login)" 
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <input required type="password" placeholder="Buat Password" 
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black text-lg hover:bg-indigo-700 transition-all shadow-[0_4px_0_#4338ca] active:translate-y-1 active:shadow-none mt-4 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Daftar Sebagai Wali"}
          </button>
        </form>

      </div>
    </div>
  );
}