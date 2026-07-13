"use client";

import { useState, useRef, useEffect } from "react";
import { API_URL, getAlbums, createAlbum, setAlbumCover, getPhotos } from "@/lib/api";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const categories = [
  { value: "wedding", label: "Wedding Photography" },
  { value: "prewedding", label: "Prewedding Photography" },
  { value: "haldi", label: "Haldi and Mehndi Ceremony" },
  { value: "engagement", label: "Engagement Ceremony" },
  { value: "models", label: "Models Portraits" },
  { value: "kids", label: "Kids Photography" },
  { value: "general", label: "Portfolio Only (no category, no album)" },
  { value: "hero", label: "Homepage Hero Background (hidden everywhere else)" },
];

export default function AdminUploadPage() {
  // Album selection / creation
  const [category, setCategory] = useState("wedding");
  const [existingAlbums, setExistingAlbums] = useState([]);
  const [albumMode, setAlbumMode] = useState("new"); // "new" | "existing" | "none"
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumLocation, setNewAlbumLocation] = useState("");
  const [newAlbumDate, setNewAlbumDate] = useState("");
  const [albumBusy, setAlbumBusy] = useState(false);
  const [albumError, setAlbumError] = useState("");

  // How many photos already exist in this category - so you can track progress
  // through a big batch without needing to flip over to /admin/manage
  const [categoryCount, setCategoryCount] = useState(null);

  // Display order - lets you control the sequence photos appear in on the site,
  // instead of always showing newest-first
  const [startingOrder, setStartingOrder] = useState(0);

  // Photo selection / upload
  const [pending, setPending] = useState([]); // [{file, previewUrl, title, isFeatured, isCover, order}]
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [log, setLog] = useState([]);
  const fileInputRef = useRef(null);

  // Load albums + photo count for the chosen category whenever it changes
  useEffect(() => {
    getAlbums({ category }).then(setExistingAlbums);
    setSelectedAlbumId("");
    refreshCategoryCount();
  }, [category]);

  function refreshCategoryCount() {
    getPhotos({ category }).then((list) => setCategoryCount(list.length));
  }

  async function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Read each photo's TRUE displayed dimensions (respecting rotation), not the
    // raw values ImageKit later returns - phone photos often store raw pixel data
    // sideways with a hidden rotation tag, which would otherwise fool our landscape
    // vs portrait detection.
    const newItems = await Promise.all(
      files.map((file, i) => {
        const previewUrl = URL.createObjectURL(file);
        return new Promise((resolve) => {
          const img = new Image();
          const base = {
            file,
            previewUrl,
            title: file.name.replace(/\.[^/.]+$/, ""),
            isFeatured: false,
            isCover: false,
            order: startingOrder + pending.length + i,
          };
          img.onload = () => {
            resolve({ ...base, width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = () => {
            resolve({ ...base, width: undefined, height: undefined });
          };
          img.src = previewUrl;
        });
      })
    );

    setPending((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function updateItem(index, field, value) {
    setPending((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function removeItem(index) {
    setPending((prev) => prev.filter((_, i) => i !== index));
  }

  function cancelAll() {
    setPending([]);
    setLog([]);
  }

  // Returns the album ID photos should be attached to, creating a new album first if needed
  async function resolveAlbumId() {
    if (albumMode === "none") return null;

    if (albumMode === "existing") {
      if (!selectedAlbumId) throw new Error("Pick an existing album, or switch to 'New album'");
      return selectedAlbumId;
    }

    // albumMode === "new"
    if (!newAlbumName.trim()) throw new Error("Give the new album a name (e.g. 'Mr & Mrs Sharma')");
    setAlbumBusy(true);
    try {
      const album = await createAlbum({
        name: newAlbumName.trim(),
        category,
        location: newAlbumLocation.trim(),
        date: newAlbumDate || undefined,
      });
      return album._id;
    } finally {
      setAlbumBusy(false);
    }
  }

  async function uploadAll() {
    if (pending.length === 0) return;
    setAlbumError("");
    setUploading(true);
    setProgress({ done: 0, total: pending.length });
    setLog([]);

    let albumId;
    try {
      albumId = await resolveAlbumId();
    } catch (err) {
      setAlbumError(err.message);
      setUploading(false);
      return;
    }

    for (let i = 0; i < pending.length; i++) {
      const item = pending[i];
      let outcome = { title: item.title, status: "error", message: "Unknown failure — check console" };

      try {
        const authRes = await fetch(`${API_URL}/api/photos/auth`);
        if (!authRes.ok) throw new Error("Could not get upload authorization");
        const auth = await authRes.json();
        if (!auth.signature || !auth.token || !auth.expire) {
          throw new Error("Upload authorization response was incomplete");
        }

        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("fileName", item.file.name);
        formData.append("publicKey", publicKey);
        formData.append("signature", auth.signature);
        formData.append("expire", auth.expire);
        formData.append("token", auth.token);

        const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formData,
        });
        const ikData = await ikRes.json();
        if (!ikRes.ok) throw new Error(ikData.message || "ImageKit upload failed");
        if (!ikData.url || !ikData.fileId) throw new Error("ImageKit response was missing url/fileId");

        const saveRes = await fetch(`${API_URL}/api/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: item.title,
            category,
            isFeatured: item.isFeatured,
            imageUrl: ikData.url,
            fileId: ikData.fileId,
            album: albumId,
            width: item.width,
            height: item.height,
            order: item.order,
          }),
        });
        const savedBody = await saveRes.json();
        if (!saveRes.ok) throw new Error(savedBody.error || "Saved to ImageKit but failed to save in database");

        if (item.isCover && albumId) {
          await setAlbumCover(albumId, ikData.url).catch(() => {});
        }

        outcome = { title: item.title, status: "success" };
      } catch (err) {
        console.error(`Upload failed for "${item.title}":`, err);
        outcome = { title: item.title, status: "error", message: err.message || String(err) };
      }

      setLog((prev) => [...prev, outcome]);
      setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    }

    setUploading(false);
    setPending([]);
    // refresh album list + photo count now that new ones may have been added
    getAlbums({ category }).then(setExistingAlbums);
    refreshCategoryCount();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl italic text-ink mb-2">Add photos</h1>
      <p className="font-body text-sm text-ink/60 mb-8">
        Internal tool — not linked anywhere on the public site.
      </p>

      {/* Step 1: category */}
      <div className="mb-6 p-4 border border-line bg-white/40">
        <label className="font-mono text-xs tracking-widest2 uppercase text-ink/70">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 w-full border-b border-line bg-transparent py-2 font-body focus:outline-none focus:border-amber"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <p className="font-mono text-xs text-ink/50 mt-3">
          {categoryCount === null
            ? "Checking how many photos are already here…"
            : `You currently have ${categoryCount} photo${categoryCount === 1 ? "" : "s"} in this category.`}
        </p>
      </div>

      {/* Step 2: album */}
      <div className="mb-6 p-4 border border-line bg-white/40 space-y-4">
        <label className="font-mono text-xs tracking-widest2 uppercase text-ink/70">Album</label>

        <div className="flex flex-wrap gap-4 font-body text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={albumMode === "new"}
              onChange={() => setAlbumMode("new")}
            />
            New album
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={albumMode === "existing"}
              onChange={() => setAlbumMode("existing")}
              disabled={existingAlbums.length === 0}
            />
            Existing album {existingAlbums.length === 0 ? "(none yet in this category)" : ""}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={albumMode === "none"}
              onChange={() => setAlbumMode("none")}
            />
            No album (just add to the general category)
          </label>
        </div>

        {albumMode === "new" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="e.g. Mr & Mrs Sharma"
              className="border-b border-line bg-transparent py-2 font-body text-sm focus:outline-none focus:border-amber sm:col-span-1"
            />
            <input
              value={newAlbumLocation}
              onChange={(e) => setNewAlbumLocation(e.target.value)}
              placeholder="Location"
              className="border-b border-line bg-transparent py-2 font-body text-sm focus:outline-none focus:border-amber"
            />
            <input
              type="date"
              value={newAlbumDate}
              onChange={(e) => setNewAlbumDate(e.target.value)}
              className="border-b border-line bg-transparent py-2 font-body text-sm focus:outline-none focus:border-amber"
            />
          </div>
        )}

        {albumMode === "existing" && (
          <select
            value={selectedAlbumId}
            onChange={(e) => setSelectedAlbumId(e.target.value)}
            className="w-full border-b border-line bg-transparent py-2 font-body text-sm focus:outline-none focus:border-amber"
          >
            <option value="">Select an album…</option>
            {existingAlbums.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.photoCount} photos)
              </option>
            ))}
          </select>
        )}

        {albumError && <p className="text-sm text-red-700 font-body">{albumError}</p>}
      </div>

      {/* Step 3: display order */}
      <div className="mb-6 p-4 border border-line bg-white/40">
        <label className="font-mono text-xs tracking-widest2 uppercase text-ink/70">
          Starting display order
        </label>
        <input
          type="number"
          value={startingOrder}
          onChange={(e) => setStartingOrder(Number(e.target.value) || 0)}
          className="mt-2 w-full border-b border-line bg-transparent py-2 font-body focus:outline-none focus:border-amber"
        />
        <p className="font-mono text-xs text-ink/50 mt-3">
          Photos are shown lowest-order-first. Each photo you select below gets the next
          number automatically (editable per photo) — set this if you want new uploads to
          slot in at a specific point rather than the end.
        </p>
      </div>

      {/* Step 4: pick photos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        className="mb-8 font-body text-sm"
      />

      {pending.length > 0 && (
        <div className="space-y-4 mb-8">
          <p className="font-mono text-xs tracking-widest2 uppercase text-ink/70">
            {pending.length} photo{pending.length > 1 ? "s" : ""} ready to upload
          </p>
          {pending.map((item, i) => (
            <div key={i} className="flex gap-4 border border-line bg-white/40 p-3">
              <img src={item.previewUrl} alt="" className="w-24 h-24 object-cover flex-shrink-0" />
              <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
                <input
                  value={item.title}
                  onChange={(e) => updateItem(i, "title", e.target.value)}
                  placeholder="Title"
                  className="border-b border-line bg-transparent py-1 font-body text-sm focus:outline-none focus:border-amber flex-1 min-w-[140px]"
                />
                <label className="flex items-center gap-2 font-body text-xs whitespace-nowrap">
                  Order:
                  <input
                    type="number"
                    value={item.order}
                    onChange={(e) => updateItem(i, "order", Number(e.target.value) || 0)}
                    className="w-16 border-b border-line bg-transparent py-1 font-body text-sm focus:outline-none focus:border-amber"
                  />
                </label>
                <label className="flex items-center gap-2 font-body text-xs whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={item.isFeatured}
                    onChange={(e) => updateItem(i, "isFeatured", e.target.checked)}
                  />
                  Show on homepage
                </label>
                <label className="flex items-center gap-2 font-body text-xs whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={item.isCover}
                    onChange={(e) => updateItem(i, "isCover", e.target.checked)}
                  />
                  Use as album cover
                </label>
              </div>
              <button
                onClick={() => removeItem(i)}
                className="font-mono text-xs uppercase text-ink/50 hover:text-red-700 self-start"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex gap-4 pt-2">
            <button
              onClick={uploadAll}
              disabled={uploading || albumBusy}
              className="bg-ink text-paper font-mono text-xs tracking-widest2 uppercase px-8 py-4 hover:bg-amber transition-colors disabled:opacity-50"
            >
              {uploading ? `Uploading ${progress.done}/${progress.total}…` : "Upload all"}
            </button>
            <button
              onClick={cancelAll}
              disabled={uploading}
              className="border border-ink text-ink font-mono text-xs tracking-widest2 uppercase px-8 py-4 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div className="space-y-1 border-t border-line pt-4">
          {log.map((entry, i) => (
            <p
              key={i}
              className={`font-body text-sm ${entry.status === "error" ? "text-red-700" : "text-sage"}`}
            >
              {entry.status === "success" ? "✓" : "✗"} {entry.title}
              {entry.message ? ` — ${entry.message}` : ""}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}