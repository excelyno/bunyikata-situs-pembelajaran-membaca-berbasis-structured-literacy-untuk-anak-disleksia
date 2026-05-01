import Link from "next/link";

export default function RegisterPilihanPage() {
  return (
    // Menggunakan background krem lembut sesuai gambar
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-4 font-sans relative overflow-hidden">
      
      {/* Dekorasi elemen organik di pojok (opsional, untuk memperkuat tema) */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#FDE9D2] rounded-full -translate-x-10 -translate-y-10" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#EF953322] rounded-full translate-x-5 translate-y-5" />

      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-lg border-b-8 border-gray-100 w-full max-w-md text-center z-10">

        <h1 className="text-3xl font-black text-[#5C4033] mb-3">Pilih Peranmu </h1>
        <p className="text-[#8D7B68] mb-10 font-medium">Kamu mau mendaftar sebagai siapa?</p>
        
        <div className="flex flex-col gap-5">
          {/* Opsi Orang Tua / Guru */}
          <Link 
            href="/register/wali"
            className="group block bg-[#FFF4E8] text-[#5C4033] p-6 rounded-[30px] font-black text-xl hover:bg-[#EF9533] hover:text-white transition-all border-2 border-[#FDE9D2] hover:border-[#D17A20] active:scale-95 shadow-md"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform"></div>
            Orang Tua / Guru
          </Link>

          {/* Opsi Anak (Siswa) */}
          <Link 
            href="/register/siswa"
            className="group block bg-[#F5F5F5] text-[#5C4033] p-6 rounded-[30px] font-black text-xl hover:bg-[#8D7B68] hover:text-white transition-all border-2 border-gray-200 hover:border-[#5C4033] active:scale-95 shadow-md"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform"></div>
            Anak (Siswa)
          </Link>
        </div>
        
        <p className="mt-12 text-sm text-[#8D7B68] font-medium">
          Sudah punya akun? <Link href="/login" className="text-[#EF9533] font-bold hover:underline">Masuk di sini</Link>
        </p>

      </div>
    </div>
  );
}