const fs = require('fs');
let content = fs.readFileSync('portfolio_system.jsx', 'utf8');

const componentCode = `
function AdminUserBadgesPage({ setPage, userData }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBadge, setNewBadge] = useState({ name: '', description: '', targetCohort: '', iconUrl: '' });
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = () => {
    setLoading(true);
    api.userBadges.list().then(res => {
      setBadges(res);
      setLoading(false);
    }).catch(console.error);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setNewBadge(prev => ({ ...prev, iconUrl: data.url }));
    } catch (err) {
      console.error(err);
      alert('Lỗi upload ảnh');
    }
  };

  const handleCreate = async () => {
    if (!newBadge.name.trim()) return alert('Vui lòng nhập tên huy hiệu');
    setCreating(true);
    try {
      await api.userBadges.create(newBadge);
      setNewBadge({ name: '', description: '', targetCohort: '', iconUrl: '' });
      fetchBadges();
    } catch (e) {
      alert('Lỗi khi tạo huy hiệu');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xoá huy hiệu này?')) return;
    try {
      await api.userBadges.delete(id);
      setBadges(badges.filter(b => b.id !== id));
    } catch (e) {
      alert('Lỗi khi xoá');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <AdminSidebar active="user_badges" setPage={setPage} />
      <div className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Quản lý Huy hiệu Tài khoản</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E0E0E0] mb-8">
          <h3 className="text-lg font-medium mb-4">Tạo huy hiệu mới</h3>
          <div className="flex gap-4 mb-4">
            <input className="border p-2 rounded flex-1" placeholder="Tên huy hiệu" value={newBadge.name} onChange={e => setNewBadge({ ...newBadge, name: e.target.value })} />
            <input className="border p-2 rounded flex-1" placeholder="Khóa mục tiêu (VD: K2020)" value={newBadge.targetCohort} onChange={e => setNewBadge({ ...newBadge, targetCohort: e.target.value })} />
          </div>
          <div className="flex gap-4 mb-4">
            <input className="border p-2 rounded flex-1" placeholder="Mô tả / Note" value={newBadge.description} onChange={e => setNewBadge({ ...newBadge, description: e.target.value })} />
            <div className="flex-1 flex gap-2 items-center">
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              <button onClick={() => fileInputRef.current?.click()} className="bg-gray-100 px-4 py-2 rounded text-sm hover:bg-gray-200">
                Tải lên Icon
              </button>
              {newBadge.iconUrl && <img src={newBadge.iconUrl} alt="icon" className="h-8 w-8 object-cover rounded" />}
            </div>
          </div>
          <button onClick={handleCreate} disabled={creating} className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 disabled:opacity-50">
            {creating ? 'Đang tạo...' : 'Tạo huy hiệu'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map(b => (
            <div key={b.id} className="bg-white p-6 rounded-lg shadow-sm border border-[#E0E0E0] relative flex items-start gap-4">
              <button onClick={() => handleDelete(b.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
              {b.iconUrl ? (
                 <img src={b.iconUrl} alt={b.name} className="w-12 h-12 object-cover rounded" />
              ) : (
                 <div className="w-12 h-12 bg-blue-100 text-blue-800 flex items-center justify-center rounded font-bold">{b.name.substring(0, 2)}</div>
              )}
              <div>
                <h4 className="font-semibold text-lg">{b.name}</h4>
                <p className="text-gray-500 text-sm">{b.description || 'Không có mô tả'}</p>
                {b.targetCohort && <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Khoá: {b.targetCohort}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;

const lines = content.split('\n');
const insertIdx = lines.findIndex(l => l.includes('function BadgesPage')) - 1; 

lines.splice(insertIdx, 0, componentCode);

fs.writeFileSync('portfolio_system.jsx', lines.join('\n'));
