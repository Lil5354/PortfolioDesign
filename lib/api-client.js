const BASE = "/api";

async function fetchJSON(url, options = {}) {
  const { headers: optHeaders, ...rest } = options;
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${url}`, {
    credentials: "omit",
    headers: { 
      "Content-Type": "application/json", 
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...optHeaders 
    },
    ...rest,
  });
  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }
  }
  
  if (!res.ok) {
    let errMsg = data.error || data.message;
    if (!errMsg && data.errors) errMsg = Object.values(data.errors).flat().join(", ");
    throw new Error(errMsg || `HTTP ${res.status}`);
  }
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
    feed(params = {}) {
      return fetchJSON(`/artworks/feed?${new URLSearchParams(params)}`);
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
    analyzeArtworkWithAI(fileOrUrl) {
      return fetchJSON(`/ai/analyze-artwork`, {
        method: "POST",
        body: JSON.stringify({ imageBase64: fileOrUrl })
      });
    },
    unlike(id) {
      return fetchJSON(`/artworks/${id}/like`, { method: "DELETE" });
    },
    incrementView(id) {
      return fetchJSON(`/artworks/${id}/view`, { method: "PATCH" });
    },
    grade(id, body) {
      return fetchJSON(`/artworks/${id}/grade`, { method: "POST", body: JSON.stringify(body) });
    },
    comments: {
      list(artworkId) {
        return fetchJSON(`/artworks/${artworkId}/comments`);
      },
      create(artworkId, payload) {
        if (typeof payload === 'string') payload = { content: payload };
        return fetchJSON(`/artworks/${artworkId}/comments`, { method: "POST", body: JSON.stringify(payload) });
      },
      update(artworkId, commentId, payload) {
        return fetchJSON(`/artworks/${artworkId}/comments/${commentId}`, { method: "PUT", body: JSON.stringify(payload) });
      },
      delete(artworkId, commentId) {
        return fetchJSON(`/artworks/${artworkId}/comments/${commentId}`, { method: "DELETE" });
      }
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
      return fetchJSON("/users/profile", { method: "PUT", body: JSON.stringify({ avatarUrl }) });
    },
    deleteAvatar() {
      return fetchJSON("/users/profile", { method: "PUT", body: JSON.stringify({ avatarUrl: null }) });
    },
    follow(id) {
      return fetchJSON(`/users/${id}/follow`, { method: "POST" });
    },
    unfollow(id) {
      return fetchJSON(`/users/${id}/follow`, { method: "DELETE" });
    },
    followers(id) {
      return fetchJSON(`/users/${id}/followers`);
    },
    following(id) {
      return fetchJSON(`/users/${id}/following`);
    }
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
    timeline(slug) {
      return fetchJSON(`/portfolios/${slug}/timeline`);
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
    unarchive(id) {
      return fetchJSON(`/messages/${id}/unarchive`, { method: "PATCH" });
    },
    updateStatus(id, body) {
      return fetchJSON(`/messages/${id}/status`, { method: "PATCH", body: JSON.stringify(body) });
    },
  },
  orders: {
    list(params = {}) {
      const q = new URLSearchParams(params).toString();
      return fetchJSON(`/orders${q ? `?${q}` : ""}`);
    },
  },

  collections: {
    list() { return fetchJSON("/collections"); },
    getByUser(userId) { return fetchJSON(`/collections/user/${encodeURIComponent(userId)}`); },
    get(id) { return fetchJSON(`/collections/${encodeURIComponent(id)}`); },
    create(body) { return fetchJSON("/collections", { method: "POST", body: JSON.stringify(body) }); },
    update(id, body) { return fetchJSON(`/collections/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(body) }); },
    delete(id) { return fetchJSON(`/collections/${encodeURIComponent(id)}`, { method: "DELETE" }); },
    addItem(id, body) { return fetchJSON(`/collections/${encodeURIComponent(id)}/items`, { method: "POST", body: JSON.stringify(body) }); },
    removeItem(collectionId, artworkId) { return fetchJSON(`/collections/${encodeURIComponent(collectionId)}/items/${encodeURIComponent(artworkId)}`, { method: "DELETE" }); },
    updateItemNote(collectionId, artworkId, note) { return fetchJSON(`/collections/${encodeURIComponent(collectionId)}/items/${encodeURIComponent(artworkId)}`, { method: "PATCH", body: JSON.stringify({ note }) }); },
  },

  notifications: {
    list(params = {}) {
      const q = new URLSearchParams(params).toString();
      return fetchJSON(`/notifications${q ? `?${q}` : ""}`, { cache: 'no-store' });
    },
    markRead(id) {
      return fetchJSON(`/notifications/${id}`, { method: "PUT" });
    },
    markAllRead() {
      return fetchJSON("/notifications/read-all", { method: "PUT" });
    },
    unreadCount() {
      return fetchJSON("/notifications/unread-count", { cache: 'no-store' });
    },
  },

  timeline: {
    list() {
      return fetchJSON("/timeline");
    },
    create(body) {
      return fetchJSON("/timeline", { method: "POST", body: JSON.stringify(body) });
    },
    update(id, body) {
      return fetchJSON(`/timeline/${id}`, { method: "PUT", body: JSON.stringify(body) });
    },
    delete(id) {
      return fetchJSON(`/timeline/${id}`, { method: "DELETE" });
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
    deleteUser(id) {
      return fetchJSON(`/admin/users/${id}`, { method: "DELETE" });
    },
    setUserRole(id, role) {
      return fetchJSON(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
    },
    updateUser(id, body) {
      return fetchJSON(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(body) });
    },
    importUsers(body) {
      return fetchJSON(`/admin/users/bulk`, { method: "POST", body: JSON.stringify(body) });
    },
  },

  badges: {
    list(lecturerId = "") {
      return fetchJSON(`/badges?lecturerId=${lecturerId}`);
    },
    create(body) {
      return fetchJSON("/badges", { method: "POST", body: JSON.stringify(body) });
    },
    assign(badgeId, artworkId) {
      return fetchJSON(`/badges/${badgeId}/assign/${artworkId}`, { method: "POST" });
    },
    delete(badgeId, lecturerId) {
      return fetchJSON(`/badges/${badgeId}?lecturerId=${lecturerId}`, { method: "DELETE" });
    }
  }
};
