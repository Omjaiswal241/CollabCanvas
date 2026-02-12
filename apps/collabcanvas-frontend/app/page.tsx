"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/rooms");
    } else {
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-2xl font-bold">CollabCanvas</div>
    </div>
  );
}
