import { getPhotos } from "@/lib/api";
import PhotoGrid from "@/components/PhotoGrid";
import CategoryShowcase from "@/components/CategoryShowcase";
import Link from "next/link";

// Categories that should NOT appear in the main mixed grid below —
// they're only reachable by clicking their category card.
const HIDDEN_FROM_MAIN_GRID = ["wedding", "prewedding", "haldi", "mehndi", "engagement", "models", "kids", "hero"];

const CATEGORY_LIST = [
  { slug: "wedding", label: "Wedding Photography" },
  { slug: "prewedding", label: "Prewedding Photography" },
  { slug: "haldi", label: "Haldi & Mehndi Ceremony" },
  { slug: "engagement", label: "Engagement Ceremony" },
  { slug: "models", label: "Models Portraits" },
  { slug: "kids", label: "Kids Photography" },
];

export default async function PortfolioPage() {
  const allPhotos = await getPhotos();

  // Each category card pulls its OWN featured photo, matched by category — not by array index.
  // If a category has no featured photo (or no photos at all), imageUrl is left undefined.
  const categories = CATEGORY_LIST.map(({ slug, label }) => {
    const inCategory = allPhotos.filter((p) => p.category === slug);
    const cover = inCategory.find((p) => p.isFeatured) || inCategory[0];
    return { slug, label, imageUrl: cover?.imageUrl };
  });

  const photos = allPhotos.filter((p) => !HIDDEN_FROM_MAIN_GRID.includes(p.category));
  const midpoint = Math.ceil(photos.length / 2);
  const firstHalf = photos.slice(0, midpoint);
  const secondHalf = photos.slice(midpoint);

  return (
    <div>
      <section className="px-8 md:px-16 pt-20 pb-16 text-center">
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-ink leading-tight">
          Exploring <span className="italic text-amber">the beauty of art</span>
          <br />
          captured within frame
        </h1>
      </section>

      <section className="px-4 md:px-6 pb-24">
        <PhotoGrid photos={firstHalf} />
      </section>

      <section className="bg-ink/[0.03] px-8 md:px-16 py-24">
        <h2 className="font-display text-3xl italic text-ink text-center mb-16">
          Browse by category
        </h2>
        <CategoryShowcase categories={categories} />
      </section>

      {secondHalf.length > 0 && (
        <section className="px-4 md:px-6 pb-24">
          <PhotoGrid photos={secondHalf} />
        </section>
      )}

      {/* Closing CTA */}
      <div className="text-center px-8 py-24 bg-ink/[0.03]">
        <p className="font-display text-3xl italic text-ink mb-6">
          Love what you see?
        </p>
        <p className="font-body text-ink/70 max-w-md mx-auto mb-8">
          Get in touch about your own day — we'd love to help capture it.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-ink text-paper font-mono text-xs tracking-widest2 uppercase px-8 py-4 hover:bg-amber transition-colors"
        >
          Enquire now
        </Link>
      </div>
    </div>
  );
}