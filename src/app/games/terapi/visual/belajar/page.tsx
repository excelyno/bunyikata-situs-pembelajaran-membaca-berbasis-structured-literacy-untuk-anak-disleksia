"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Kumpulan Data Flashcard
const FLASHCARDS = {
  hewan: [
    { word: "kucing", image: "🐱" },
    { word: "gajah", image: "🐘" },
    { word: "bebek", image: "🦆" },
    { word: "ikan", image: "🐟" },
  ],
  buah: [
    { word: "apel", image: "🍎" },
    { word: "pisang", image: "🍌" },
    { word: "jeruk", image: "🍊" },
    { word: "anggur", image: "🍇" },
  ],
  warna: [
    { word: "merah", image: "🔴" },
    { word: "biru", image: "🔵" },
    { word: "hijau", image: "🟢" },
    { word: "kuning", image: "🟡" },
  ],
  benda: [
    { word: "buku", image: "📖" },
    { word: "sepatu", image: "👟" },
    { word: "tas", image: "🎒" },
    { word: "topi", image: "🧢" },
  ],
};

type Category = keyof typeof FLASHCARDS;

export default function BelajarVisualFlashcard() {
  const router = useRouter();
  
  // State Management
  const [step, setStep] = useState<"menu" | "playing">("menu");
  const [activeCategory, setActiveCategory] = useState<Category>("benda");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Fungsi untuk memulai dari kategori yang dipilih
  const startExploring = (category: Category) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setIsRevealed(false);
    setStep("playing");
  };

  // Fungsi navigasi kartu (Revisi Loop)
  const nextCard = () => {
    const isLastCard = currentIndex === FLASHCARDS[activeCategory].length - 1;
    
    if (!isLastCard) {
      // Lanjut ke kartu berikutnya
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      // Jika ini kartu terakhir, kembalikan ke menu utama (Looping)
      setStep("menu");
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsRevealed(false);
    }
  };

  // --- LOGIKA BENTUK KATA (WORD SHAPE) ---
  const getLetterShapeInfo = (char: string) => {
    const ascenders = ["b", "d", "f", "h", "k", "l", "t"]; // Huruf Tinggi
    const descenders = ["g", "j", "p", "q", "y"]; // Huruf Turun (berekor)

    if (ascenders.includes(char)) {
      return {
        type: "tinggi",
        css: "h-24 w-14 mt-0 rounded-t-2xl bg-[#D6E4FF] border-4 border-[#85A5FF] pb-8", 
      };
    } else if (descenders.includes(char)) {
      return {
        type: "turun",
        css: "h-24 w-14 mt-8 rounded-b-2xl bg-[#D9F7BE] border-4 border-[#95DE64] pt-4",
      };
    } else {
      return {
        type: "kotak",
        css: "h-16 w-14 mt-8 rounded-xl bg-[#FFF1B8] border-4 border-[#FFD666]",
      };
    }
  };

  const playSound = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Memutar suara kata: ${word}`);
    // Integrasikan audio disini
  };

  const currentCard = FLASHCARDS[activeCategory][currentIndex];
  // Cek apakah ini kartu terakhir di kategori tersebut
  const isLastCard = currentIndex === FLASHCARDS[activeCategory].length - 1;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col">
      
      {/* HEADER */}
      <header className="p-6 flex justify-between items-center max-w-5xl mx-auto w-full relative">
        <button 
          onClick={() => step === "playing" ? setStep("menu") : router.back()}
          className="w-14 h-14 bg-white rounded-full border-2 border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#8D7B68] text-2xl font-black hover:bg-[#F4F0F8] hover:-translate-x-1 transition-all z-10"
        >
          ←
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-[#5C4D4A] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none tracking-wide">
          {step === "menu" ? "Kartu Belajar" : `Kategori: ${activeCategory.toUpperCase()}`}
        </h1>
      </header>

      {/* TAMPILAN MENU KATEGORI */}
      {step === "menu" && (
        <main className="flex-1 flex flex-col items-center px-6 mt-8">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🕵️‍♂️</div>
            <h2 className="text-3xl font-black text-[#715B8E] mb-2 tracking-wide">Pilih Penyelidikanmu!</h2>
            <p className="text-[#8D7B68] font-medium text-lg">Mau belajar melihat bentuk kata apa hari ini?</p>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            {(Object.keys(FLASHCARDS) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => startExploring(cat)}
                className="group flex flex-col items-center p-8 bg-white rounded-[32px] border-b-8 border-[#E6DDF0] shadow-sm hover:-translate-y-2 hover:shadow-xl hover:border-[#715B8E] transition-all"
              >
                <div className="text-6xl group-hover:scale-110 transition-transform mb-4">
                  {cat === "hewan" ? "🐾" : cat === "buah" ? "🍎" : cat === "warna" ? "🎨" : "🎒"}
                </div>
                <h3 className="text-2xl font-black text-[#5C4D4A] capitalize">{cat}</h3>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* TAMPILAN FLASHCARD / PLAYING */}
      {step === "playing" && (
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          
          {/* Indikator Progres */}
          <div className="w-full max-w-xl flex gap-2 mb-8">
            {FLASHCARDS[activeCategory].map((_, idx) => (
              <div key={idx} className={`h-3 flex-1 rounded-full transition-all duration-300 ${idx <= currentIndex ? 'bg-[#715B8E]' : 'bg-[#E6DDF0]'}`} />
            ))}
          </div>

          {/* AREA KARTU */}
          <div 
            onClick={() => setIsRevealed(true)}
            className={`w-full max-w-xl bg-white min-h-[400px] rounded-[48px] border-b-[12px] border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-500 relative
              ${!isRevealed ? "hover:scale-[1.02] hover:border-[#715B8E]/50" : ""}`}
          >
            {/* Tampilan Sebelum Diklik */}
            {!isRevealed ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="text-[120px] mb-8 drop-shadow-xl animate-bounce-slow">
                  {currentCard.image}
                </div>
                <p className="text-[#8D7B68] font-bold text-xl bg-gray-100 px-6 py-3 rounded-full animate-pulse">
                  Tebak ini apa? Klik gambarnya! 👆
                </p>
              </div>
            ) : (
              // Tampilan Sesudah Diklik (Bentuk Kata Terlihat)
              <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
                <div className="text-6xl mb-12 drop-shadow-md">
                  {currentCard.image}
                </div>

                {/* VISUALISASI BENTUK KATA (WORD SHAPE SILHOUETTE) */}
                <div className="flex items-start gap-2 mb-8">
                  {currentCard.word.split("").map((char, index) => {
                    const shapeInfo = getLetterShapeInfo(char);
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`flex items-center justify-center shadow-inner transition-all duration-700 delay-[${index * 100}ms] ${shapeInfo.css}`}>
                          <span className="text-4xl font-black text-[#5C4D4A] uppercase drop-shadow-sm">
                            {char}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={(e) => playSound(currentCard.word, e)}
                  className="mt-4 flex items-center gap-3 bg-[#715B8E] text-white px-8 py-4 rounded-full font-black text-xl hover:bg-[#5E4B77] active:scale-95 transition-all shadow-[0_4px_0_#49395E]"
                >
                  🔊 Dengarkan Kata
                </button>
              </div>
            )}
          </div>

          {/* KONTROL BAWAH (Prev / Next) */}
          <div className="flex gap-6 mt-12 w-full max-w-xl px-4">
            <button 
              onClick={prevCard}
              disabled={currentIndex === 0}
              className={`flex-1 py-4 rounded-2xl font-black text-xl border-b-4 transition-all
                ${currentIndex === 0 ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed" : "bg-white text-[#715B8E] border-[#E6DDF0] hover:bg-gray-50 active:translate-y-1 active:border-b-0"}`}
            >
              Kembali
            </button>
            <button 
              onClick={nextCard}
              disabled={!isRevealed} // Hanya disable jika gambar belum diklik
              className={`flex-1 py-4 rounded-2xl font-black text-xl border-b-4 transition-all
                ${!isRevealed 
                  ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed" 
                  : isLastCard 
                    ? "bg-emerald-500 text-white border-emerald-700 shadow-sm hover:bg-emerald-600 active:translate-y-1 active:border-b-0" 
                    : "bg-[#715B8E] text-white border-[#49395E] shadow-sm hover:bg-[#5E4B77] active:translate-y-1 active:border-b-0"}`}
            >
              {isLastCard ? "Selesai ✨" : "Selanjutnya ➔"}
            </button>
          </div>

        </main>
      )}
    </div>
  );
}