// Picks a grid tile shape that matches each photo's real orientation, so cropping
// stays minimal (a portrait shot gets a tall tile, a landscape shot gets a wide tile).
// Falls back to a plain square only when we don't know the photo's dimensions yet
// (older uploads from before we started saving width/height).
function getSpanClasses(photo) {
  if (!photo.width || !photo.height) return "";

  const ratio = photo.width / photo.height;

  if (ratio > 1.15) {
    return "sm:col-span-2"; // Landscape - wide tile
  }
  if (ratio < 0.9) {
    return "row-span-2"; // Portrait - tall tile
  }
  return "";
}

// Below this many photos, variable-sized tiles are too likely to leave an orphaned
// gap with no matching neighbor - so small albums use a plain uniform grid instead,
// which can never have gaps regardless of count.
const MOSAIC_MIN_PHOTOS = 6;

export default function PhotoGrid({ photos }) {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-24 font-body text-ink/60">
        <p>No photos here yet — add some from the admin upload panel.</p>
      </div>
    );
  }

  const useMosaic = photos.length >= MOSAIC_MIN_PHOTOS;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-3 [grid-auto-flow:dense]">
      {photos.map((photo) => (
        <figure
          key={photo._id}
          className={`group relative overflow-hidden ${useMosaic ? getSpanClasses(photo) : ""}`}
        >
          <img
            src={photo.imageUrl}
            alt={photo.title}
            loading="lazy"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="font-display italic text-sm text-paper">{photo.title}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}