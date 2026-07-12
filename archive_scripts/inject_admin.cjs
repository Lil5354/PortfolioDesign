const fs = require('fs');
const file = 'portfolio_system.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add allUserBadges state and fetch logic
const stateTarget = `const [users, setUsers] = useState([]);`;
const stateReplacement = `const [users, setUsers] = useState([]);
  const [allUserBadges, setAllUserBadges] = useState([]);`;
content = content.replace(stateTarget, stateReplacement);

const fetchTarget = `useEffect(() => { fetchUsers(); }, []);`;
const fetchReplacement = `useEffect(() => { 
    fetchUsers(); 
    api.userBadges.list().then(res => setAllUserBadges(res)).catch(console.error);
  }, []);`;
content = content.replace(fetchTarget, fetchReplacement);

// 2. Add assign / unassign handlers
const handlerTarget = `const handleSaveUser = async () => {`;
const handlerReplacement = `
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

  const handleSaveUser = async () => {`;
content = content.replace(handlerTarget, handlerReplacement);

// 3. Inject UI
// The target is the section around:
//               </div>
//             </div>
//
//             <div className="mt-8 flex justify-end gap-3 border-t pt-4">

const uiTarget = `              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-4">`;

const uiReplacement = `              </div>
                
                {/* Huy hiệu User */}
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold text-[#1a4ba8] mb-3">Huy hiệu Tài khoản</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editModal.user?.userBadges || []).map(ub => (
                      <div key={ub.badgeId} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                        {ub.badge?.iconUrl ? <img src={ub.badge.iconUrl} className="w-5 h-5 object-cover rounded" alt="icon" /> : <div className="w-5 h-5 bg-blue-100 text-blue-800 text-xs flex items-center justify-center rounded font-bold">{ub.badge?.name?.substring(0, 2)}</div>}
                        <span className="text-sm font-medium">{ub.badge?.name}</span>
                        <button onClick={() => handleUnassignBadge(editModal.user.id, ub.badgeId)} className="text-gray-400 hover:text-red-500 ml-1"><X size={14}/></button>
                      </div>
                    ))}
                    {(!editModal.user?.userBadges || editModal.user.userBadges.length === 0) && <span className="text-gray-400 text-sm italic">Chưa có huy hiệu nào</span>}
                  </div>
                  <div className="flex gap-2">
                    <select id="badgeSelect" className="border border-gray-300 rounded-md px-3 py-1.5 text-sm flex-1">
                      <option value="">-- Chọn huy hiệu để thêm --</option>
                      {allUserBadges.filter(b => !(editModal.user?.userBadges || []).some(ub => ub.badgeId === b.id)).map(b => (
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

            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-4">`;

content = content.replace(uiTarget, uiReplacement);

// 4. Update the router logic for `user_badges` page
const routerTarget = `{page === "badges" && (
        userRole === "admin" ? (
          <BadgesPage setPage={setPage} userData={userData} />
        ) : <AccessDenied setPage={setPage} />
      )}`;
const routerReplacement = `{page === "badges" && (
        userRole === "admin" ? (
          <BadgesPage setPage={setPage} userData={userData} />
        ) : <AccessDenied setPage={setPage} />
      )}
      {page === "user_badges" && (
        userRole === "admin" ? (
          <AdminUserBadgesPage setPage={setPage} userData={userData} />
        ) : <AccessDenied setPage={setPage} />
      )}`;
content = content.replace(routerTarget, routerReplacement);

// 5. Update AdminSidebar items
const sidebarTarget = `{ icon: <FileBadge size={18} />, label: "Quản lý huy hiệu", page: "badges", roles: ["admin"] },`;
const sidebarReplacement = `{ icon: <FileBadge size={18} />, label: "Huy hiệu (Ấn phẩm)", page: "badges", roles: ["admin"] },
    { icon: <FileBadge size={18} />, label: "Huy hiệu (Tài khoản)", page: "user_badges", roles: ["admin"] },`;
content = content.replace(sidebarTarget, sidebarReplacement);

fs.writeFileSync(file, content);
console.log("Successfully updated AdminUsersPage and routing");
