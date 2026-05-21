const BASE = "/api";

async function fetchJSON(url, options = {}) {
  const { headers: optHeaders, ...rest } = options;
  const res = await fetch(`${BASE}${url}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...optHeaders },
    ...rest,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  artworks: {
    create(body) {
      return fetchJSON('/artworks', { method: 'POST', body: JSON.stringify(body) });
    },
    list(params = {}) {
      return fetchJSON(`/artworks?${new URLSearchParams(params)}`);
    },
    get(id) {
      return fetchJSON(`/artworks/${id}`);
    },
    update(id, body) {
      return fetchJSON(`/artworks/${id}`, { method: "PUT", body: JSON.stringify(body) });
    },
    delete(id) {
      return fetchJSON(`/artworks/${id}`, { method: "DELETE" });
    },
    toggleVisibility(id, isPublic) {
      return fetchJSON(`/artworks/${id}/visibility`, { method: "PATCH", body: JSON.stringify({ isPublic }) });
    },
    like(id) {
      return fetchJSON(`/artworks/${id}/like`, { method: "POST" });
    },
    unlike(id) {
      return fetchJSON(`/artworks/${id}/like`, { method: "DELETE" });
    },
    grade(id, body) {
      return fetchJSON(`/artworks/${id}/grade`, { method: "PUT", body: JSON.stringify(body) });
    },
    comments: {
      list(artworkId) {
        return fetchJSON(`/artworks/${artworkId}/comments`);
      },
      create(artworkId, content) {
        return fetchJSON(`/artworks/${artworkId}/comments`, { method: "POST", body: JSON.stringify({ content }) });
      },
    },
    related(id, limit = 4) {
      return fetchJSON(`/artworks/${id}/related?limit=${limit}`);
    },
    report(id, body) {
      return fetchJSON(`/artworks/${id}/report`, { method: 'POST', body: JSON.stringify(body) });
    },
    reports(id) {
      return fetchJSON(`/artworks/${id}/reports`);
    },
    updateReportStatus(id, reportId, status) {
      return fetchJSON(`/artworks/${id}/reports/${reportId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    },
  },

  users: {
    me() {
      return fetchJSON("/users/me");
    },
    updateMe(body) {
      return fetchJSON("/users/me", { method: "PUT", body: JSON.stringify(body) });
    },
    stats() {
      return fetchJSON("/users/me/stats");
    },
    search(q) {
      return fetchJSON(`/users/search?q=${encodeURIComponent(q)}`);
    },
    myArtworks() {
      return fetchJSON("/users/me/artworks");
    },
    updateAvatar(avatarUrl) {
      return fetchJSON("/users/me/avatar", { method: "POST", body: JSON.stringify({ avatarUrl }) });
    },
    deleteAvatar() {
      return fetchJSON("/users/me/avatar", { method: "DELETE" });
    },
  },

  portfolios: {
    get(slug) {
      return fetchJSON(`/portfolios/${slug}`);
    },
    me() {
      return fetchJSON("/portfolios/me");
    },
    artworks(slug, params = {}) {
      const q = new URLSearchParams(params).toString();
      return fetchJSON(`/portfolios/${slug}/artworks${q ? `?${q}` : ""}`);
    },
    stats(slug) {
      return fetchJSON(`/portfolios/${slug}/stats`);
    },
    grade(slug) {
      return fetchJSON(`/portfolios/${slug}/grade`);
    },
    mine() {
      return fetchJSON("/portfolios/mine");
    },
    updateMine(body) {
      return fetchJSON("/portfolios/mine", { method: "PUT", body: JSON.stringify(body) });
    },
    toggleVisibility(isPortfolioPublic) {
      return fetchJSON("/portfolios/mine/visibility", { method: "PUT", body: JSON.stringify({ isPortfolioPublic }) });
    },
    sendContact(slug, body) {
      return fetchJSON(`/portfolios/${slug}/contact`, { method: "POST", body: JSON.stringify(body) });
    },
  },

  messages: {
    list() {
      return fetchJSON("/messages");
    },
    send(body) {
      return fetchJSON("/messages", { method: "POST", body: JSON.stringify(body) });
    },
    markRead(id) {
      return fetchJSON(`/messages/${id}/read`, { method: "PATCH" });
    },
    archive(id) {
      return fetchJSON(`/messages/${id}/archive`, { method: "PATCH" });
    },
  },

  collections: {
    list() {
      return fetchJSON("/collections");
    },
    get(id) {
      return fetchJSON(`/collections/${id}`);
    },
    create(body) {
      return fetchJSON("/collections", { method: "POST", body: JSON.stringify(body) });
    },
    update(id, body) {
      return fetchJSON(`/collections/${id}`, { method: "PUT", body: JSON.stringify(body) });
    },
    delete(id) {
      return fetchJSON(`/collections/${id}`, { method: "DELETE" });
    },
    addItem(id, body) {
      return fetchJSON(`/collections/${id}/items`, { method: "POST", body: JSON.stringify(body) });
    },
    removeItem(collectionId, artworkId) {
      return fetchJSON(`/collections/${collectionId}/items/${artworkId}`, { method: "DELETE" });
    },
    updateItemNote(collectionId, artworkId, note) {
      return fetchJSON(`/collections/${collectionId}/items/${artworkId}`, {
        method: "PATCH", body: JSON.stringify({ note }),
      });
    },
  },

  notifications: {
    list(params = {}) {
      const q = new URLSearchParams(params).toString();
      return fetchJSON(`/notifications${q ? `?${q}` : ""}`);
    },
    markRead(id) {
      return fetchJSON(`/notifications/${id}`, { method: "PUT" });
    },
    markAllRead() {
      return fetchJSON("/notifications/read-all", { method: "PUT" });
    },
    unreadCount() {
      return fetchJSON("/notifications/unread-count");
    },
  },

  admin: {
    stats() {
      return fetchJSON("/admin/stats");
    },
    artworks(params = {}) {
      const q = new URLSearchParams(params).toString();
      return fetchJSON(`/admin/artworks${q ? `?${q}` : ""}`);
    },
    users(params = {}) {
      const q = new URLSearchParams(params).toString();
      return fetchJSON(`/admin/users${q ? `?${q}` : ""}`);
    },
    setArtworkStatus(id, isPublic) {
      return fetchJSON(`/admin/artworks/${id}/status`, { method: "PATCH", body: JSON.stringify({ isPublic }) });
    },
    toggleArtworkHighlight(id, isHighlighted) {
      return fetchJSON(`/admin/artworks/${id}/highlight`, { method: "PATCH", body: JSON.stringify({ isHighlighted }) });
    },
    deleteArtwork(id) {
      return fetchJSON(`/admin/artworks/${id}`, { method: "DELETE" });
    },
    lockUser(id, isActive) {
      return fetchJSON(`/admin/users/${id}/lock`, { method: "PATCH", body: JSON.stringify({ isActive }) });
    },
    setUserRole(id, role) {
      return fetchJSON(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
    },
  },
};
