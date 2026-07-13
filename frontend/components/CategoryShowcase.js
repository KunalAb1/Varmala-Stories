import Link from "next/link";

// Each entry needs an image (pull from your uploaded photos) and links to a filtered portfolio view
export default function CategoryShowcase({ categories }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 items-start">
      {categories.map((cat) => (
        <div key={cat.slug} className="text-center flex flex-col h-full">
          <h3 className="font-display text-3xl md:text-4xl text-ink mb-6 min-h-[3.2em] flex items-center justify-center">
            {cat.label}
          </h3>
          <div className="aspect-[4/5] overflow-hidden bg-ink/5">
            {cat.imageUrl ? (
              <img
                src={cat.imageUrl}
                alt={cat.label}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-body text-sm text-ink/40">
                Coming soon
              </div>
            )}
          </div>
          <Link
            href={`/portfolio/${cat.slug}`}
            className="inline-block mt-6 border border-ink px-8 py-3 font-body text-sm text-ink rounded-full hover:bg-ink hover:text-paper transition-colors self-center"
          >
            See Collection
          </Link>
        </div>
      ))}
    </div>
  );
}