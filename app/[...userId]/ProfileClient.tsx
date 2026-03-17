// In ProfileClient.tsx
'use client';

import { useEffect } from 'react';

interface ProfileClientProps {
    rawHtmlContent: string;
}

export default function ProfileClient({ rawHtmlContent }: ProfileClientProps) {

      useEffect(() => {
    // If you need jQuery or other client-side JS
    if (typeof window !== 'undefined') {
      // Initialize any client-side scripts here
      console.log('Client-side initialized');
    }
  }, []);
  return (

    <div dangerouslySetInnerHTML={{ __html: rawHtmlContent }} />
    // <iframe 
    //   srcDoc={rawHtmlContent}
    //   style={{ width: '100%', height: '100vh', border: 'none' }}
    //   sandbox="allow-scripts"
    // />
  );
}