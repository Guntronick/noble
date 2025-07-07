export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-panel text-panel-foreground">
      <div className="container py-8 text-center text-sm text-panel-foreground/80">
        <p>&copy; {currentYear} Noble. Todos los derechos reservados.</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span>desarrollado por</span>
          <a
            href="https://dendev.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-panel-foreground hover:text-panel-foreground/80 transition-colors"
          >
            <svg
              className="h-5 w-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="7 8 3 12 7 16" />
              <polyline points="17 8 21 12 17 16" />
              <line x1="14" y1="4" x2="10" y2="20" />
            </svg>
            DenDev
          </a>
        </div>
      </div>
    </footer>
  );
}
