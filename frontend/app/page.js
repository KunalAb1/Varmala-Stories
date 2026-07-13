import { getPhotos } from "@/lib/api";
import SplitHero from "@/components/SplitHero";
import CategoryShowcase from "@/components/CategoryShowcase";

const HOMEPAGE_CATEGORIES = [
  { slug: "wedding", label: "Wedding Photography" },
  { slug: "prewedding", label: "Prewedding Photography" },
  { slug: "engagement", label: "Engagement Ceremony" },
];

export default async function HomePage() {
  const allPhotos = await getPhotos();
  const allFeatured = allPhotos.filter((p) => p.isFeatured);

  // Hero image: most recently featured photo overall (falls back to most recent photo if none featured yet)
  const heroPhoto = allFeatured[0] || allPhotos[0];

  // Background photo behind the text panel: pulled from a dedicated "hero" category,
  // uploaded specifically for this purpose and hidden everywhere else on the site.
  const heroBackgroundPhotos = allPhotos.filter((p) => p.category === "hero");
  const heroBackgroundPhoto = heroBackgroundPhotos.find((p) => p.isFeatured) || heroBackgroundPhotos[0];

  // Each category card pulls its OWN photo, matched by category — prefers a featured one,
  // but falls back to any photo in that category so cards aren't blank just because
  // nothing's been marked "Show on homepage" yet.
  const categories = HOMEPAGE_CATEGORIES.map(({ slug, label }) => {
    const inCategory = allPhotos.filter((p) => p.category === slug);
    const cover = inCategory.find((p) => p.isFeatured) || inCategory[0];
    return { slug, label, imageUrl: cover?.imageUrl };
  });

  return (
    <div>
      {/* Hero */}
      <SplitHero
        imageUrl={heroPhoto?.imageUrl}
        backgroundImageUrl={heroBackgroundPhoto?.imageUrl}
        heading="Real emotions, captured in beautiful light."
        subheading="Wedding & Event Photography — Rahata, Ahilyanagar"
        focus="top"
      />

      {/* Featured work */}
      <section className="px-8 md:px-12 py-24">
        <CategoryShowcase categories={categories} />
      </section>
    </div>
  );
}