const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('UEFGallery.API/gallery.db');

db.serialize(() => {
    db.run("DELETE FROM messages WHERE content LIKE '[Feedback cho tác phẩm:%'");

    const lecturer_id = '6b8722a7-9212-4610-a672-331ef77e806f';
    const student_id = '06ba1d67-bfd2-4557-b914-1ac4a32404a4';
    const artworkId = '119';
    const artworkTitle = 'Geometric Poster Series #119';
    const artworkImage = 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/409d22161726005.63ce0985a97db.jpg';

    const msg1 = {
        id: require('crypto').randomUUID(),
        recipient: student_id,
        name: 'Lecturer Account',
        email: 'lecturer@uef.edu.vn',
        company: 'UEF',
        purpose: 'feedback',
        status: 'pending',
        content: JSON.stringify({
            artworkId: artworkId,
            artworkTitle: artworkTitle,
            artworkImage: artworkImage,
            description: 'Chào em, thầy có xem qua poster của em. Bố cục ổn nhưng mảng màu chưa thực sự tương phản tốt. Em thử cân nhắc dùng palette màu khác nhé.'
        }),
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    };

    const msg2 = {
        id: require('crypto').randomUUID(),
        recipient: lecturer_id,
        name: 'Student Account',
        email: 'sv@uef.edu.vn',
        company: '',
        purpose: 'feedback',
        status: 'processing',
        content: JSON.stringify({
            artworkId: artworkId,
            artworkTitle: artworkTitle,
            artworkImage: artworkImage,
            description: 'Dạ em cảm ơn thầy đã góp ý. Em đã cập nhật lại bản thiết kế mới với palette màu sáng hơn ạ.'
        }),
        time: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    };

    const stmt = db.prepare("INSERT INTO messages (message_id, recipient_id, sender_name, sender_email, sender_company, purpose, status, content, is_read, is_emailed, is_archived, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)");
    
    stmt.run([msg1.id, msg1.recipient, msg1.name, msg1.email, msg1.company, msg1.purpose, msg1.status, msg1.content, msg1.time]);
    stmt.run([msg2.id, msg2.recipient, msg2.name, msg2.email, msg2.company, msg2.purpose, msg2.status, msg2.content, msg2.time]);
    
    stmt.finalize();
    console.log('Seeded correct JSON feedback successfully!');
});
db.close();
