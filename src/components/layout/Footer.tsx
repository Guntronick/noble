
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-panel text-panel-foreground">
      <div className="container py-8 text-center text-sm text-panel-foreground/80">
        <p>&copy; {currentYear} Noble. Todos los derechos reservados.</p>
        <p className="mt-1">Impulsado por Soluciones Innovadoras</p>
      </div>
    </footer>
  );
}
