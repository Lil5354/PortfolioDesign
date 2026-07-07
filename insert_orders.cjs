const db = require('better-sqlite3')('UEFGallery.API/gallery.db');
const uuid = require('crypto').randomUUID;

const recipientId = '3b17457f-e830-4ba5-9ce4-9d5dbf9261ef';

const insertMessage = db.prepare('INSERT INTO messages (message_id, recipient_id, sender_name, sender_email, sender_company, purpose, status, content, is_read, is_emailed, is_archived, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

// Case 1: Full info, Unread (Mới)
insertMessage.run(
    uuid(), recipientId, 'Trần Minh Hải', 'hai.tran@agency.vn', 'Creative Agency VN', 'order', 'pending',
    JSON.stringify({
        company: 'Creative Agency VN',
        phone: '0901234567',
        artworkTitle: 'Branding Campaign 2026',
        artworkId: 'art-123',
        artworkImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&h=500&fit=crop',
        description: 'Chào bạn, agency của mình rất ấn tượng với bộ branding này. Xin báo giá bản quyền thương mại và giá in ấn số lượng 500 bản cho sự kiện sắp tới.'
    }),
    0, 0, 0, new Date().toISOString()
);

// Case 2: Individual, Read (Đã xem)
insertMessage.run(
    uuid(), recipientId, 'Lê Nguyễn Quỳnh Anh', 'quynhanhle@gmail.com', null, 'order', 'pending',
    JSON.stringify({
        phone: '0987654321',
        artworkTitle: '3D Character Model',
        artworkId: 'art-456',
        artworkImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop',
        description: 'Em muốn đặt in 3D mô hình nhân vật này kích thước 15cm, vật liệu nhựa resin. Ad báo giá giúp em nhé.'
    }),
    1, 0, 0, new Date(Date.now() - 3600000 * 2).toISOString()
);

// Case 3: Plain text legacy content, Unread (Mới)
insertMessage.run(
    uuid(), recipientId, 'Phạm Công Vinh', 'vinhpc@company.com', null, 'order', 'pending',
    'Tôi muốn hỏi về chi phí thiết kế và in ấn hộp quà tặng tết như mẫu bạn đã đăng.',
    0, 0, 0, new Date(Date.now() - 3600000 * 24).toISOString()
);

// Case 4: No artwork link, just description, Read
insertMessage.run(
    uuid(), recipientId, 'Công ty In Ấn ABC', 'contact@inabc.com', 'In Ấn ABC', 'order', 'pending',
    JSON.stringify({
        company: 'In Ấn ABC',
        phone: '19001234',
        description: 'Xin chào, chúng tôi muốn hợp tác in ấn các tác phẩm đồ án tốt nghiệp của sinh viên UEF. Vui lòng phản hồi để trao đổi thêm.'
    }),
    1, 0, 0, new Date(Date.now() - 3600000 * 48).toISOString()
);

// Case 5: Full info, Read
insertMessage.run(
    uuid(), recipientId, 'Vũ Hạo Nhiên', 'nhien.vu@startup.co', 'Tech Startup', 'order', 'pending',
    JSON.stringify({
        company: 'Tech Startup',
        phone: '0933444555',
        artworkTitle: 'App UI/UX Design System',
        artworkId: 'art-789',
        artworkImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&h=500&fit=crop',
        description: 'Dự án này rất phù hợp với sản phẩm mới của chúng tôi. Chúng tôi muốn mua lại source code Figma và toàn bộ quyền sử dụng thương mại.'
    }),
    1, 0, 0, new Date(Date.now() - 3600000 * 72).toISOString()
);

console.log('Inserted 5 mock orders.');
