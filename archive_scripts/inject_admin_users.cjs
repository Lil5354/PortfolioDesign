const fs = require('fs');

let content = fs.readFileSync('portfolio_system.jsx', 'utf8');

// 1. Add roleFilter state to AdminUsersPage
const stateTarget = `const [searchQuery, setSearchQuery] = useState("");
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });`;

const stateReplace = `const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });`;

content = content.replace(stateTarget, stateReplace);

// 2. Add the Role Filter Dropdown UI
const searchBarTarget = `<div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={16} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("searchUser")} className="pl-10 pr-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm w-64 outline-none focus:border-[#1a4ba8]" />
            </div>`;

const searchBarReplace = `<select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm text-[#212121] outline-none focus:border-[#1a4ba8] font-normal transition-colors cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="student">Sinh viên</option>
              <option value="lecturer">Giảng viên</option>
              <option value="guest">Khách (Guest)</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={16} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm tài khoản..." className="pl-10 pr-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm w-64 outline-none focus:border-[#1a4ba8] font-normal text-[#212121]" />
            </div>`;

content = content.replace(searchBarTarget, searchBarReplace);

// 3. Update the filter logic in the table
const filterTarget = `users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => {`;

const filterReplace = `users.filter(u => {
                const matchSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
                const matchRole = roleFilter === "all" || u.role === roleFilter;
                return matchSearch && matchRole;
              }).map(u => {`;

content = content.replace(filterTarget, filterReplace);

// Update table headers to not be capitalized randomly
const headersTarget = `<thead>
              <tr>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("fullNameHeader")}</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("email")}</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("role")}</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("joinDate")}</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("actions")}</th>
              </tr>
            </thead>`;

const headersReplace = `<thead>
              <tr>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-sm font-medium rounded-tl-lg">Họ và tên</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-sm font-medium">Email</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-sm font-medium">Vai trò</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-sm font-medium">Ngày tham gia</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-center px-4 py-3 text-sm font-medium rounded-tr-lg">Thao tác</th>
              </tr>
            </thead>`;

content = content.replace(headersTarget, headersReplace);


fs.writeFileSync('portfolio_system.jsx', content);
console.log("Updated AdminUsersPage to include Role Filter and styling tweaks.");
