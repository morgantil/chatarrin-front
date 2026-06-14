export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="text-sm font-bold text-brand">Chatarrin</span>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Chatarrin. Marketplace de metales reciclables.
        </p>
      </div>
    </footer>
  );
}
