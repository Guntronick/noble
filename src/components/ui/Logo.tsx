import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 32, textSize = 'text-2xl' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ${className}`}>
      <BrainCircuit size={iconSize} />
      <span className={`font-headline font-semibold ${textSize}`}>AI Merch</span>
    </Link>
  );
}
