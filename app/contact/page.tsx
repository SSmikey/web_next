'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactRedirect() {
  const router = useRouter();

  useEffect(() => {
    // keep old /contact route working by redirecting to new /select-products
    router.replace('/select-products');
  }, [router]);

  return null;
}
