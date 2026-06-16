import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/users?limit=20',
  method: 'GET'
}, res2 => {
  let body = '';
  res2.on('data', d => body += d.toString());
  res2.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Total Users:', data.users.length);
      for (let i = 0; i < Math.min(3, data.users.length); i++) {
        const u = data.users[i];
        console.log(`User ${i}: avatarUrl length =`, u.avatarUrl ? u.avatarUrl.length : 0);
        console.log(`User ${i}: artworks length =`, u.artworks ? u.artworks.length : 0);
        console.log(`User ${i}: JSON size =`, JSON.stringify(u).length);
      }
    } catch(e) {
      console.error(e);
      console.log('Body start:', body.slice(0, 500));
    }
  });
});
req.end();
