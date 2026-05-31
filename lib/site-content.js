import { useState, useEffect, useCallback } from 'react';

// Module-level cache so all components share the same data
let cachedSections = null;
let cachedSettings = {};
let listeners = [];

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export async function fetchSiteContent() {
  try {
    const [secRes, setRes] = await Promise.all([
      fetch('/api/site-sections'),
      fetch('/api/site-settings'),
    ]);
    cachedSections = await secRes.json();
    cachedSettings = await setRes.json();
    notifyListeners();
    return { sections: cachedSections, settings: cachedSettings };
  } catch {
    return { sections: cachedSections || [], settings: cachedSettings || {} };
  }
}

export function getContentByPage(page) {
  return (cachedSections || []).filter(s => s.page === page);
}

export function getContentBySection(page, section) {
  const s = (cachedSections || []).find(s => s.page === page && s.section === section);
  return s?.items?.[0]?.content || null;
}

export function getContentItems(page, section) {
  const s = (cachedSections || []).find(s => s.page === page && s.section === section);
  return s?.items || [];
}

export function getSetting(key) {
  return cachedSettings?.[key] || '';
}

export function useSiteContent() {
  const [ready, setReady] = useState(!!cachedSections);

  useEffect(() => {
    if (!cachedSections) {
      fetchSiteContent().then(() => setReady(true));
    }
    const handler = () => setReady(true);
    listeners.push(handler);
    return () => { listeners = listeners.filter(fn => fn !== handler); };
  }, []);

  return {
    sections: cachedSections || [],
    settings: cachedSettings || {},
    loading: !ready,
    refresh: fetchSiteContent,
    getContentByPage,
    getContentBySection,
    getContentItems,
    getSetting,
  };
}
