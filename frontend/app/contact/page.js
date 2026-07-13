import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest2 uppercase text-sage mb-4">Get in touch</p>
      <h1 className="font-display text-5xl italic text-ink mb-8">Let&apos;s talk.</h1>
      <p className="font-body text-ink/70 mb-10">
        Share a few details about your day and I&apos;ll get back to you within a couple of days.
      </p>
      <ContactForm />
    </div>
  );
}
