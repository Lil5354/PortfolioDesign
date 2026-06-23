const http = require('http');

http.get('http://localhost:5000/api/artworks', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const id = parsed.artworks[0].id;
      console.log('Found artwork ID:', id);
      
      http.get(`http://localhost:5000/api/artworks/${id}`, (res2) => {
        let data2 = '';
        res2.on('data', (chunk) => data2 += chunk);
        res2.on('end', () => {
          console.log('Status Code:', res2.statusCode);
          console.log('Response Length:', data2.length);
          if (res2.statusCode !== 200) {
            console.log('Error Body:', data2);
          } else {
             console.log('First 500 chars:', data2.substring(0, 500));
          }
        });
      });
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      console.log(data);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
