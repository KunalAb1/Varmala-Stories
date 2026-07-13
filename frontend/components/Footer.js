export default function Footer() {
  const whatsappNumber = "919511603351"; // country code + number, no + or dashes
  const instagramUrl = "https://www.instagram.com/nirrraajj?igsh=c244cTY3YWQxamxn";
  const email = "Varmala.stories@gmail.com";
  const phoneDisplay = "+91-9511603351";

  return (
    <footer className="bg-ink text-paper mt-16 md:mt-24">
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-14 flex flex-col md:flex-row justify-between gap-4 md:gap-8 text-center md:text-left items-center md:items-start">
        <div>
          <p className="font-display italic text-xl md:text-2xl">Varmala Stories</p>
          <p className="font-mono text-xs tracking-widest2 uppercase text-blush mt-1 md:mt-2">
            Maharashtra &amp; beyond.
          </p>
        </div>

        <div className="font-body text-sm space-y-2 text-paper/80">
          <p>
            <a href={`mailto:${email}`} className="hover:text-paper transition-colors">
              {email}
            </a>
          </p>

          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span>{phoneDisplay}</span>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="text-paper/80 hover:text-paper transition-colors"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.014 2C6.55 2 2.108 6.44 2.108 11.906c0 1.87.507 3.62 1.394 5.128L2 22l5.11-1.474a9.85 9.85 0 004.904 1.294h.005c5.464 0 9.906-4.44 9.906-9.905C21.925 6.44 17.48 2 12.014 2zm0 17.958a8.02 8.02 0 01-4.09-1.117l-.294-.174-3.036.876.81-2.958-.191-.304a8.006 8.006 0 01-1.233-4.28c0-4.44 3.612-8.05 8.037-8.05 4.427 0 8.037 3.61 8.037 8.05 0 4.44-3.61 8.05-8.037 8.05z" />
              </svg>
            </a>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center md:justify-start hover:text-paper transition-colors"
          >
            {/* Instagram icon */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span>@nirrraajj</span>
          </a>
        </div>

        <div className="font-mono text-xs tracking-widest2 uppercase text-paper/60">
          <p>&copy; {new Date().getFullYear()} Varmala Stories</p>
        </div>
      </div>
    </footer>
  );
}