const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getPhotos({ category, featured, album } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (featured) params.set("featured", "true");
  if (album) params.set("album", album);

  const res = await fetch(`${API_URL}/api/photos?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getAlbums({ category } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);

  const res = await fetch(`${API_URL}/api/albums?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getAlbum(id) {
  const res = await fetch(`${API_URL}/api/albums/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function createAlbum(data) {
  const res = await fetch(`${API_URL}/api/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Could not create album");
  return body;
}

export async function setAlbumCover(albumId, coverImageUrl) {
  const res = await fetch(`${API_URL}/api/albums/${albumId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coverImageUrl }),
  });
  if (!res.ok) throw new Error("Could not set cover photo");
  return res.json();
}

export async function deletePhoto(id) {
  const res = await fetch(`${API_URL}/api/photos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Could not delete photo");
  return res.json();
}

export async function deleteAlbum(id) {
  const res = await fetch(`${API_URL}/api/albums/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Could not delete album");
  return res.json();
}

export async function sendContactMessage(data) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Something went wrong");
  return body;
}

export { API_URL };
