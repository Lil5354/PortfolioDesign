const db = require('better-sqlite3')('UEFGallery.API/gallery.db');
const uuid = require('crypto').randomUUID;

const recipientId = 'e49b9f2d-1d5d-4840-bac1-e59ffd7e93bd'; // Anya

const insertMessage = db.prepare('INSERT INTO messages (message_id, recipient_id, sender_name, sender_email, sender_company, purpose, status, content, is_read, is_emailed, is_archived, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

// Case 1: Tuyển dụng (Unread)
insertMessage.run(
    uuid(), recipientId, 'Vũ Trần (HR Manager)', 'hr@vutran.design', 'Vũ Trần Studio', 'Tuyển dụng', null,
    'Chào Anya, phòng Nhân sự của Vũ Trần Studio rất ấn tượng với Portfolio và các đồ án 3D của bạn trên UEF Gallery. Hiện tại bên mình đang mở vị trí Junior 3D Artist, rất mong có cơ hội phỏng vấn bạn trong tuần tới. Vui lòng check email hoặc phản hồi lại tin nhắn này nhé.',
    0, 0, 0, new Date().toISOString()
);

// Case 2: Đặt hàng (Unread)
insertMessage.run(
    uuid(), recipientId, 'Nguyễn Khắc Việt', 'viet.nguyen@printco.vn', 'PrintCo', 'order', 'pending',
    JSON.stringify({
        company: 'PrintCo VN',
        phone: '0901234567',
        artworkTitle: 'Project KLTN - Tự hào Việt Nam',
        artworkId: 'art-xyz-123',
        description: 'Bên mình muốn đặt mua quyền sử dụng thiết kế bao bì này cho một dự án quà tặng Tết doanh nghiệp. Anya cho mình xin báo giá bản quyền thương mại (Commercial License) nhé.'
    }),
    0, 0, 0, new Date(Date.now() - 3600000).toISOString()
);

// Case 3: Feedback (Read)
insertMessage.run(
    uuid(), recipientId, 'ThS. Nguyễn Văn A', 'anv@uef.edu.vn', 'Khoa Thiết kế', 'Nhận xét', null,
    'Bài làm rất tốt, cách xử lý ánh sáng trong scene 3D rất có chiều sâu. Tuy nhiên em cần lưu ý lại phần typography ở trang số 4, font chữ đang hơi khó đọc khi in ấn thực tế. Cố gắng phát huy nhé!',
    1, 0, 0, new Date(Date.now() - 86400000).toISOString()
);

// Case 4: Hợp tác (Read)
insertMessage.run(
    uuid(), recipientId, 'Lê Quỳnh', 'quynh.le@freelance.vn', null, 'Hợp tác', null,
    'Chào bạn, mình đang làm một dự án game indie và cần một UI Designer. Thấy style của bạn rất hợp, nếu bạn có hứng thú nhận freelance thì ping mình nhé. Chi phí thỏa thuận.',
    1, 0, 0, new Date(Date.now() - 86400000 * 3).toISOString()
);

console.log('Inserted inbox cases for Anya.');
