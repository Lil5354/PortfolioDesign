import sqlite3
import uuid
import datetime
import json

conn = sqlite3.connect('UEFGallery.API/gallery.db')
cur = conn.cursor()

# Delete previous incorrect ones
cur.execute("DELETE FROM messages WHERE content LIKE '[Feedback cho tác phẩm:%'")

lecturer_id = '6b8722a7-9212-4610-a672-331ef77e806f'
student_id = '06ba1d67-bfd2-4557-b914-1ac4a32404a4'
artworkId = '119'
artworkTitle = 'Geometric Poster Series #119'
artworkImage = 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/409d22161726005.63ce0985a97db.jpg'

messages = [
    {
        'id': str(uuid.uuid4()), 'recipient': student_id, 
        'name': 'Lecturer Account', 'email': 'lecturer@uef.edu.vn', 'company': 'UEF',
        'purpose': 'feedback', 'status': 'pending', 
        'content': json.dumps({
            'artworkId': artworkId,
            'artworkTitle': artworkTitle,
            'artworkImage': artworkImage,
            'description': 'Chào em, thầy có xem qua poster của em. Bố cục ổn nhưng mảng màu chưa thực sự tương phản tốt. Em thử cân nhắc dùng palette màu khác nhé.'
        }),
        'time': (datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat()
    },
    {
        'id': str(uuid.uuid4()), 'recipient': lecturer_id, 
        'name': 'Student Account', 'email': 'sv@uef.edu.vn', 'company': '',
        'purpose': 'feedback', 'status': 'processing', 
        'content': json.dumps({
            'artworkId': artworkId,
            'artworkTitle': artworkTitle,
            'artworkImage': artworkImage,
            'description': 'Dạ em cảm ơn thầy đã góp ý. Em đã cập nhật lại bản thiết kế mới với palette màu sáng hơn ạ.'
        }),
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
print("Seeded correct JSON feedback successfully!")
conn.close()
