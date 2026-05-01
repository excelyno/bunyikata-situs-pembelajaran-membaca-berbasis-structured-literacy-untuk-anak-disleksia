"use client";
import { useRouter } from "next/navigation";
import { say } from "@/lib/speak";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export default function AuditoriBelajar() {
  const router = useRouter();

  const handlePlaySound = (char: string) => {
    say(`Ini huruf ${char}`);
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <button onClick={() => router.push("/games/terapi/auditori")} className="w-12 h-12 mb-6 bg-white rounded-full flex items-center justify-center font-black text-xl text-purple-500 shadow-sm">{"<"}</button>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-purple-600 mb-2">Dengar & Kenali 📢</h1>
        <p className="text-purple-800 font-medium">Klik kotak untuk mendengar suaranya!</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
        {ALPHABET.map((char) => (
          <button
            key={char}
            onClick={() => handlePlaySound(char)}
            className="aspect-square bg-white rounded-[32px] border-b-8 border-purple-200 flex items-center justify-center text-4xl font-black text-purple-600 hover:scale-105 active:border-b-0 active:translate-y-2 transition-all shadow-sm"
          >
            {char.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}