'use client';

import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    window.location.href = 'https://steamcommunity.com';
  }, []);

  return null; // or a loading message if desired
}
