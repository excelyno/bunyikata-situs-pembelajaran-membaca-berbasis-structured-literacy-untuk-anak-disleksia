import Link from "next/link";
import Image from "next/image";
import HeroImage from "../../public/hero/gorogu-landing.png"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8EF]">
      {/* HERO */}
      <section className="h-screen max-w-7xl mx-auto p-4 md:p-10 flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-2 items-center gap-4 md:gap-10 w-full max-h-full">
          
          {/* LEFT CONTENT */}
          <div className="text-left flex flex-col justify-center h-full">
            <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-[#4A3527]">
              Belajar Membaca
              <br />
              Jadi Lebih{" "}
              <span className="text-orange-500">Mudah,</span>
              <br />
              <span className="text-green-600">Seru,</span>
              <br className="hidden sm:block" /> dan Bermakna
            </h1>

            <p className="mt-2 md:mt-6 text-[10px] sm:text-sm md:text-lg text-[#6B5A4B] leading-relaxed max-w-xl">
              BunyiKata membantu anak disleksia belajar membaca
              dengan metode visual, audio, dan permainan interaktif.
            </p>

            {/* CTA */}
            <div className="flex flex-row gap-2 md:gap-4 mt-4 md:mt-10">
              <Link
                href="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-2 md:px-8 md:py-4 rounded-lg md:rounded-2xl shadow-lg transition text-[10px] sm:text-sm md:text-lg whitespace-nowrap"
              >
                Mulai Belajar
              </Link>

              <Link
                href="/login"
                className="bg-white border md:border-2 border-orange-200 hover:border-orange-400 text-[#5A3E2B] font-bold px-3 py-2 md:px-8 md:py-4 rounded-lg md:rounded-2xl transition text-[10px] sm:text-sm md:text-lg"
              >
                Masuk
              </Link>
            </div>
          </div>

          {/* RIGHT CONTENT (MASCOT) */}
          <div className="relative flex justify-center items-center h-full">
            {/* MAIN CARD - Scaled down for mobile */}
            <div className="relative z-10 w-full max-w-[140px] sm:max-w-[280px] md:max-w-[400px] lg:max-w-[500px] aspect-square bg-[#FFF4E5] rounded-[20px] sm:rounded-[32px] md:rounded-[48px] p-2 sm:p-4 md:p-8 shadow-xl border border-orange-100 flex items-center justify-center">
              
              <Image 
                src={HeroImage} 
                alt="Mascot" 
                className="w-full h-auto object-contain"
                priority
              />

              {/* FLOATING WORDS - Scaled down */}
              {/* ba */}
              <div className="absolute -top-2 -left-2 sm:top-[15%] sm:left-[5%] rotate-[-12deg] z-20">
                <div className="bg-white px-1.5 py-0.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-2xl shadow-md border border-orange-50">
                  <span className="text-[10px] sm:text-2xl md:text-[36px] font-black text-orange-500">
                    ba
                  </span>
                </div>
              </div>

              {/* me */}
              <div className="absolute -bottom-1 -right-1 sm:bottom-[15%] sm:right-[5%] rotate-[10deg] z-20">
                <div className="bg-white px-1.5 py-0.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-2xl shadow-md border border-green-50">
                  <span className="text-[10px] sm:text-2xl md:text-[36px] font-black text-green-500">
                    me
                  </span>
                </div>
              </div>

              {/* si */}
              <div className="absolute bottom-[10%] -left-1 sm:bottom-[10%] sm:left-[15%] rotate-[-8deg] z-20">
                <div className="bg-white px-1.5 py-0.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-2xl shadow-md border border-blue-50">
                  <span className="text-[10px] sm:text-2xl md:text-[36px] font-black text-blue-500">
                    si
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}