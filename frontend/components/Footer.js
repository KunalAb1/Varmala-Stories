export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-display italic text-2xl">Varmala Stories</p>
          <p className="font-mono text-xs tracking-widest2 uppercase text-blush mt-2">
            Maharashtra &amp; beyond.
          </p>
        </div>

        <div className="font-body text-sm space-y-1 text-paper/80">
          <p>maliniraj480@gmail.com</p>
          <p>+91-9511603351</p>
        </div>

        <div className="font-mono text-xs tracking-widest2 uppercase text-paper/60">
          <p>&copy; {new Date().getFullYear()} Varmala Stories</p>
        </div>
      </div>
    </footer>
  );
}
