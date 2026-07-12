import sqlite3
import uuid
import datetime

conn = sqlite3.connect('gallery.db')
cur = conn.cursor()

lecturer_id = '6b8722a7-9212-4610-a672-331ef77e806f'
student_id = '06ba1d67-bfd2-4557-b914-1ac4a32404a4'

messages = [
    # Lecturer Messages
    {
        'id': str(uuid.uuid4()), 'recipient': lecturer_id, 
        'name': 'Nguyễn Văn A', 'email': 'nguyenvana@gmail.com', 'company': 'Tech Solutions',
        'purpose': 'collaboration', 'status': 'pending', 
        'content': 'Chào thầy, công ty Tech Solutions rất ấn tượng với bộ sưu tập các đồ án UI/UX mà thầy đang giám tuyển. Chúng tôi muốn mời thầy tham gia một workshop hướng nghiệp cho sinh viên.',
        'time': (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat()
    },
    {
        'id': str(uuid.uuid4()), 'recipient': lecturer_id, 
        'name': 'Trần Thị B', 'email': 'sv@uef.edu.vn', 'company': None,
        'purpose': 'feedback', 'status': 'processing', 
        'content': 'Dạ thưa thầy, em đã chỉnh sửa lại Typography cho đồ án môn Thiết kế Bao bì theo góp ý của thầy. Thầy xem giúp em xem đã ổn chưa ạ.',
        'time': (datetime.datetime.now() - datetime.timedelta(hours=5)).isoformat()
    },
    {
        'id': str(uuid.uuid4()), 'recipient': lecturer_id, 
        'name': 'Lê Văn Khách', 'email': 'guest@example.com', 'company': 'In ấn ABC',
        'purpose': 'inquiry', 'status': 'completed', 
        'content': 'Chào bạn, mình thấy danh sách ấn phẩm của sinh viên lớp bạn. Mình muốn xin liên hệ của nhóm thiết kế bộ nhận diện thương hiệu quán Cà phê Mộc để trao đổi mua lại bản quyền.',
        'time': (datetime.datetime.now() - datetime.timedelta(days=3)).isoformat()
    },
    # Student Messages
    {
        'id': str(uuid.uuid4()), 'recipient': student_id, 
        'name': 'HR Manager - VNG', 'email': 'hr@vng.com.vn', 'company': 'VNG Corporation',
        'purpose': 'job_offer', 'status': 'pending', 
        'content': 'Chào em, phòng Nhân sự VNG rất ấn tượng với dự án Game UI trên Portfolio của em. Em có đang tìm kiếm cơ hội thực tập vị trí UI/UX Designer không? Chúng ta có thể trao đổi thêm qua email hoặc số điện thoại.',
        'time': (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat()
    },
    {
        'id': str(uuid.uuid4()), 'recipient': student_id, 
        'name': 'Phạm Khách Hàng', 'email': 'phamkhach@gmail.com', 'company': None,
        'purpose': 'buy_artwork', 'status': 'processing', 
        'content': 'Chào bạn, mình rất thích bức tranh minh họa số 3 trong bộ sưu tập "Mùa thu Hà Nội". Bạn có bán bản in chất lượng cao (Art Print) không? Nếu có báo giá giúp mình nhé.',
        'time': (datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat()
    },
    {
        'id': str(uuid.uuid4()), 'recipient': student_id, 
        'name': 'Lecturer Account', 'email': 'lecturer@uef.edu.vn', 'company': 'UEF',
        'purpose': 'feedback', 'status': 'pending', 
        'content': 'Chào em, cô vừa xem qua bài nộp cuối kỳ. Nhìn chung bố cục tốt, nhưng phần màu sắc ở poster số 2 hơi chói. Em nên điều chỉnh lại độ bão hòa (saturation) một chút.',
        'time': (datetime.datetime.now() - datetime.timedelta(minutes=30)).isoformat()
    }
]

for m in messages:
    cur.execute("""
        INSERT INTO messages (
            message_id, recipient_id, sender_name, sender_email, sender_company, 
            purpose, status, content, is_read, is_emailed, is_archived, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)
    """, (m['id'], m['recipient'], m['name'], m['email'], m['company'], m['purpose'], m['status'], m['content'], m['time']))

conn.commit()
print("Seeded messages successfully!")
conn.close()
