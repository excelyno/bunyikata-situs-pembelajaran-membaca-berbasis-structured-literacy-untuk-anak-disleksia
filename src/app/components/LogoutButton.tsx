"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-20 h-20 bg-[#F18230] text-white rounded-[24px] flex flex-col items-center justify-center font-black hover:bg-[#D97026] transition-all shadow-[0_5px_0_#C56521] border-b-2 border-orange-700 active:translate-y-1 active:shadow-none"
    >
      <span className="text-[11px] uppercase tracking-tighter">Keluar</span>
    </button>
  );
}