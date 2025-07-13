
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggleButton } from './ThemeToggleButton';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/products', label: 'Catálogo' },
  { href: '/contact', label: 'Contacto' },
];

export function Navbar() {
  return (
    <header 
      style={{ height: 'var(--header-height)' }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-panel text-panel-foreground backdrop-blur supports-[backdrop-filter]:bg-panel/90"
    >
      <div className="container flex h-full items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-panel-foreground/80 hover:text-panel-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
           <ThemeToggleButton />
          <Button variant="ghost" asChild className="hover:bg-panel-foreground/10">
            <Link
              href="/cart"
              aria-label="Ir al carrito de compras"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-panel-foreground hover:text-panel-foreground transition-colors"
            >
              <ShoppingCart className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium hidden sm:inline">Ir al Carrito</span>
            </Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-panel-foreground/10 text-panel-foreground">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Alternar menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-panel text-panel-foreground">
                <SheetTitle className="sr-only">Navegación Principal</SheetTitle>
                <div className="flex flex-col space-y-4 p-4">
                  <Logo className="mb-4" />
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-lg font-medium text-panel-foreground hover:text-panel-foreground/80 transition-colors"
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
