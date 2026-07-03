import { useState, useEffect } from 'react';
import { t } from './lib/i18n.jsx';
import { fetchSiteContent } from './lib/site-content.js';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Save, Check, Settings, 
  Image as ImageIcon, Layout, Type, AlertCircle, Eye, 
  ChevronDown, Globe, BarChart3, LayoutGrid, ListOrdered, Quote, Megaphone,
  GripVertical, PenLine, Layers, Info, PanelBottom, ChevronRight, X
} from 'lucide-react';

const PAGE_TABS = [
  { id: 'home', label: 'Homepage', icon: Layout },
  { id: 'about', label: 'About Page', icon: Info },
  { id: 'footer', label: 'Footer', icon: PanelBottom },
];

const SECTION_LABELS_MAP = {
  hero: { label: 'Hero Banner', icon: ImageIcon },
  features: { label: 'Features Cards', icon: LayoutGrid },
  steps: { label: 'Step Guide', icon: ListOrdered },
  stats: { label: 'Statistics', icon: BarChart3 },
  testimonials: { label: 'Testimonials / Quotes', icon: Quote },
  gallery: { label: 'Featured Artworks', icon: ImageIcon },
  cta: { label: 'Call to Action', icon: Megaphone },
  aboutHero: { label: 'About Hero', icon: ImageIcon },
  aboutAudience: { label: 'Audience Tabs', icon: LayoutGrid },
  aboutValues: { label: 'Core Values', icon: ListOrdered },
  aboutProcess: { label: 'Process Steps', icon: ListOrdered },
  aboutCompare: { label: 'Comparison Table', icon: LayoutGrid },
  aboutFaq: { label: 'FAQ', icon: Type },
  aboutTeam: { label: 'Lecturer Team', icon: LayoutGrid },
  aboutCta: { label: 'About CTA', icon: Megaphone },
  footerLinks: { label: 'Footer Links', icon: LayoutGrid },
  footerSocial: { label: 'Social Media', icon: LayoutGrid },
  footerInfo: { label: 'Footer Info', icon: Info },
};

const getItemDisplayTitle = (item) => {
  if (!item || !item.content) return '(Untitled Item)';
  const c = item.content;
  const explicitTitle = c.title || c.name || c.heading || c.label || c.title1 || c.question || c.quote || c.note || c.text || c.preTitle;
  if (explicitTitle) return explicitTitle;
  
  const firstString = Object.entries(c).find(([k, v]) => 
    typeof v === 'string' && 
    v.trim() !== '' && 
    !k.toLowerCase().includes('image') && 
    !k.toLowerCase().includes('url') && 
    !k.toLowerCase().includes('icon')
  );
  return firstString ? firstString[1] : '(Untitled Item)';
};

const getItemDisplayDescription = (item) => {
  if (!item || !item.content) return '';
  const c = item.content;
  const explicitDesc = c.description || c.content || c.answer || c.title2 || c.value;
  if (explicitDesc) return explicitDesc;
  const longString = Object.entries(c).find(([k, v]) => typeof v === 'string' && v.length > 20 && !k.toLowerCase().includes('image') && !k.toLowerCase().includes('url'));
  return longString ? longString[1] : '';
};

export default function LayoutSettings({ setPage }) {
  const [activePage, setActivePage] = useState('home');
  const [allSections, setAllSections] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);
  const [error, setError] = useState('');
  const [globalPanelOpen, setGlobalPanelOpen] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [secRes, setRes] = await Promise.all([
        fetch('/api/site-sections', { cache: 'no-store' }),
        fetch('/api/site-settings', { cache: 'no-store' }),
      ]);
      if (!secRes.ok || !setRes.ok) throw new Error('API error');
      const data = await secRes.json();
      const allSettings = await setRes.json();
      if (!Array.isArray(data)) throw new Error('Invalid sections data');
      setAllSections(data);
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
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      if (item.id) {
        res = await fetch(`/api/site-section-items/${item.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(item),
        });
      } else {
        res = await fetch(`/api/site-sections/${item.sectionId}/items`, {
          method: 'POST',
          headers,
          body: JSON.stringify(item),
        });
      }
      if (!res.ok) {
        throw new Error(`Save failed (${res.status})`);
      }
      setEditingItem(null);
      await loadData();
      await fetchSiteContent();
    } catch (e) {
      setError(`Failed to save item: ${e.message}`);
    }
    setSaving(false);
  }

  async function deleteItem(id) {
    if (!confirm('Delete this item?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/site-section-items/${id}`, { method: 'DELETE', headers });
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
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error(`Save failed`);
      
      setSettings((prev) => ({ ...prev, [key]: value }));
      setSavedKey(key);
      await fetchSiteContent();
      setTimeout(() => setSavedKey(null), 2000);
    } catch (e) {
      setError(`Failed to save "${key}"`);
    }
    setSavingKey(null);
  }

  const sections = allSections.filter((s) => s.page === activePage).sort((a, b) => a.sortOrder - b.sortOrder);

  function renderContentEditor(content, onChange) {
    const fields = Object.keys(content || {});
    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <Type className="w-10 h-10 mb-3 opacity-50" />
             <p className="text-sm font-medium text-gray-500">Không có trường dữ liệu</p>
          </div>
        )}
        {fields.map((key) => {
          const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('url') || key.toLowerCase().includes('src') || key.toLowerCase().includes('avatar');
          const isTextarea = key.toLowerCase().includes('description') || (typeof content[key] === 'string' && content[key].length > 80);
          
          return (
            <div key={key} className="space-y-1.5">
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
                    </div>
                  )}
                </div>
              ) : isTextarea ? (
                <textarea
                  value={content[key] || ''}
                  onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                  rows={4}
                  className="block w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={content[key] || ''}
                  onChange={(e) => onChange({ ...content, [key]: e.target.value })}
                  className="block w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center h-full text-gray-500">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1a4ba8] rounded-full animate-spin mb-4"></div>
      <p className="font-medium text-sm">Đang tải cấu hình Layout...</p>
    </div>
  );

  return (
    <div className="flex-1 bg-[#F8F8F8] relative">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
            <AlertCircle size={18} />
            {error}
            <button onClick={() => setError('')} className="ml-auto opacity-70 hover:opacity-100"><X size={16}/></button>
          </div>
        )}

        {/* TOP BAR */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1a4ba8] flex items-center justify-center flex-shrink-0">
                <Layout className="w-[22px] h-[22px]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Cài đặt Layout</h2>
                <p className="text-sm text-gray-500 mt-0.5">Chỉnh sửa nội dung động hiển thị trên từng trang của website</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage('home')} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                <Eye size={16} /> Xem trước
              </button>
              <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group">
                <ArrowLeft size={16} className="text-gray-400 group-hover:-translate-x-1 transition-transform" /> Về Dashboard
              </button>
            </div>
          </div>

          {/* PAGE TABS */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit overflow-x-auto">
            {PAGE_TABS.map(tab => {
              const count = allSections.filter(s => s.page === tab.id).length;
              const isActive = activePage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePage(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${isActive ? 'bg-white text-[#1a4ba8] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  <Icon size={15} />
                  {tab.label}
                  <span className={`text-[11px] font-bold px-1.5 rounded-full ${isActive ? 'bg-blue-50 text-[#1a4ba8]' : 'bg-gray-200 text-gray-500'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

          {/* LEFT: TOC + Global Vars */}
          <div className="space-y-4 lg:sticky lg:top-6">
            
            {sections.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Trong trang này</h3>
                  <span className="text-[11px] font-bold text-gray-400">{sections.length} mục</span>
                </div>
                <div className="p-2">
                  {sections.map((sec, i) => {
                    const secDef = SECTION_LABELS_MAP[sec.section] || { label: sec.section, icon: Layout };
                    const Icon = secDef.icon;
                    return (
                      <a key={sec.id} href={`#sec-${sec.id}`} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group">
                        <div className="w-7 h-7 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                          <Icon size={14} />
                        </div>
                        <span className="flex-1 text-sm font-medium truncate">{secDef.label}</span>
                        <span className="text-[11px] text-gray-400 font-semibold">{sec.items?.length || 0}</span>
                        <ChevronRight size={14} className="text-gray-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2"><Layers size={18} /></div>
                  <p className="text-sm text-gray-500">Trang này chưa có section nào.</p>
                </div>
              </div>
            )}

            {/* Global Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div 
                className="px-4 py-3 flex items-center justify-between select-none cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setGlobalPanelOpen(!globalPanelOpen)}
              >
                <span className="flex items-center gap-2 text-sm font-bold text-gray-900"><Globe size={15} className="text-gray-500" />Thông tin chung</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${globalPanelOpen ? 'rotate-180' : ''}`} />
              </div>
              {globalPanelOpen && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100">
                  <div className="space-y-1.5 pt-3">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tên website <span className="font-mono text-gray-400 font-normal">(siteName)</span></label>
                    <div className="flex gap-2">
                      <input 
                        value={settings['siteName'] || ''}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" 
                      />
                      <button 
                        onClick={() => saveSetting('siteName', settings['siteName'])}
                        disabled={savingKey === 'siteName'}
                        className="flex items-center justify-center w-10 shrink-0 rounded-lg border transition-all bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      >
                        {savingKey === 'siteName' ? <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div> : savedKey === 'siteName' ? <Check size={16} className="text-green-600" /> : <Check size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Màu chủ đề <span className="font-mono text-gray-400 font-normal">(themeColor)</span></label>
                    <div className="flex gap-2">
                      <div className="w-9 h-9 shrink-0 rounded-lg border border-gray-200" style={{ background: settings['themeColor'] || '#1a4ba8' }}></div>
                      <input 
                        value={settings['themeColor'] || ''}
                        onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono transition-all" 
                      />
                      <button 
                        onClick={() => saveSetting('themeColor', settings['themeColor'])}
                        disabled={savingKey === 'themeColor'}
                        className="flex items-center justify-center w-10 shrink-0 rounded-lg border transition-all bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      >
                        {savingKey === 'themeColor' ? <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div> : savedKey === 'themeColor' ? <Check size={16} className="text-green-600" /> : <Check size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Danh mục Trang chủ <span className="font-mono text-gray-400 font-normal">(homeCategories)</span></label>
                    <div className="flex gap-2">
                      <input 
                        value={settings['homeCategories'] || ''}
                        onChange={(e) => setSettings({ ...settings, homeCategories: e.target.value })}
                        placeholder="3D Art, Branding, Poster, Packaging"
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" 
                      />
                      <button 
                        onClick={() => saveSetting('homeCategories', settings['homeCategories'])}
                        disabled={savingKey === 'homeCategories'}
                        className="flex items-center justify-center w-10 shrink-0 rounded-lg border transition-all bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      >
                        {savingKey === 'homeCategories' ? <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div> : savedKey === 'homeCategories' ? <Check size={16} className="text-green-600" /> : <Check size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tên Tác Giả (Mặc định) <span className="font-mono text-gray-400 font-normal">(fallbackAuthorName)</span></label>
                    <div className="flex gap-2">
                      <input 
                        value={settings['fallbackAuthorName'] || ''}
                        onChange={(e) => setSettings({ ...settings, fallbackAuthorName: e.target.value })}
                        placeholder="Sinh viên UEF"
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" 
                      />
                      <button 
                        onClick={() => saveSetting('fallbackAuthorName', settings['fallbackAuthorName'])}
                        disabled={savingKey === 'fallbackAuthorName'}
                        className="flex items-center justify-center w-10 shrink-0 rounded-lg border transition-all bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      >
                        {savingKey === 'fallbackAuthorName' ? <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div> : savedKey === 'fallbackAuthorName' ? <Check size={16} className="text-green-600" /> : <Check size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Sections */}
          <div className="space-y-5 pb-20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 capitalize">{activePage} Sections</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">{sections.length} sections</span>
            </div>

            <div className="space-y-5">
              {sections.map((sec) => {
                const secDef = SECTION_LABELS_MAP[sec.section] || { label: sec.section, icon: Layout };
                const Icon = secDef.icon;
                const items = sec.items || [];
                
                return (
                  <section key={sec.id} id={`sec-${sec.id}`} className="scroll-mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
                    <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base leading-tight">{secDef.label}</h4>
                          <p className="text-[11px] font-mono text-gray-500">{sec.section}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setEditingItem({ sectionId: sec.id, content: {}, isNew: true })}
                        className="flex items-center gap-2 px-3.5 py-2 bg-gray-100 text-gray-700 hover:text-[#1a4ba8] rounded-xl text-sm font-semibold hover:bg-[#1a4ba8]/10 transition-colors"
                      >
                        <Plus size={15} />Thêm Mục
                      </button>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {items.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                          <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p className="text-sm font-medium">Chưa có dữ liệu</p>
                        </div>
                      ) : (
                        items.map((item, idx) => (
                          <div key={item.id} className="p-4 group hover:bg-gray-50/50 transition-colors flex items-start gap-3">
                            <GripVertical size={16} className="text-gray-300 mt-1 cursor-grab shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[15px] font-bold text-gray-900 leading-snug truncate">{getItemDisplayTitle(item)}</h5>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{getItemDisplayDescription(item)}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-2.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500 uppercase tracking-wide">
                                  {Object.keys(item.content || {}).length} trường
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingItem(item)} className="p-2 text-gray-500 hover:text-[#1a4ba8] hover:bg-[#1a4ba8]/10 rounded-lg" title="Edit"><PenLine size={16} /></button>
                              <button onClick={() => deleteItem(item.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden animate-[scaleUp_0.2s_ease-out]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem.isNew ? 'Thêm mục mới' : 'Chỉnh sửa nội dung'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {renderContentEditor(editingItem.content || {}, (newContent) => setEditingItem({ ...editingItem, content: newContent }))}
              
              {/* If it's new, allow user to add custom keys */}
              {editingItem.isNew && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">Thêm trường mới</p>
                  <div className="flex gap-2">
                    <input id="new-key-input" placeholder="Ví dụ: title, description, image..." className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
                    <button 
                      onClick={() => {
                        const val = document.getElementById('new-key-input').value.trim();
                        if(val && !editingItem.content[val]) {
                          setEditingItem({ ...editingItem, content: { ...editingItem.content, [val]: '' } });
                          document.getElementById('new-key-input').value = '';
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setEditingItem(null)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={() => saveItem(editingItem)}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#1a4ba8] rounded-xl hover:bg-[#143b87] transition-all shadow-sm shadow-blue-600/20 disabled:opacity-70"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang lưu...</>
                ) : (
                  <><Save size={16} /> Lưu thay đổi</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #BDBDBD; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}} />
    </div>
  );
}
