const fs = require('fs');
let content = fs.readFileSync('portfolio_system.jsx', 'utf8');

const targetFunc = `function AdminUserBadgesPage({ setPage, userData }) {
  const [badges, setBadges] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [newBadge, setNewBadge] = React.useState({ name: '', description: '', targetCohort: '', iconUrl: '' });
  const [creating, setCreating] = React.useState(false);
  const fileInputRef = React.useRef(null);`;

const replaceFunc = `function AdminUserBadgesPage({ setPage, userData }) {
  const [badges, setBadges] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [newBadge, setNewBadge] = React.useState({ name: '', description: '', targetCohort: '', iconUrl: '' });
  const [creating, setCreating] = React.useState(false);
  const [editingBadge, setEditingBadge] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const editFileInputRef = React.useRef(null);`;

content = content.replace(targetFunc, replaceFunc);

const targetHandlers = `  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xoá huy hiệu này?')) return;
    try {
      await api.userBadges.delete(id);
      setBadges(badges.filter(b => b.id !== id));
    } catch (e) {
      alert('Lỗi khi xoá');
    }
  };`;

const replaceHandlers = `  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xoá huy hiệu này?')) return;
    try {
      await api.userBadges.delete(id);
      setBadges(badges.filter(b => b.id !== id));
    } catch (e) {
      alert('Lỗi khi xoá');
    }
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setEditingBadge(prev => ({ ...prev, iconUrl: data.url }));
    } catch (err) {
      console.error(err);
      alert('Lỗi upload ảnh');
    }
  };

  const handleUpdate = async () => {
    if (!editingBadge.name.trim()) return alert('Vui lòng nhập tên huy hiệu');
    setUpdating(true);
    try {
      await api.userBadges.update(editingBadge.id, editingBadge);
      setEditingBadge(null);
      fetchBadges();
    } catch (e) {
      alert('Lỗi khi cập nhật huy hiệu');
    } finally {
      setUpdating(false);
    }
  };`;

content = content.replace(targetHandlers, replaceHandlers);

const targetUI = `              <button onClick={() => handleDelete(b.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>`;

const replaceUI = `              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setEditingBadge(b)} className="text-gray-400 hover:text-blue-500">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>`;

content = content.replace(new RegExp(targetUI.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replaceUI);

const targetModal = `      </div>
    </div>
  );
}`;

const replaceModal = `      </div>

      {editingBadge && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col p-6">
            <h3 className="text-lg font-bold mb-4">Sửa huy hiệu</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên huy hiệu</label>
                <input className="w-full border p-2 rounded text-sm" value={editingBadge.name} onChange={e => setEditingBadge({ ...editingBadge, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả / Note</label>
                <input className="w-full border p-2 rounded text-sm" value={editingBadge.description || ''} onChange={e => setEditingBadge({ ...editingBadge, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Khóa (VD: K2020)</label>
                <input className="w-full border p-2 rounded text-sm" value={editingBadge.targetCohort || ''} onChange={e => setEditingBadge({ ...editingBadge, targetCohort: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <div className="flex items-center gap-3">
                  <input type="file" className="hidden" ref={editFileInputRef} onChange={handleEditImageUpload} accept="image/*" />
                  <button onClick={() => editFileInputRef.current?.click()} className="bg-gray-100 px-3 py-1.5 rounded text-sm hover:bg-gray-200">Đổi Icon</button>
                  {editingBadge.iconUrl && <img src={editingBadge.iconUrl} alt="icon" className="w-8 h-8 object-cover rounded" />}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditingBadge(null)} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">Hủy</button>
              <button onClick={handleUpdate} disabled={updating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50">{updating ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}`;

content = content.replace(targetModal, replaceModal);

fs.writeFileSync('portfolio_system.jsx', content);
console.log("Done adding edit feature.");
