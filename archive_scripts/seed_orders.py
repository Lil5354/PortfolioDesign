import sqlite3
import uuid
import datetime

db_path = "c:/TÀI LIỆU NĂM CUỐI VÀ CV/prototype/UEFGallery.API/gallery.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get an admin user id
cursor.execute("SELECT user_id FROM users WHERE role = 'admin' LIMIT 1")
row = cursor.fetchone()
admin_id = row[0] if row else str(uuid.uuid4())

# Orders data
orders = [
    {
        "message_id": str(uuid.uuid4()),
        "recipient_id": admin_id,
        "sender_name": "Công ty TNHH In ấn Hoa Mai",
        "sender_email": "contact@hoamai.vn",
        "sender_company": "Hoa Mai Printing",
        "purpose": "order",
        "status": "pending",
        "content": "Chào UEF, chúng tôi muốn đặt in 100 cuốn tập san nghệ thuật của sinh viên để phân phối nội bộ. Xin vui lòng báo giá.",
        "is_read": 0,
        "is_emailed": 1,
        "is_archived": 0,
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "message_id": str(uuid.uuid4()),
        "recipient_id": admin_id,
        "sender_name": "Nhà xuất bản Kim Đồng",
        "sender_email": "order@kimdong.vn",
        "sender_company": "NXB Kim Đồng",
        "purpose": "order",
        "status": "processing",
        "content": "Yêu cầu in ấn 50 bản tạp chí Design cho triển lãm tháng tới. Đã chuyển khoản cọc 50%.",
        "is_read": 1,
        "is_emailed": 1,
        "is_archived": 0,
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(days=5)).strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "message_id": str(uuid.uuid4()),
        "recipient_id": admin_id,
        "sender_name": "Trường ĐH Văn Lang",
        "sender_email": "doitac@vanlang.edu.vn",
        "sender_company": "VLU",
        "purpose": "order",
        "status": "completed",
        "content": "Đơn hàng in 200 bản Portfolio giao lưu học thuật. Rất hài lòng về chất lượng.",
        "is_read": 1,
        "is_emailed": 1,
        "is_archived": 0,
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(days=15)).strftime("%Y-%m-%d %H:%M:%S")
    }
]

# Insert
for order in orders:
    cursor.execute("""
        INSERT INTO "messages" ("message_id", "recipient_id", "sender_name", "sender_email", "sender_company", "purpose", "status", "content", "is_read", "is_emailed", "is_archived", "created_at")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order["message_id"], order["recipient_id"], order["sender_name"], order["sender_email"], 
        order["sender_company"], order["purpose"], order["status"], order["content"], 
        order["is_read"], order["is_emailed"], order["is_archived"], order["created_at"]
    ))

conn.commit()
print("Seeded 3 orders successfully!")
conn.close()
