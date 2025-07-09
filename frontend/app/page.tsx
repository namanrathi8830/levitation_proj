"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      router.push("/products");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#141414",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#CCF575",
        fontFamily: "Pretendard, -apple-system, Roboto, Helvetica, sans-serif",
      }}
    >
      <div>Loading...</div>
    </div>
  );
}
