import { useState, useEffect } from 'react';
import { t } from './lib/i18n.jsx';
import { fetchSiteContent } from './lib/site-content.js';

const CERULEAN = '#1a4ba8';
const BLACK = '#212121';
const MUTED = '#666666';
const GRAY_LIGHT = '#E0E0E0';
const GRAY_BG = '#F8F8F8';

const PAGE_TABS = [
  { id: 'home', label: 'Homepage' },
  { id: 'about', label: 'About Page' },
  { id: 'footer', label: 'Footer' },
];
const SECTION_LABELS_MAP = {
  hero: 'Hero Banner',
  features: 'Features Cards',
  steps: 'Step Guide',
  stats: 'Statistics',
  testimonials: 'Testimonials / Quotes',
  gallery: 'Featured Artworks',
  cta: 'Call to Action',
  aboutHero: 'About Hero',
  aboutAudience: 'Audience Tabs',
  aboutValues: 'Core Values',
  aboutProcess: 'Process Steps',
  aboutCompare: 'Comparison Table',
  aboutFaq: 'FAQ',
  aboutTeam: 'Lecturer Team',
  aboutCta: 'About CTA',
  footerLinks: 'Footer Links',
  footerSocial: 'Social Media',
  footerInfo: 'Footer Info',
};

export default function LayoutSettings({ setPage }) {
  const [activePage, setActivePage] = useState('home');
  const [sections, setSections] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, [activePage]);

  async function loadData() {
    setLoading(true);
    try {
      const [secRes, setRes] = await Promise.all([
        fetch('/api/site-sections'),
        fetch('/api/site-settings'),
      ]);
      const allSections = await secRes.json();
      const allSettings = await setRes.json();
      setSections(allSections.filter((s) => s.page === activePage));
      setSettings(allSettings);
    } catch (e) {
      setError('Failed to load settings');
    }
    setLoading(false);
  }

  async function saveItem(item) {
    setSaving(true);
    setError('');
    try {
      if (item.id) {
        await fetch(`/api/site-section-items/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } else {
        await fetch(`/api/site-sections/${item.sectionId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      setEditingItem(null);
      await loadData();
      await fetchSiteContent();
    } catch (e) {
      setError('Failed to save item');
    }
    setSaving(false);
  }

  async function deleteItem(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await fetch(`/api/site-section-items/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (e) {
      setError('Failed to delete');
    }
  }

  async function saveSetting(key, value) {
    try {
      await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (e) {
      setError('Failed to save setting');
    }
  }

  function renderContentEditor(content, onChange) {
    const fields = Object.keys(content || {});
    return (
      <div className="space-y-3" style={{ maxHeight: 400, overflowY: 'auto' }}>
        {fields.length === 0 && <p style={{ fontSize: 12, color: MUTED }}>No content fields</p>}
        {fields.map((key) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 3, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
            {key.toLowerCase().includes('image') || key.toLowerCase().includes('url') || key.toLowerCase().includes('src') ? (
              <div>
                <input
                  value={content[key] || ''}
                  onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                  placeholder={`https://...`}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
                {content[key] && (
                  <img src={content[key]} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4, marginTop: 4, border: `1px solid ${GRAY_LIGHT}` }} />
                )}
              </div>
            ) : key.toLowerCase().includes('description') || (typeof content[key] === 'string' && content[key].length > 80) ? (
              <textarea
                value={content[key] || ''}
                onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
              />
            ) : (
              <input
                value={content[key] || ''}
                onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: MUTED, fontSize: 14 }}>Loading settings...</div>;
  }

  return (
    <div style={{ padding: '32px 40px', background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: BLACK }}>Layout Settings</h2>
          <p style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Manage content for Homepage, About page, and Footer</p>
        </div>
        <button onClick={() => setPage('admin')} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: '#fff', fontSize: 13, cursor: 'pointer' }}>← Back to Admin</button>
      </div>

      {error && (
        <div style={{ background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#C53030', fontSize: 12 }}>
          {error}
        </div>
      )}

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${GRAY_LIGHT}` }}>
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            style={{
              padding: '10px 20px', border: 'none', background: 'none', fontSize: 14, fontWeight: 500,
              color: activePage === tab.id ? CERULEAN : MUTED, cursor: 'pointer',
              borderBottom: activePage === tab.id ? `2px solid ${CERULEAN}` : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.length === 0 && (
          <p style={{ textAlign: 'center', color: MUTED, fontSize: 13, padding: 40 }}>No sections configured yet.</p>
        )}
        {sections.map((section) => (
          <div key={section.id} style={{ border: `1px solid ${GRAY_LIGHT}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: GRAY_BG, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${GRAY_LIGHT}` }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14, color: BLACK }}>{SECTION_LABELS_MAP[section.section] || section.label}</span>
                <span style={{ fontSize: 11, color: MUTED, marginLeft: 8 }}>({section.section})</span>
              </div>
              <button
                onClick={() => setEditingItem({ sectionId: section.id, sortOrder: section.items.length, content: {} })}
                style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: CERULEAN, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                + Add Item
              </button>
            </div>

            {section.items.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: MUTED, fontSize: 12 }}>
                No items. Click "Add Item" to create one.
              </div>
            )}

            {section.items.map((item, idx) => (
              <div key={item.id} style={{ borderBottom: `1px solid ${GRAY_LIGHT}`, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>
                    #{idx + 1} {item.content?.title || item.content?.name || '(no title)'}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditingItem({ ...item, sectionId: section.id })} style={{ padding: '3px 8px', borderRadius: 4, border: `1px solid ${GRAY_LIGHT}`, background: '#fff', fontSize: 10, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteItem(item.id)} style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid #FED7D7', background: '#FFF5F5', color: '#C53030', fontSize: 10, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
                {item.content?.imageUrl && (
                  <img src={item.content.imageUrl} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4, border: `1px solid ${GRAY_LIGHT}` }} />
                )}
                {item.content?.description && (
                  <p style={{ fontSize: 11, color: MUTED, margin: '4px 0 0' }}>{item.content.description.substring(0, 100)}{String(item.content.description).length > 100 ? '...' : ''}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Simple Settings */}
      <div style={{ marginTop: 32, border: `1px solid ${GRAY_LIGHT}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ background: GRAY_BG, padding: '12px 16px', borderBottom: `1px solid ${GRAY_LIGHT}` }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: BLACK }}>Site Settings</span>
        </div>
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Object.keys(settings).length === 0 && (
            <p style={{ color: MUTED, fontSize: 12, gridColumn: 'span 2' }}>No site settings yet.</p>
          )}
          {Object.entries(settings).map(([key, val]) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 3 }}>{key}</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input value={val} onChange={(e) => setSettings((p) => ({ ...p, [key]: e.target.value }))} style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: 'none' }} />
                <button onClick={() => saveSetting(key, settings[key])} style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: CERULEAN, color: '#fff', fontSize: 11, cursor: 'pointer' }}>Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editing Modal */}
      {editingItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setEditingItem(null)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 520, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: BLACK, margin: '0 0 8px' }}>
              {editingItem.id ? 'Edit Item' : 'Add Item'}
            </h3>
            <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Configure content fields below</p>

            {renderContentEditor(editingItem.content || {}, (newContent) => setEditingItem({ ...editingItem, content: newContent }))}

            <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingItem(null)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: '#fff', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => saveItem(editingItem)}
                disabled={saving}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: saving ? GRAY_LIGHT : CERULEAN, color: saving ? MUTED : '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
