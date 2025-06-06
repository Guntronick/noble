export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40">
      <div className="container py-8 text-center text-sm text-foreground/60">
        <p>&copy; {currentYear} Catálogo de Merch IA. Todos los derechos reservados.</p>
        <p className="mt-1">Impulsado por Soluciones IA Futuristas</p>
      </div>
    </footer>
  );
}
