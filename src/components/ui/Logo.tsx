import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width, height }: LogoProps) {
  const defaultNavHeight = 32;
  const defaultNavWidth = Math.round((600 / 162) * defaultNavHeight); // Maintain aspect ratio of 600x162

  const displayWidth = width || defaultNavWidth;
  const displayHeight = height || defaultNavHeight;

  return (
    <Link href="/" className={`flex items-center gap-2 ${className || ''}`}>
      <Image
        src="/images/logo-noble.png"
        alt="Noble Logo"
        width={displayWidth}
        height={displayHeight}
        priority // Good for LCP element like a logo in navbar
      />
    </Link>
  );
}
