import Link from "next/link";

export default function RegisterPilihanPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4 font-sans">
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 w-full max-w-md text-center">
        
        <h1 className="text-3xl font-black text-gray-800 mb-2">Pilih Peranmu 👋</h1>
        <p className="text-gray-500 mb-10 font-medium">Kamu mau mendaftar sebagai siapa?</p>
        
        <div className="flex flex-col gap-5">
          <Link 
            href="/register/wali"
            className="block bg-indigo-50 text-indigo-600 p-6 rounded-3xl font-black text-xl hover:bg-indigo-500 hover:text-white transition-all border-4 border-indigo-100 hover:border-indigo-600 active:scale-95 shadow-sm"
          >
            👨‍👩‍👧 Orang Tua / Guru
          </Link>

          <Link 
            href="/register/siswa"
            className="block bg-green-50 text-green-600 p-6 rounded-3xl font-black text-xl hover:bg-green-500 hover:text-white transition-all border-4 border-green-100 hover:border-green-600 active:scale-95 shadow-sm"
          >
            👦 Anak (Siswa)
          </Link>
        </div>
        
        <p className="mt-10 text-sm text-gray-400 font-medium">
          Sudah punya akun? <Link href="/login" className="text-blue-500 font-bold hover:underline">Masuk di sini</Link>
        </p>

      </div>
    </div>
  );
}