export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40">
      <div className="container py-8 text-center text-sm text-foreground/60">
        <p>&copy; {currentYear} AI Merch Catalog. All rights reserved.</p>
        <p className="mt-1">Powered by Futuristic AI Solutions</p>
      </div>
    </footer>
  );
}
