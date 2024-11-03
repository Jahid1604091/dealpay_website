import Image from 'next/image';
import React from 'react';

export default function page() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Image height={50} width={50} src='/gif/spinner.gif' alt='Loading...' />
        </div>
    );
}
