import { useState, useEffect } from 'react';

let cachedSections = null;
let cachedSettings = {};
let listeners = [];
let version = 0;

function notifyListeners() {
  version++;
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
  const [v, setV] = useState(version);

  useEffect(() => {
    if (!cachedSections) {
      fetchSiteContent();
    }
    const handler = () => setV(v => v + 1);
    listeners.push(handler);
    return () => { listeners = listeners.filter(fn => fn !== handler); };
  }, []);

  return {
    sections: cachedSections || [],
    settings: cachedSettings || {},
    loading: !cachedSections,
    refresh: fetchSiteContent,
    getContentByPage,
    getContentBySection,
    getContentItems,
    getSetting,
  };
}
