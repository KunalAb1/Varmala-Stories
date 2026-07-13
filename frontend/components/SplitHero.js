export default function SplitHero({ imageUrl, backgroundImageUrl, heading, subheading, focus = "center" }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
      <div className="relative min-h-[400px] md:min-h-full">
        <img
          src={imageUrl}
          alt=""
          style={{ objectPosition: focus }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="relative bg-ink flex items-center justify-center px-10 py-16 text-center overflow-hidden">
        {backgroundImageUrl && (
          <>
            <img
              src={backgroundImageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            {/* gradient overlay: darker where the text sits, lighter elsewhere, so the photo stays visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/60 to-ink/50" />
          </>
        )}

        <div className="relative z-10">
          <h1 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-paper leading-tight">
            {heading}
          </h1>
          {subheading && (
            <p className="font-mono text-xs tracking-widest2 uppercase text-blush mt-6">
              {subheading}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}