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
      fetch('/api/site-sections?t=' + Date.now()),
      fetch('/api/site-settings?t=' + Date.now()),
    ]);
    if (!secRes.ok || !setRes.ok) throw new Error('API error');
    const sections = await secRes.json();
    const settings = await setRes.json();
    if (!Array.isArray(sections)) throw new Error('Invalid sections data');
    if (typeof settings !== 'object' || Array.isArray(settings)) throw new Error('Invalid settings data');
    cachedSections = sections;
    cachedSettings = settings;
    notifyListeners();
    return { sections, settings };
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
