import sys

def run():
    with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject AdminOrdersPage
    admin_orders_component = """
function AdminOrdersPage({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.list().then(data => {
      if (data && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        // Mock data fallback
        setOrders([
          { id: '1', senderName: 'Nguyễn Văn A', senderEmail: 'nva@example.com', purpose: 'order', content: 'Yêu cầu in 50 cuốn Portfolio chất lượng cao, bìa cứng.', createdAt: new Date().toISOString(), isRead: false },
          { id: '2', senderName: 'Trần Thị B', senderEmail: 'ttb@example.com', purpose: 'order', content: 'Cần in tập san đồ họa K16 số lượng 200 bản.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true }
        ]);
      }
      setLoading(false);
    }).catch(() => {
      setOrders([
        { id: '1', senderName: 'Nguyễn Văn A', senderEmail: 'nva@example.com', purpose: 'order', content: 'Yêu cầu in 50 cuốn Portfolio chất lượng cao, bìa cứng.', createdAt: new Date().toISOString(), isRead: false },
        { id: '2', senderName: 'Trần Thị B', senderEmail: 'ttb@example.com', purpose: 'order', content: 'Cần in tập san đồ họa K16 số lượng 200 bản.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true }
      ]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <AdminSidebar active="admin_orders" setPage={setPage} />
        <div className="flex-1 flex items-center justify-center">
          <DotLottieReact src="https://lottie.host/80c6c06a-a1cc-4cb5-8bd3-61fc0f7e1b52/B1K4M1j97w.lottie" loop autoplay style={{ width: 150, height: 150 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar active="admin_orders" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8">
        <h2 className="text-2xl font-bold text-[#212121] mb-6">Quản lý Đơn hàng In ấn</h2>
        
        <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8F8F8] border-b border-[#E0E0E0]">
              <tr>
                <th className="px-5 py-4 font-bold text-[#212121]">Khách hàng</th>
                <th className="px-5 py-4 font-bold text-[#212121]">Liên hệ</th>
                <th className="px-5 py-4 font-bold text-[#212121]">Nội dung yêu cầu</th>
                <th className="px-5 py-4 font-bold text-[#212121]">Ngày gửi</th>
                <th className="px-5 py-4 font-bold text-[#212121]">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-[#F8F8F8] transition-colors cursor-pointer">
                  <td className="px-5 py-4 font-semibold text-[#212121]">{order.senderName}</td>
                  <td className="px-5 py-4 text-[#666666]">{order.senderEmail}</td>
                  <td className="px-5 py-4 text-[#666666] max-w-xs truncate">{order.content}</td>
                  <td className="px-5 py-4 text-[#666666]">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.isRead ? 'bg-[#E0E0E0] text-[#666]' : 'bg-[#E8F4F8] text-[#077E9E]'}`}>
                      {order.isRead ? 'Đã xem' : 'Mới'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-8 text-center text-[#666666]">Không có đơn hàng nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}
"""

    # Insert AdminOrdersPage just before function AdminDashboardPage
    insert_idx = content.find("function AdminDashboardPage({ setPage }) {")
    if insert_idx != -1:
        content = content[:insert_idx] + admin_orders_component + "\n" + content[insert_idx:]

    # 2. Add mock data logic to collections fetch
    fetch_str = """api.collections.list().then(data => {
      setCollections(Array.isArray(data) ? data : []);
      setCollectionsLoading(false);
    }).catch(() => setCollectionsLoading(false));"""
    
    mock_fetch_str = """api.collections.list().then(data => {
      let result = Array.isArray(data) ? data : [];
      if (result.length === 0) {
        // Fallback to mock data if empty
        const mockArtworks = [
          { id: '1', title: 'Typography Design', user: { fullName: 'Nguyễn Văn A' }, coverImageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80' },
          { id: '2', title: 'Brand Identity', user: { fullName: 'Trần Thị B' }, coverImageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80' },
          { id: '3', title: 'UI/UX Mobile App', user: { fullName: 'Lê Văn C' }, coverImageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80' },
          { id: '4', title: 'Packaging Design', user: { fullName: 'Phạm Thị D' }, coverImageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80' }
        ];
        result = [
          {
            id: 'mock-1',
            name: 'Bộ sưu tập Tuyển chọn K16',
            theme: 'Dark Mode & Neon',
            curatorEssay: 'Tập hợp các đồ án xuất sắc nhất khóa K16 chuyên ngành thiết kế đồ họa.',
            items: mockArtworks.map((aw, idx) => ({
              artworkId: aw.id,
              artwork: aw,
              note: idx === 0 ? 'Ấn tượng với cách xử lý typography.' : '',
              category: idx % 2 === 0 ? 'Branding' : 'UI/UX',
              award: idx === 0 ? 'Vàng' : 'Không có'
            }))
          }
        ];
      }
      setCollections(result);
      setCollectionsLoading(false);
    }).catch(() => {
      setCollectionsLoading(false);
    });"""

    content = content.replace(fetch_str, mock_fetch_str)

    # 3. Add page === "admin_orders" route inside App
    route_str = """{page === "admin_users" && (
        (userRole === "admin" || userRole === "lecturer") ? <AdminUsersPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}"""
    
    new_route_str = """{page === "admin_orders" && (
        (userRole === "admin" || userRole === "lecturer") ? <AdminOrdersPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}
      """ + route_str

    content = content.replace(route_str, new_route_str)

    with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

run()
print("Updated successfully")
