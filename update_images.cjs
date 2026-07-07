const db = require('better-sqlite3')('UEFGallery.API/gallery.db');

const messages = db.prepare("SELECT message_id, content FROM messages WHERE purpose = 'order'").all();

for (const msg of messages) {
    try {
        const data = JSON.parse(msg.content);
        if (data && data.artworkImage && data.artworkImage.includes('unsplash')) {
            // Replace with real Behance images from the database
            if (msg.content.includes('Nguyễn Khắc Việt') || msg.content.includes('Project KLTN')) {
                data.artworkId = '0405dfeb-ba93-4c67-8af0-34baa3c48181';
                data.artworkTitle = 'Bedside Brand Book';
                data.artworkImage = 'https://mir-s3-cdn-cf.behance.net/projects/404/38fc51158168677.Y3JvcCwxNTc1LDEyMzEsMCwz.jpg';
            } else if (msg.content.includes('3D Character Model')) {
                data.artworkId = '093d8e57-c49e-46d8-8dd1-c804f1ea8934';
                data.artworkTitle = 'Beer Logos - VOL.1';
                data.artworkImage = 'https://mir-s3-cdn-cf.behance.net/projects/404/b32f79246762389.Y3JvcCwxOTIwLDE1MDEsMCw0Mg.jpg';
            } else {
                data.artworkId = '466ee890-512d-47e8-9dfe-f9611090a469';
                data.artworkTitle = 'New Bauhaus Style Guide';
                data.artworkImage = 'https://mir-s3-cdn-cf.behance.net/projects/404/f55c30249725605.Y3JvcCw4MDgsNjMyLDAsMA.jpg';
            }
            
            db.prepare('UPDATE messages SET content = ? WHERE message_id = ?').run(JSON.stringify(data), msg.message_id);
        }
    } catch(e) {
        // Not a JSON message or error parsing
    }
}
console.log('Updated mock messages with real artworks.');
