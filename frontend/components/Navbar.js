"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-line">
     <div className="flex items-center justify-between px-8 md:px-12 py-4">
        <Link href="/">
      <img src="/logo.png" alt="Varmala Stories" className="h-16 w-auto" />
       </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest2 uppercase text-ink">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-amber transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden font-mono text-xs tracking-widest2 uppercase"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 font-mono text-xs tracking-widest2 uppercase text-ink">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
