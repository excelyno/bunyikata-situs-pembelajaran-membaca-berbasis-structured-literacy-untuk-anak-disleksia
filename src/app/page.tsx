import Link from "next/link";
import Image from "next/image";
import HeroImage from "../../public/hero/gorogu-landing.png"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8EF]">
      {/* HERO */}
      <section className="max-w-7xl mx-auto p-6 lg:py-24">
        <div className="grid lg:grid-cols-2 items-center gap-14">
          
          {/* LEFT */}
          <div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight text-[#4A3527]">
              Belajar Membaca
              <br />
              Jadi Lebih{" "}
              <span className="text-orange-500">
                Mudah,
              </span>
              <br />
              <span className="text-green-600">
                Seru,
              </span>{" "}
              dan Bermakna
            </h1>

            <p className="mt-6 text-lg text-[#6B5A4B] leading-relaxed max-w-xl">
              BunyiKata membantu anak disleksia belajar membaca
              dengan metode visual, audio, dan permainan interaktif
              yang ramah anak.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                href="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl transition text-center"
              >
                Mulai Belajar
              </Link>

              <a
                href="/login"
                className="bg-white border-2 border-orange-200 hover:border-orange-400 text-[#5A3E2B] font-bold px-8 py-4 rounded-2xl transition text-center"
              >
                Masuk
              </a>
            </div>

            {/* MINI STATS */}
            <div className="flex gap-6 mt-12 flex-wrap">
              
              <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-orange-100">
                <h3 className="text-2xl font-black text-orange-500">
                  10+
                </h3>

                <p className="text-sm text-gray-500">
                  Mini Games
                </p>
              </div>

              <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-orange-100">
                <h3 className="text-2xl font-black text-green-600">
                  AI
                </h3>

                <p className="text-sm text-gray-500">
                  Adaptive Learning
                </p>
              </div>

              <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-orange-100">
                <h3 className="text-2xl font-black text-blue-500">
                  SD
                </h3>

                <p className="text-sm text-gray-500">
                  Ramah Anak
                </p>
              </div>
            </div>
          </div>

        {/* RIGHT */}
        <div className="relative flex justify-center items-center">
          
          {/* background */}
          <div className="w-[520px] h-[520px] rounded-[48px] bg-[#EFE5D8] relative overflow-hidden shadow-xl">
            
            {/* MAIN CARD */}
            <div className="relative z-10 bg-[#FFF4E5] rounded-[40px] p-8 shadow-2xl border border-orange-100">

              <Image src={HeroImage} alt="" />
 {/* FLOATING WORDS */}

    {/* ba */}
    <div className="absolute top-[70px] left-[10px] rotate-[-12deg] z-20">
      <div className="bg-white px-5 py-3 rounded-3xl shadow-lg">
        <span className="text-[42px] font-black text-orange-500">
          ba
        </span>
      </div>
    </div>

    {/* me */}
    <div className="absolute bottom-[90px] right-[20px] rotate-[10deg] z-20">
      <div className="bg-white px-5 py-3 rounded-3xl shadow-lg">
        <span className="text-[42px] font-black text-green-500">
          me
        </span>
      </div>
    </div>

    {/* si */}
    <div className="absolute bottom-[40px] left-[60px] rotate-[-8deg] z-20">
      <div className="bg-white px-5 py-3 rounded-3xl shadow-lg">
        <span className="text-[42px] font-black text-blue-500">
          si
        </span>
     
     
        </div>
      </div>
    </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}