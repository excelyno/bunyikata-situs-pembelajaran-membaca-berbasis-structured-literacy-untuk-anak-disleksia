export const say = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    // Batalkan suara yang sedang berjalan agar tidak tumpang tindih
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID"; // Set bahasa Indonesia
    utterance.rate = 0.9;     // Sedikit diperlambat agar jelas
    utterance.pitch = 1.2;    // Sedikit lebih tinggi biar ceria (friendly buat anak)
    
    window.speechSynthesis.speak(utterance);
  }
};