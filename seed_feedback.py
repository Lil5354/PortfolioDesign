import sqlite3
import uuid
import datetime

conn = sqlite3.connect('UEFGallery.API/gallery.db')
cur = conn.cursor()

lecturer_id = '6b8722a7-9212-4610-a672-331ef77e806f'
student_id = '06ba1d67-bfd2-4557-b914-1ac4a32404a4'

messages = [
    # Lecturer to Student (Feedback)
    {
        'id': str(uuid.uuid4()), 'recipient': student_id, 
        'name': 'Lecturer Account', 'email': 'lecturer@uef.edu.vn', 'company': 'UEF',
        'purpose': 'feedback', 'status': 'pending', 
        'content': '[Feedback cho tác phẩm: Geometric Poster Series #119]\n\nChào em, thầy có xem qua poster của em. Bố cục ổn nhưng mảng màu chưa thực sự tương phản tốt. Em thử cân nhắc dùng palette màu khác nhé.',
        'time': (datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat()
    },
    # Student to Lecturer (Reply)
    {
        'id': str(uuid.uuid4()), 'recipient': lecturer_id, 
        'name': 'Student Account', 'email': 'sv@uef.edu.vn', 'company': None,
        'purpose': 'feedback', 'status': 'processing', 
        'content': '[Feedback cho tác phẩm: Geometric Poster Series #119]\n\nDạ em cảm ơn thầy đã góp ý. Em đã cập nhật lại bản thiết kế mới với palette màu sáng hơn ạ.',
        'time': (datetime.datetime.now() - datetime.timedelta(minutes=45)).isoformat()
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
print("Seeded feedback successfully!")
conn.close()
