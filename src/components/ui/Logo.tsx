import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width, height }: LogoProps) {
  const defaultNavHeight = 32;
  // Aspect ratio of the provided logo: 600x162
  const defaultNavWidth = Math.round((600 / 162) * defaultNavHeight);

  const displayWidth = width || defaultNavWidth;
  const displayHeight = height || defaultNavHeight;

  return (
    <Link href="/" className={`flex items-center gap-2 ${className || ''}`}>
      <Image
        src="/images/logo-noble.png" // Asegúrate que esta sea la ruta a tu nuevo logo
        alt="Noble Logo"
        width={displayWidth}
        height={displayHeight}
        priority 
      />
    </Link>
  );
}
