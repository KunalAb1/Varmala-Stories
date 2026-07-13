import Link from "next/link";
import { getAlbum, getPhotos } from "@/lib/api";
import PhotoGrid from "@/components/PhotoGrid";

export default async function AlbumPage({ params }) {
  const { category, albumId } = params;
  const album = await getAlbum(albumId);
  const photos = await getPhotos({ album: albumId });

  if (!album) {
    return (
      <div className="px-8 md:px-16 py-24 text-center">
        <p className="font-body text-ink/60">Album not found.</p>
        <Link href={`/portfolio/${category}`} className="font-mono text-xs uppercase text-amber mt-4 inline-block">
          ← Back to portfolio
        </Link>
      </div>
    );
  }

  const formattedDate = album.date
    ? new Date(album.date).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
    : null;

  return (
    <div>
      <div className="px-8 md:px-16 pt-16 pb-10 text-center">
        <Link
          href={`/portfolio/${category}`}
          className="font-mono text-xs tracking-widest2 uppercase text-amber"
        >
          ← Back to {category}
        </Link>
        <h1 className="font-display text-4xl md:text-5xl italic text-ink mt-6">{album.name}</h1>
        <p className="font-mono text-xs tracking-widest2 uppercase text-ink/50 mt-3">
          {[album.location, formattedDate].filter(Boolean).join(" — ")}
        </p>
        {album.description && (
          <p className="font-body text-ink/70 max-w-xl mx-auto mt-4">{album.description}</p>
        )}
      </div>

      <div className="px-4 md:px-6 pb-24">
        <PhotoGrid photos={photos} />
      </div>

      {/* Closing CTA - fills the trailing space at the end of the grid with something useful */}
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