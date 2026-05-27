const fs = require('fs');

let portfolioCode = fs.readFileSync('portfolio_system.jsx', 'utf8');

// 1. Add XLSX import at top
if (!portfolioCode.includes('import * as XLSX from "xlsx"')) {
  portfolioCode = portfolioCode.replace(
    'import { saveAs } from "file-saver";',
    'import { saveAs } from "file-saver";\nimport * as XLSX from "xlsx";'
  );
}

// 2. Refactor AdminUsersPage
const adminUsersStart = portfolioCode.indexOf('function AdminUsersPage({ setPage }) {');
const adminUsersEnd = portfolioCode.indexOf('function AdminArtworksPage({ setPage }) {');
let adminUsersCode = portfolioCode.substring(adminUsersStart, adminUsersEnd);

// Replace state
adminUsersCode = adminUsersCode.replace(
  'const [importFileName, setImportFileName] = useState("");',
  `const [importFileName, setImportFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { userRole } = useAuth();`
);

// Add handleDeleteUser and handleExportExcel
adminUsersCode = adminUsersCode.replace(
  'const handleImportFile = (e) => {',
  `const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => ({
      "Họ tên": u.fullName,
      "Email": u.email,
      "Vai trò": roleLabel[u.role] || u.role,
      "Ngày tham gia": u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—",
      "Trạng thái": u.isActive ? "Hoạt động" : "Bị khóa"
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    XLSX.writeFile(wb, "Accounts_Report.xlsx");
  };

  const handleDeleteUser = async (user) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng " + user.fullName + "?")) {
      try {
        await api.admin.deleteUser(user.id);
        fetchUsers();
      } catch (e) {
        alert("Lỗi khi xóa: " + (e.message || ""));
      }
    }
  };

  const handleImportFile = (e) => {`
);

// Update Export button
adminUsersCode = adminUsersCode.replace(
  '<button onClick={() => importInputRef.current?.click()}',
  `<button onClick={handleExportExcel} className="px-4 py-2 border border-[#077E9E] text-[#077E9E] rounded-lg text-sm font-semibold hover:bg-[#E8F4F8] transition-colors flex items-center gap-2">
              <ArrowDownCircle size={16} />
              Export Excel
            </button>
            <button onClick={() => importInputRef.current?.click()}`
);

// Update Import logic
adminUsersCode = adminUsersCode.replace(
  `    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    e.target.value = "";`,
  `    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        // Map excel row to user creation (Mock for now, normally calls API)
        alert("Đã đọc " + json.length + " dòng từ Excel. Cần API để thêm user hàng loạt.");
      } catch(e) {
        alert("Lỗi đọc file Excel");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";`
);

// Update Search input
adminUsersCode = adminUsersCode.replace(
  '<input placeholder={t("searchUser")}',
  '<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("searchUser")}'
);

// Update map to use filteredUsers
adminUsersCode = adminUsersCode.replace(
  '{users.map(u => {',
  `{users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => {`
);

// Add Delete Button and hide lock for lecturer
adminUsersCode = adminUsersCode.replace(
  `                      <button onClick={() => toggleLockUser(confirmModal.user)} className={\`px-3 py-1.5 flex items-center gap-2 rounded-md border transition-colors cursor-pointer \${locked ? 'border-[#077E9E] text-[#077E9E] hover:bg-[#077E9E] hover:text-white' : 'border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white'}\`} title={locked ? t("unlock") : t("lockAccount")}>
                        {locked ? <Unlock size={14} /> : <Lock size={14} />}
                        <span className="text-xs font-semibold">{locked ? t("unlock") : t("lockAccount")}</span>
                      </button>`,
  `                      {u.role !== "lecturer" && (
                        <button onClick={() => locked ? toggleLockUser(u) : setConfirmModal({ isOpen: true, user: u })} className={\`px-3 py-1.5 flex items-center gap-2 rounded-md border transition-colors cursor-pointer \${locked ? 'border-[#077E9E] text-[#077E9E] hover:bg-[#077E9E] hover:text-white' : 'border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white'}\`} title={locked ? t("unlock") : t("lockAccount")}>
                          {locked ? <Unlock size={14} /> : <Lock size={14} />}
                          <span className="text-xs font-semibold">{locked ? t("unlock") : t("lockAccount")}</span>
                        </button>
                      )}
                      {userRole === "admin" && (
                         <button onClick={() => handleDeleteUser(u)} className="px-3 py-1.5 ml-2 flex items-center gap-2 rounded-md border border-gray-400 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer" title="Xóa tài khoản">
                           <Trash2 size={14} />
                           <span className="text-xs font-semibold">Xóa</span>
                         </button>
                      )}`
);

// 3. Refactor AdminOrdersPage
const adminOrdersStart = portfolioCode.indexOf('function AdminOrdersPage({ setPage }) {');
const adminOrdersEnd = portfolioCode.indexOf('function AdminUsersPage({ setPage }) {');
let adminOrdersCode = portfolioCode.substring(adminOrdersStart, adminOrdersEnd);

adminOrdersCode = adminOrdersCode.replace(
  'const [orders, setOrders] = useState([]);',
  `const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);`
);

// Update mock orders
adminOrdersCode = adminOrdersCode.replace(
  `{ id: '1', senderName: 'Nguyễn Văn A', senderEmail: 'nva@example.com', purpose: 'order', content: 'Yêu cầu in 50 cuốn Portfolio chất lượng cao, bìa cứng.', createdAt: new Date().toISOString(), isRead: false },
          { id: '2', senderName: 'Trần Thị B', senderEmail: 'ttb@example.com', purpose: 'order', content: 'Cần in tập san đồ họa K16 số lượng 200 bản.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true }`,
  `{ id: '1', senderName: 'Nhà tuyển dụng A', senderEmail: 'nva@example.com', purpose: 'order', content: 'Tôi muốn mua ấn phẩm này để tham khảo thiết kế.', createdAt: new Date().toISOString(), isRead: false, artworkName: 'Kỷ niệm UEF', buyerAccount: 'nva@example.com', studentAuthor: 'Nguyễn Lê Minh Anh', artworkLink: '/gallery?id=1' },
          { id: '2', senderName: 'Trần Thị B', senderEmail: 'ttb@example.com', purpose: 'order', content: 'Cần file PDF gốc của portfolio này.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true, artworkName: 'Poster Design', buyerAccount: 'ttb@example.com', studentAuthor: 'Trần Bảo Long', artworkLink: '/gallery?id=2' }`
);

adminOrdersCode = adminOrdersCode.replace(
  `{ id: '1', senderName: 'Nguyễn Văn A', senderEmail: 'nva@example.com', purpose: 'order', content: 'Yêu cầu in 50 cuốn Portfolio chất lượng cao, bìa cứng.', createdAt: new Date().toISOString(), isRead: false },
        { id: '2', senderName: 'Trần Thị B', senderEmail: 'ttb@example.com', purpose: 'order', content: 'Cần in tập san đồ họa K16 số lượng 200 bản.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true }`,
  `{ id: '1', senderName: 'Nhà tuyển dụng A', senderEmail: 'nva@example.com', purpose: 'order', content: 'Tôi muốn mua ấn phẩm này để tham khảo thiết kế.', createdAt: new Date().toISOString(), isRead: false, artworkName: 'Kỷ niệm UEF', buyerAccount: 'nva@example.com', studentAuthor: 'Nguyễn Lê Minh Anh', artworkLink: '/gallery?id=1' },
        { id: '2', senderName: 'Trần Thị B', senderEmail: 'ttb@example.com', purpose: 'order', content: 'Cần file PDF gốc của portfolio này.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true, artworkName: 'Poster Design', buyerAccount: 'ttb@example.com', studentAuthor: 'Trần Bảo Long', artworkLink: '/gallery?id=2' }`
);

// Add modal logic
adminOrdersCode = adminOrdersCode.replace(
  '<div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm">',
  `<div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm">`
);

// Add onClick to rows
adminOrdersCode = adminOrdersCode.replace(
  '<tr key={order.id}',
  '<tr key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors"'
);
// Remove existing classname on tr
adminOrdersCode = adminOrdersCode.replace(
  'className="border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors"',
  ''
);

adminOrdersCode = adminOrdersCode.replace(
  '        </div>\n      </div>\n    </div>',
  `        </div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#212121]">Chi tiết đơn hàng</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-[#666666] hover:text-black">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Tài khoản người đặt (Buyer)</strong> <p className="text-sm font-medium">{selectedOrder.buyerAccount || selectedOrder.senderEmail}</p></div>
              <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Tên Ấn phẩm</strong> <p className="text-sm font-medium">{selectedOrder.artworkName || '—'}</p></div>
              <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Tác giả (Student)</strong> <p className="text-sm font-medium">{selectedOrder.studentAuthor || '—'}</p></div>
              <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Link liên kết</strong> <button onClick={() => setPage("gallery")} className="text-sm font-medium text-[#077E9E] hover:underline flex items-center gap-1">Chuyển đến ấn phẩm <ExternalLink size={14} /></button></div>
              <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Nội dung order</strong> <p className="text-sm font-medium bg-gray-50 p-3 rounded-lg border">{selectedOrder.content}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>`
);

portfolioCode = portfolioCode.substring(0, adminOrdersStart) + adminOrdersCode + adminUsersCode + portfolioCode.substring(adminUsersEnd);

fs.writeFileSync('portfolio_system.jsx', portfolioCode);
console.log('portfolio_system.jsx updated successfully');
