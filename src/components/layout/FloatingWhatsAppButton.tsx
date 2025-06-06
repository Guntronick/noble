
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function FloatingWhatsAppButton() {
  const phoneNumber = "3516769103"; // Número proporcionado por el usuario
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <Button
      asChild
      className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full p-0 shadow-lg bg-[#25D366] hover:bg-[#1DAE50] text-white flex items-center justify-center"
      aria-label="Chatear por WhatsApp"
      title="Chatear por WhatsApp"
    >
      <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <MessageSquare size={30} strokeWidth={1.75} />
      </Link>
    </Button>
  );
}
