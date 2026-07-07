const db = require('better-sqlite3')('UEFGallery.API/gallery.db');
const uuid = require('crypto').randomUUID;

const lecturerId = '3b17457f-e830-4ba5-9ce4-9d5dbf9261ef';
const artworkIds = [
  '00688d3b-d713-47d1-80b7-c80876e08483',
  '009082d7-e031-4ba7-8cc7-6b38ca34a53c',
  '00abb7ad-6eb6-44ba-9728-4f6980f4bba8',
  '01f5d9ac-2622-4195-ac6b-5e85cd1e8a49',
  '0405dfeb-ba93-4c67-8af0-34baa3c48181',
  '0462a833-ed18-4304-8e36-d163e45b2526',
  '052b9217-4643-44e4-a385-253898602f0f',
  '05b84a12-5fdc-4620-8fd0-b56a725ebfdc',
  '05c19579-d2fa-43e2-ad85-23bace2fd289',
  '06e58543-0068-4e82-815e-75c08e662a2d'
];

const insertItem = db.prepare('INSERT INTO collection_items (collection_item_id, lecturer_id, artwork_id, collection_name, note, theme, curator_essay, added_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

const collections = [
    { name: 'Tuyển tập Tốt nghiệp K16', theme: 'Classic', essay: 'Những đồ án xuất sắc nhất của sinh viên Khóa 16 ngành Thiết kế.', items: [0, 1, 2] },
    { name: 'Đồ án Đồ họa Cơ bản', theme: 'Modern', essay: 'Tập san lưu giữ các tác phẩm đồ họa cơ bản của sinh viên năm nhất.', items: [3, 4, 5] },
    { name: 'Thiết kế Giao diện UI/UX', theme: 'Classic', essay: 'Các dự án thiết kế trải nghiệm người dùng ấn tượng.', items: [6, 7] },
    { name: 'Nhiếp ảnh Sự kiện UEF', theme: 'Modern', essay: 'Góc nhìn qua ống kính của sinh viên trong các sự kiện trường.', items: [8, 9] },
    { name: 'Brand Identity Concepts', theme: 'Classic', essay: 'Bộ nhận diện thương hiệu sáng tạo.', items: [0, 4, 8] }
];

db.transaction(() => {
    for (const col of collections) {
        for (const idx of col.items) {
            insertItem.run(
                uuid(), lecturerId, artworkIds[idx], col.name, 'Lựa chọn xuất bản', col.theme, col.essay, new Date().toISOString()
            );
        }
    }
})();

console.log('Inserted 5 moodboards with items.');
