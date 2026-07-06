const fs = require('fs');
let content = fs.readFileSync('portfolio_system.jsx', 'utf8');
let lines = content.split('\n');

// 1. Add allUserBadges state and fetch logic
const start = 7680;
const end = 8045;

const stateInsertIdx = lines.findIndex((l, i) => i >= start && l.includes('const [users, setUsers] = useState'));
lines.splice(stateInsertIdx + 1, 0, '  const [allUserBadges, setAllUserBadges] = useState([]);');

const fetchInsertIdx = lines.findIndex((l, i) => i >= start && l.includes('useEffect(() => { fetchUsers(); }, []);'));
lines.splice(fetchInsertIdx + 1, 0, `  useEffect(() => { 
    api.userBadges.list().then(res => setAllUserBadges(res)).catch(console.error);
  }, []);
`);

// 2. Add assign / unassign handlers
const handlersInsertIdx = lines.findIndex((l, i) => i >= start && l.includes('const handleSaveUser = async () =>'));
lines.splice(handlersInsertIdx, 0, `
  const handleAssignBadge = async (userId, badgeId) => {
    try {
      await api.userBadges.assign(userId, badgeId);
      // Update local state for immediate feedback
      setEditModal(prev => {
        if (!prev.user) return prev;
        const newAssignment = { badgeId, badge: allUserBadges.find(b => b.id === badgeId) };
        return { ...prev, user: { ...prev.user, userBadges: [...(prev.user.userBadges || []), newAssignment] } };
      });
      fetchUsers();
    } catch (e) { alert("Lỗi khi thêm huy hiệu: " + (e.message || "")); }
  };

  const handleUnassignBadge = async (userId, badgeId) => {
    try {
      await api.userBadges.unassign(userId, badgeId);
      setEditModal(prev => {
        if (!prev.user) return prev;
        return { ...prev, user: { ...prev.user, userBadges: (prev.user.userBadges || []).filter(b => b.badgeId !== badgeId) } };
      });
      fetchUsers();
    } catch (e) { alert("Lỗi khi xóa huy hiệu: " + (e.message || "")); }
  };
`);

// 3. Inject UI into the modal (Column 2)
// I will look for `{(editModal.user.role === 'employer' || editModal.user.role === 'guest') && (` and find its closing tag or just insert at the end of Column 2
let col2End = -1;
for (let i = start; i < end; i++) {
  if (lines[i].includes('</div>')) {
    // If the next line is `</div>` (closing the whole grid), maybe it's here
    if (lines[i+1].includes('</div>') && lines[i+2].includes('<div className="mt-8 flex justify-end gap-3 border-t pt-4">')) {
       col2End = i;
       break;
    }
  }
}

if (col2End !== -1) {
  const uiCode = `
                {/* Huy hiệu User */}
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold text-[#1a4ba8] mb-3">Huy hiệu Tài khoản</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editModal.user.userBadges || []).map(ub => (
                      <div key={ub.badgeId} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                        {ub.badge?.iconUrl ? <img src={ub.badge.iconUrl} className="w-5 h-5 object-cover rounded" alt="icon" /> : <div className="w-5 h-5 bg-blue-100 text-blue-800 text-xs flex items-center justify-center rounded font-bold">{ub.badge?.name?.substring(0, 2)}</div>}
                        <span className="text-sm font-medium">{ub.badge?.name}</span>
                        <button onClick={() => handleUnassignBadge(editModal.user.id, ub.badgeId)} className="text-gray-400 hover:text-red-500 ml-1"><X size={14}/></button>
                      </div>
                    ))}
                    {(!editModal.user.userBadges || editModal.user.userBadges.length === 0) && <span className="text-gray-400 text-sm italic">Chưa có huy hiệu nào</span>}
                  </div>
                  <div className="flex gap-2">
                    <select id="badgeSelect" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm flex-1">
                      <option value="">-- Chọn huy hiệu để thêm --</option>
                      {allUserBadges.filter(b => !(editModal.user.userBadges || []).some(ub => ub.badgeId === b.id)).map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <button onClick={() => {
                      const sel = document.getElementById('badgeSelect');
                      if (sel.value) handleAssignBadge(editModal.user.id, sel.value);
                    }} className="bg-gray-100 px-3 py-1.5 rounded border border-gray-300 text-sm font-medium hover:bg-gray-200">
                      Thêm
                    </button>
                  </div>
                </div>
  `;
  lines.splice(col2End, 0, uiCode);
} else {
  console.log("Failed to find insertion point for UI");
}

fs.writeFileSync('portfolio_system.jsx', lines.join('\\n'));
console.log("Done");
