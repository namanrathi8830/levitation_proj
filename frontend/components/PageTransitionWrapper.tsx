"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const [fade, setFade] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 10);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return <div className={`page-fade${fade ? ' page-fade-in' : ''}`}>{children}</div>;
} 