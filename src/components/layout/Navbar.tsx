
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/products', label: 'Catálogo' },
  { href: '/categories', label: 'Categorías' },
  { href: '/contact', label: 'Contacto' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-primary/90">
      <div className="container flex h-16 items-center justify-between">
        <Logo /> {/* El logo debería tener texto blanco o dorado para contrastar con bg-primary (Azul Petróleo) */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hover:bg-primary-foreground/10">
            <Link
              href="/cart"
              aria-label="Ir al carrito de compras"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-primary-foreground hover:text-primary-foreground transition-colors"
            >
              <ShoppingCart className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Ir al Carrito</span>
            </Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10 text-primary-foreground">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Alternar menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary text-primary-foreground">
                <div className="flex flex-col space-y-4 p-4">
                  <Logo className="mb-4" />
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
