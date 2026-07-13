"use client";

import { useState, useEffect, useCallback } from "react";
import { getPhotos, getAlbums, deletePhoto, deleteAlbum } from "@/lib/api";

const categories = [
  "wedding",
  "prewedding",
  "haldi",
  "engagement",
  "models",
  "kids",
  "general",
  "hero",
];

export default function ManagePhotosPage() {
  const [category, setCategory] = useState("wedding");
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(""); // "" = all, "none" = standalone only
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null); // photo or album currently being deleted
  const [confirmId, setConfirmId] = useState(null); // which item is showing "are you sure"

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    const albumFilter = selectedAlbumId || undefined;
    const data = await getPhotos({ category, album: albumFilter });
    setPhotos(data);
    setLoading(false);
  }, [category, selectedAlbumId]);

  useEffect(() => {
    getAlbums({ category }).then(setAlbums);
    setSelectedAlbumId("");
  }, [category]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  async function handleDeletePhoto(id) {
    setBusyId(id);
    try {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
    }
    setBusyId(null);
    setConfirmId(null);
  }

  async function handleDeleteAlbum(id) {
    setBusyId(id);
    try {
      await deleteAlbum(id);
      setAlbums((prev) => prev.filter((a) => a._id !== id));
      if (selectedAlbumId === id) setSelectedAlbumId("");
      loadPhotos();
    } catch (err) {
      alert(`Could not delete album: ${err.message}`);
    }
    setBusyId(null);
    setConfirmId(null);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl italic text-ink mb-2">Manage photos</h1>
      <p className="font-body text-sm text-ink/60 mb-8">
        Internal tool — not linked anywhere on the public site. Deleting here removes the photo
        from ImageKit and the database together, so nothing gets left behind.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-b border-line bg-transparent py-2 font-body text-sm focus:outline-none focus:border-amber"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c[0].toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={selectedAlbumId}
          onChange={(e) => setSelectedAlbumId(e.target.value)}
          className="border-b border-line bg-transparent py-2 font-body text-sm focus:outline-none focus:border-amber"
        >
          <option value="">All photos in this category</option>
          <option value="none">Standalone (no album) only</option>
          {albums.map((a) => (
            <option key={a._id} value={a._id}>
              Album: {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Albums in this category - each deletable, cascades to its photos */}
      {albums.length > 0 && (
        <div className="mb-10">
          <p className="font-mono text-xs tracking-widest2 uppercase text-ink/60 mb-3">
            Albums in this category
          </p>
          <div className="flex flex-wrap gap-3">
            {albums.map((album) => (
              <div
                key={album._id}
                className="flex items-center gap-3 border border-line bg-white/40 px-4 py-2"
              >
                <span className="font-body text-sm">
                  {album.name} ({album.photoCount})
                </span>
                {confirmId === `album-${album._id}` ? (
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteAlbum(album._id)}
                      disabled={busyId === album._id}
                      className="font-mono text-xs uppercase text-red-700"
                    >
                      {busyId === album._id ? "Deleting…" : "Confirm delete"}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="font-mono text-xs uppercase text-ink/50"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmId(`album-${album._id}`)}
                    className="font-mono text-xs uppercase text-ink/50 hover:text-red-700"
                  >
                    Delete album
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo grid with delete buttons */}
      {loading ? (
        <p className="font-body text-ink/60">Loading…</p>
      ) : photos.length === 0 ? (
        <p className="font-body text-ink/60">No photos match this filter.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo._id} className="border border-line bg-white/40 p-2">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-40 object-cover mb-2"
              />
              <p className="font-body text-xs truncate">{photo.title}</p>

              {confirmId === photo._id ? (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDeletePhoto(photo._id)}
                    disabled={busyId === photo._id}
                    className="font-mono text-[10px] uppercase text-red-700 flex-1"
                  >
                    {busyId === photo._id ? "Deleting…" : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="font-mono text-[10px] uppercase text-ink/50 flex-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(photo._id)}
                  className="font-mono text-[10px] uppercase text-ink/50 hover:text-red-700 mt-2 w-full text-left"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
