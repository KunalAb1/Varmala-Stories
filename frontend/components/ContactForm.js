"use client";

import { useState } from "react";
import { sendContactMessage } from "@/lib/api";

const initialState = {
  name: "",
  email: "",
  phone: "",
  eventType: "wedding",
  eventDate: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await sendContactMessage(form);
      setStatus("sent");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-line bg-white/40 p-8 text-center">
        <p className="font-display text-2xl italic text-ink">Message sent.</p>
        <p className="font-body text-ink/70 mt-2">
          Thanks for reaching out — expect a reply within a couple of days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Phone (optional)" name="phone" value={form.phone} onChange={handleChange} />
        <div>
          <label className="font-mono text-xs tracking-widest2 uppercase text-ink/70">
            Event type
          </label>
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            className="mt-2 w-full border-b border-line bg-transparent py-2 font-body focus:outline-none focus:border-amber"
          >
            <option value="wedding">Wedding</option>
            <option value="engagement">Engagement</option>
            <option value="family">Family</option>
            <option value="newborn">Newborn</option>
            <option value="event">Event</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <Field
        label="Event date (optional)"
        name="eventDate"
        type="date"
        value={form.eventDate}
        onChange={handleChange}
      />

      <div>
        <label className="font-mono text-xs tracking-widest2 uppercase text-ink/70">
          Tell us about your day
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="mt-2 w-full border-b border-line bg-transparent py-2 font-body focus:outline-none focus:border-amber resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700 font-body">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-ink text-paper font-mono text-xs tracking-widest2 uppercase px-8 py-4 hover:bg-amber transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="font-mono text-xs tracking-widest2 uppercase text-ink/70">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full border-b border-line bg-transparent py-2 font-body focus:outline-none focus:border-amber"
      />
    </div>
  );
}
