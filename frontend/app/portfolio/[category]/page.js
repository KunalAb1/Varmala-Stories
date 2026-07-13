import Link from "next/link";
import { getAlbums, getPhotos } from "@/lib/api";
import PhotoGrid from "@/components/PhotoGrid";

const categoryLabels = {
  wedding: "Wedding Photography",
  prewedding: "Prewedding Photography",
  haldi: "Haldi & Mehndi Ceremony",
  engagement: "Engagement Ceremony",
  models: "Models Portraits",
  kids: "Kids Photography",
  general: "Portfolio",
  hero: "Homepage Hero",
};

export default async function CategoryAlbumsPage({ params }) {
  const { category } = params;
  const albums = await getAlbums({ category });
  const loosePhotos = await getPhotos({ category, album: "none" });
  const label = categoryLabels[category] || category;

  const hasNothing = albums.length === 0 && loosePhotos.length === 0;

  return (
    <div className="px-8 md:px-16 py-16">
      <p className="font-mono text-xs tracking-widest2 uppercase text-sage mb-3">Portfolio</p>
      <h1 className="font-display text-4xl md:text-5xl italic text-ink mb-12">{label}</h1>

      {hasNothing && (
        <p className="font-body text-ink/60">
          No photos added yet in this category — check back soon.
        </p>
      )}

      {albums.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {albums.map((album) => (
            <Link
              key={album._id}
              href={`/portfolio/${category}/${album._id}`}
              className="group block"
            >
              <div className="aspect-[4/5] overflow-hidden bg-ink/5">
                {album.coverImageUrl ? (
                  <img
                    src={album.coverImageUrl}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-body text-sm text-ink/40">
                    No photos yet
                  </div>
                )}
              </div>
              <h3 className="font-display text-2xl italic text-ink mt-4">{album.name}</h3>
              <p className="font-mono text-xs tracking-widest2 uppercase text-ink/50 mt-1">
                {album.location ? `${album.location} — ` : ""}
                {album.photoCount} photo{album.photoCount !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}

      {loosePhotos.length > 0 && (
        <div>
          {albums.length > 0 && (
            <h2 className="font-display text-2xl italic text-ink mb-8">More from {label}</h2>
          )}
          <PhotoGrid photos={loosePhotos} />
        </div>
      )}
    </div>
  );
}