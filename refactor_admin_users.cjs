const fs = require('fs');

let portfolioCode = fs.readFileSync('portfolio_system.jsx', 'utf8');

const adminUsersStart = portfolioCode.indexOf('function AdminUsersPage({ setPage }) {');
const adminUsersEnd = portfolioCode.indexOf('function AdminArtworksPage({ setPage }) {');

let adminUsersCode = portfolioCode.substring(adminUsersStart, adminUsersEnd);

// Replace confirmModal with full user modal state
adminUsersCode = adminUsersCode.replace(
  'const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null });',
  'const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null });\n  const [editModal, setEditModal] = useState({ isOpen: false, user: null });'
);

// Add handleEditChange and handleSaveUser
adminUsersCode = adminUsersCode.replace(
  'const toggleLockUser = async (user) => {',
  `const handleEditChange = (field, value) => {
    setEditModal(prev => ({ ...prev, user: { ...prev.user, [field]: value } }));
  };

  const handleSaveUser = async () => {
    try {
      // Mock API call to update user
      await api.admin.setUserRole(editModal.user.id, editModal.user.role); // Mock for update
      alert("Đã lưu thông tin tài khoản thành công!");
      fetchUsers();
    } catch(e) {
      alert("Lỗi khi lưu: " + (e.message || ""));
    }
    setEditModal({ isOpen: false, user: null });
  };

  const toggleLockUser = async (user) => {`
);

// Add edit/view modal layout before the last closing div of AdminUsersPage
const adminUsersLayoutEnd = adminUsersCode.lastIndexOf('</div>\n    </div>');

const editModalCode = `
      {editModal.isOpen && editModal.user && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden flex flex-col p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="font-bold text-xl text-[#212121]">Chi tiết & Chỉnh sửa Tài khoản</h3>
              <button onClick={() => setEditModal({ isOpen: false, user: null })} className="text-[#666666] hover:text-black">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột 1: Thông tin cơ bản */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#077E9E] border-b pb-2">Thông tin cơ bản</h4>
                <div className="flex items-center gap-4 mb-4">
                  <img src={editModal.user.avatarUrl || "https://via.placeholder.com/64"} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Họ và tên</label>
                    <input type="text" value={editModal.user.fullName || ""} onChange={e => handleEditChange("fullName", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input type="email" value={editModal.user.email || ""} onChange={e => handleEditChange("email", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" disabled />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Số điện thoại</label>
                  <input type="text" value={editModal.user.phone || ""} onChange={e => handleEditChange("phone", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ</label>
                  <input type="text" value={editModal.user.address || ""} onChange={e => handleEditChange("address", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Giới thiệu (Bio)</label>
                  <textarea value={editModal.user.bio || ""} onChange={e => handleEditChange("bio", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" rows={2} />
                </div>
              </div>

              {/* Cột 2: Thông tin định danh theo Role */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-semibold text-[#077E9E]">Thông tin định danh</h4>
                  <div className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-md uppercase tracking-wider">{roleLabel[editModal.user.role] || editModal.user.role}</div>
                </div>

                {editModal.user.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Mã số sinh viên (MSSV)</label>
                      <input type="text" value={editModal.user.studentId || ""} className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-1.5 text-sm font-semibold text-gray-600 cursor-not-allowed" disabled title="MSSV không thể thay đổi" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Chuyên ngành (Major)</label>
                      <input type="text" value={editModal.user.major || ""} onChange={e => handleEditChange("major", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Khóa (Cohort)</label>
                      <input type="text" value={editModal.user.cohort || ""} onChange={e => handleEditChange("cohort", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" placeholder="Ví dụ: K16" />
                    </div>
                  </>
                )}

                {editModal.user.role === 'lecturer' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Khoa công tác</label>
                      <input type="text" value={editModal.user.department || ""} onChange={e => handleEditChange("department", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Học hàm / Học vị</label>
                      <input type="text" value={editModal.user.title || ""} onChange={e => handleEditChange("title", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" placeholder="ThS, TS, v.v." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Các lớp phụ trách</label>
                      <input type="text" value={editModal.user.managedClasses ? editModal.user.managedClasses.join(", ") : ""} onChange={e => handleEditChange("managedClasses", e.target.value.split(",").map(s => s.trim()))} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" placeholder="Nhập các lớp, phân cách bằng dấu phẩy" />
                    </div>
                  </>
                )}

                {(editModal.user.role === 'employer' || editModal.user.role === 'guest') && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tên Công ty / Tổ chức</label>
                      <input type="text" value={editModal.user.company || ""} onChange={e => handleEditChange("company", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Chức vụ</label>
                      <input type="text" value={editModal.user.position || ""} onChange={e => handleEditChange("position", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Lĩnh vực (Industry)</label>
                      <input type="text" value={editModal.user.industry || ""} onChange={e => handleEditChange("industry", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                  </>
                )}
                
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-4">
              <button onClick={() => setEditModal({ isOpen: false, user: null })} className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={handleSaveUser} className="px-5 py-2 bg-[#077E9E] rounded-lg text-sm font-semibold text-white hover:bg-[#055F78]">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
`;

adminUsersCode = adminUsersCode.substring(0, adminUsersLayoutEnd) + editModalCode + adminUsersCode.substring(adminUsersLayoutEnd);

// Add row onClick for tr
adminUsersCode = adminUsersCode.replace(
  '<tr key={u.id} className="border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors">',
  '<tr key={u.id} onClick={(e) => { if (!e.target.closest("button")) setEditModal({ isOpen: true, user: u }) }} className="border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors cursor-pointer">'
);

portfolioCode = portfolioCode.substring(0, adminUsersStart) + adminUsersCode + portfolioCode.substring(adminUsersEnd);

fs.writeFileSync('portfolio_system.jsx', portfolioCode);
console.log('Admin Users refactored');
