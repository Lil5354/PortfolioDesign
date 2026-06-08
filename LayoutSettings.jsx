import { useState, useEffect } from 'react';
import { t } from './lib/i18n.jsx';
import { fetchSiteContent } from './lib/site-content.js';
import { ArrowLeft, Plus, Edit2, Trash2, Save, Check, Settings, Image as ImageIcon, Layout, Type, AlertCircle } from 'lucide-react';

const PAGE_TABS = [
  { id: 'home', label: 'Homepage', icon: Layout },
  { id: 'about', label: 'About Page', icon: Layout },
  { id: 'footer', label: 'Footer', icon: Layout },
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
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, [activePage]);

  async function loadData() {
    setLoading(true);
    try {
      const [secRes, setRes] = await Promise.all([
        fetch('/api/site-sections'),
        fetch('/api/site-settings'),
      ]);
      if (!secRes.ok || !setRes.ok) throw new Error('API error');
      const allSections = await secRes.json();
      const allSettings = await setRes.json();
      if (!Array.isArray(allSections)) throw new Error('Invalid sections data');
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
      let res;
      if (item.id) {
        res = await fetch(`/api/site-section-items/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } else {
        res = await fetch(`/api/site-sections/${item.sectionId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Save failed (${res.status})`);
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
      await fetchSiteContent();
    } catch (e) {
      setError('Failed to delete');
    }
  }

  async function saveSetting(key, value) {
    setSavingKey(key);
    setError('');
    setSavedKey(null);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Save failed (${res.status})`);
      }
      setSettings((prev) => ({ ...prev, [key]: value }));
      setSavedKey(key);
      await fetchSiteContent();
      setTimeout(() => setSavedKey(null), 2000);
    } catch (e) {
      setError(`Failed to save "${key}": ${e.message}`);
    }
    setSavingKey(null);
  }

  function renderContentEditor(content, onChange) {
    const fields = Object.keys(content || {});
    return (
      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <Type className="w-10 h-10 mb-3 opacity-50" />
             <p className="text-sm font-medium text-gray-500">No content fields available</p>
             <p className="text-xs text-gray-400 mt-1">This section may not require custom fields.</p>
          </div>
        )}
        {fields.map((key) => {
          const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('url') || key.toLowerCase().includes('src');
          const isTextarea = key.toLowerCase().includes('description') || (typeof content[key] === 'string' && content[key].length > 80);
          
          return (
            <div key={key} className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</label>
              {isImage ? (
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      value={content[key] || ''}
                      onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                      placeholder="https://example.com/image.png"
                      className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                    />
                  </div>
                  {content[key] && (
                    <div className="relative inline-block rounded-lg overflow-hidden border border-gray-200 shadow-sm group bg-white">
                      <img src={content[key]} alt="" className="h-24 w-auto object-contain max-w-full" onError={(e) => e.target.style.display='none'} />
                      <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <a href={content[key]} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-white/90 text-gray-900 rounded-md text-xs font-semibold shadow-sm hover:bg-white transition-colors">View Original</a>
                      </div>
                    </div>
                  )}
                </div>
              ) : isTextarea ? (
                <textarea
                  value={content[key] || ''}
                  onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                  rows={4}
                  className="block w-full px-4 py-3 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all resize-y"
                  placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                />
              ) : (
                <input
                  value={content[key] || ''}
                  onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                  className="block w-full px-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                  placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <div className="text-gray-500 font-medium">Loading layout settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-8 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Layout className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Layout Settings</h2>
              <p className="text-gray-500 mt-1">Manage dynamic content for pages and sections</p>
            </div>
          </div>
          <button 
            onClick={() => setPage('admin')} 
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
            Back to Admin
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Tabs */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  Pages
                </h3>
              </div>
              <div className="p-2 flex flex-col gap-1">
                {PAGE_TABS.map((tab) => {
                  const isActive = activePage === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePage(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Simple Settings Panel (Moved to Sidebar for better layout) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  Global Variables
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {Object.keys(settings).length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No global settings.</p>
                ) : (
                  Object.entries(settings).map(([key, val]) => {
                    const isSaving = savingKey === key;
                    const isSaved = savedKey === key;
                    return (
                      <div key={key} className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{key}</label>
                        <div className="flex gap-2">
                          <input 
                            value={val} 
                            onChange={(e) => { setSavedKey(null); setSettings((p) => ({ ...p, [key]: e.target.value })); }} 
                            className="flex-1 min-w-0 px-3 py-2 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" 
                          />
                          <button
                            onClick={() => saveSetting(key, settings[key])}
                            disabled={isSaving}
                            className={`flex items-center justify-center w-10 shrink-0 rounded-lg border transition-all ${
                              isSaved 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                : isSaving 
                                  ? 'bg-gray-100 border-gray-200 text-gray-400' 
                                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                            title={isSaved ? 'Saved!' : 'Save'}
                          >
                            {isSaved ? <Check className="w-4 h-4" /> : isSaving ? <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                {PAGE_TABS.find(t => t.id === activePage)?.label} Sections
              </h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">
                {sections.length} Sections
              </span>
            </div>
            
            {sections.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                <Layout className="w-12 h-12 text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900">No sections found</h4>
                <p className="text-gray-500 mt-1 max-w-sm">There are currently no configurable sections for this page.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
                    {/* Section Header */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{SECTION_LABELS_MAP[section.section] || section.label}</h4>
                        <p className="text-xs font-mono text-gray-500 mt-0.5">{section.section}</p>
                      </div>
                      <button
                        onClick={() => setEditingItem({ sectionId: section.id, sortOrder: section.items.length, content: {} })}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-600/20"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-gray-100">
                      {section.items.length === 0 ? (
                        <div className="px-6 py-10 text-center flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <Plus className="w-6 h-6 text-gray-300" />
                          </div>
                          <p className="text-gray-500 text-sm">No items in this section. Click "Add Item" to create one.</p>
                        </div>
                      ) : (
                        section.items.map((item, idx) => (
                          <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors group">
                            {/* Visual Preview */}
                            {item.content?.imageUrl && (
                              <div className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
                                <img src={item.content.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                              </div>
                            )}
                            
                            {/* Item Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-600 text-xs font-bold mr-2 mb-1">
                                    {idx + 1}
                                  </span>
                                  <h5 className="inline text-base font-bold text-gray-900 truncate">
                                    {item.content?.title || item.content?.name || item.content?.heading || '(Untitled Item)'}
                                  </h5>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                                  <button 
                                    onClick={() => setEditingItem({ ...item, sectionId: section.id })} 
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Item"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => deleteItem(item.id)} 
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {item.content?.description && (
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {item.content.description}
                                </p>
                              )}
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                {Object.keys(item.content || {})
                                  .filter(k => k !== 'title' && k !== 'name' && k !== 'description' && k !== 'imageUrl' && k !== 'heading')
                                  .slice(0, 3)
                                  .map(k => (
                                    <span key={k} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                      {k}
                                    </span>
                                  ))
                                }
                                {Object.keys(item.content || {}).length > 5 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium text-gray-400">
                                    +{Object.keys(item.content).length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editing Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setEditingItem(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem.id ? 'Edit Item' : 'Add New Item'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Configure the content fields below.</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Layout className="w-5 h-5" />
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              {renderContentEditor(editingItem.content || {}, (newContent) => setEditingItem({ ...editingItem, content: newContent }))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex items-center justify-end gap-3 shrink-0">
              <button 
                onClick={() => setEditingItem(null)} 
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => saveItem(editingItem)}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 transition-colors shadow-sm shadow-blue-600/20"
              >
                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {saving ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
