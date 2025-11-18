"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Keep old /about route working by redirecting to the new slug
    router.replace('/buyer-information');
  }, [router]);

  return null;
}