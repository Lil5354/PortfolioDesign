import sqlite3
import uuid
import datetime

user_id = '80019fed-fb5a-4dca-aa5f-5db7f5f4ce9b'
now = datetime.datetime.now(datetime.UTC).isoformat()

timeline_data = [
    {
        "year": "2023",
        "title": "Giải Vàng - Vietnam Young Lions",
        "description": "Đạt giải Vàng hạng mục Design tại cuộc thi Vietnam Young Lions 2023. Tác phẩm mang tên 'Sắc Màu Văn Hóa' tôn vinh di sản Việt Nam thông qua góc nhìn thiết kế đồ họa đương đại.",
        "image_url": "https://mir-s3-cdn-cf.behance.net/projects/404/69116e156475659.Y3JvcCw4OTksNzAzLDAsMA.jpg",
        "link": "https://vietnamyounglions.net",
        "icon": "trophy"
    },
    {
        "year": "2022",
        "title": "Quán quân - Adobe Design Achievement Awards",
        "description": "Dự án Thiết kế nhận diện thương hiệu 'GreenLife' lọt vào vòng chung kết và xuất sắc giành giải Quán quân hạng mục Commercial Design của sinh viên toàn cầu.",
        "image_url": "https://mir-s3-cdn-cf.behance.net/projects/404/9310de156643265.Y3JvcCwyMDIwLDE1ODAsMCww.jpg",
        "link": "https://www.adobe.com/education/adaa.html",
        "icon": "star"
    },
    {
        "year": "2021",
        "title": "Thiết kế nổi bật - Triển lãm Sinh viên UEF",
        "description": "Tác phẩm Typography 'Sài Gòn Trong Tôi' được bình chọn là Thiết kế xuất sắc nhất tại Triển lãm nghệ thuật sinh viên Khoa Thiết kế & Nghệ thuật, Đại học UEF.",
        "image_url": "https://mir-s3-cdn-cf.behance.net/projects/404/e76313155169001.Y3JvcCw5MjIsNzIyLDY2LDA.jpg",
        "link": "https://www.uef.edu.vn",
        "icon": "palette"
    }
]

db = sqlite3.connect('gallery.db')
cursor = db.cursor()

# Optionally, delete existing timeline entries for this user
cursor.execute("DELETE FROM timeline_entries WHERE user_id = ?", (user_id,))

for item in timeline_data:
    entry_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO timeline_entries (entry_id, user_id, month, year, title, description, link_url, link_label, image_url, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (entry_id, user_id, "06", item['year'], item['title'], item['description'], item['link'], 'Xem chi tiết', item['image_url'], 0, now, now))

db.commit()
db.close()

print("Inserted 3 timeline entries successfully.")
